# kubeadm 搭建单 etcd 节点 和 多节点 etcd 的 k8s 集群

## 机器最低需求
cpu: 2核
mem: 2G

## 升级
```
sudo apt-get update
```

## 安装 curl
```
sudo apt install curl -y
```

## 安装 docker
```
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

## 将当前用户加入 docker 用户组
这样执行 docker 命令就不需要 sudo
```
sudo usermod -aG docker
```
执行完命令只有，退出重新登录一下

## docker 加 aliyun 镜像
```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors":[
        "https://pcesedw2.mirror.aliyuncs.com"
    ],
    "exec-opts":[
        "native.cgroupdriver=systemd"
    ],
    "log-driver":"json-file",
    "log-opts":{
        "max-size":"100m"
    },
    "storage-driver":"overlay2"
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 3 台机器加 hosts
sudo vim /etc/hosts
```
192.168.13.65 k8snode-1
192.168.13.64 k8snode-2
192.168.13.63 k8snode-3
```

## 关闭selinux
```
setenforce 0
```

## 关闭 swap
```
sudo swapoff -a
```

## 查看需要提前拉取的镜像，可以知道下面 kubeadm 命令中 --kubernetes-version 传入的版本号
```
kubeadm config images list
```

## 配置阿里云镜像
```
apt-get update && apt-get install -y apt-transport-https

curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | apt-key add - 

cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF  

apt-get update
apt-get install -y kubelet kubeadm kubectl
```

## 初始化集群
```
kubeadm init --apiserver-advertise-address=192.168.13.65 --image-repository registry.aliyuncs.com/google_containers --kubernetes-version v1.22.2 --service-cidr=10.1.0.0/16 --pod-network-cidr=10.244.0.0/16 --ignore-preflight-errors=Swap
```

## 安装 calico 网络
```
kubectl apply -f https://docs.projectcalico.org/v3.14/manifests/calico.yaml
```

## 安装 flannel 网络
```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```
注：同一个集群只能使用一个网络



########################
# 高可用方案，使用外部 etcd 集群
########################


## kubelet 单元文件
由于 etcd 是首先创建的，因此你必须通过创建具有更高优先级的新文件来覆盖 kubeadm 提供的 kubelet 单元文件
注：需要在需要运行 etcd 的主机上执行
```
cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
[Service]
ExecStart=
ExecStart=/usr/bin/kubelet --address=127.0.0.1 --pod-manifest-path=/etc/kubernetes/manifests --cgroup-driver=systemd --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.5
Restart=always
EOF
```
创建文件之后需要重启 kubelet
```
systemctl daemon-reload
systemctl restart kubelet
```

## 生成 etcd 证书、配置文件
create-etcd-cluster-cert-kubeadmconfig.sh
```
#!/bin/bash

# from doc: https://kubernetes.io/zh/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/

set -x

rm -rf ./etcd ./pki ./kubeadmcfg.yaml /etc/kubernetes/pki/* /etc/kubernetes/manifests/*

### gen etcd ca
kubeadm init phase certs etcd-ca

### gen kubeadmcfg.yaml

HOST0=192.168.13.65
HOST1=192.168.13.64
HOST2=192.168.13.63

mkdir -p ./etcd/${HOST0}/ ./etcd/${HOST1}/ ./etcd/${HOST2}/

ETCDHOSTS=($HOST0 $HOST1 $HOST2)
NAMES=("infra0" "infra1" "infra2")

for i in "${!ETCDHOSTS[@]}"; do
    HOST=${ETCDHOSTS[$i]}
    NAME=${NAMES[$i]}

cat << EOF > ./etcd/${HOST}/kubeadmcfg.yaml
apiVersion: "kubeadm.k8s.io/v1beta3"
kind: ClusterConfiguration
etcd:
    local:
        serverCertSANs:
        - "${HOST}"
        peerCertSANs:
        - "${HOST}"
        extraArgs:
            initial-cluster: infra0=https://${ETCDHOSTS[0]}:2380,infra1=https://${ETCDHOSTS[1]}:2380,infra2=https://${ETCDHOSTS[2]}:2380
            initial-cluster-state: new
            name: ${NAME}
            listen-peer-urls: https://${HOST}:2380
            listen-client-urls: https://${HOST}:2379
            advertise-client-urls: https://${HOST}:2379
            initial-advertise-peer-urls: https://${HOST}:2380
imageRepository: registry.aliyuncs.com/google_containers
EOF
done

### generate cert
for i in "${!ETCDHOSTS[@]}"; do
    HOST=${ETCDHOSTS[$i]}
    NAME=${NAMES[$i]}

    kubeadm init phase certs etcd-server --config=./etcd/${HOST}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-peer --config=./etcd/${HOST}/kubeadmcfg.yaml
    kubeadm init phase certs etcd-healthcheck-client --config=./etcd/${HOST}/kubeadmcfg.yaml
    kubeadm init phase certs apiserver-etcd-client --config=./etcd/${HOST}/kubeadmcfg.yaml
    cp -R /etc/kubernetes/pki ./etcd/${HOST}/
    find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete
done

## delete member node ca.key and copy start-etcd-cluster.sh
for HOST in ${HOST1} ${HOST2}; do
    echo $HOST;

    ### delete ca.key
    find ./etcd/${HOST} -name ca.key -type f -delete

    ### gen etcd create sh file
    cat start-etcd-cluster.sh > ./etcd/${HOST}/start-etcd-cluster.sh
done

### copy file to member node
USER=xngdev
USERPASS=devxng

cp ./etcd//${HOST0}/kubeadmcfg.yaml ./
cp -r ./etcd/${HOST0}/pki ./


for HOST in ${HOST1} ${HOST2}; do
    sshpass -p ${USERPASS} ssh ${USER}@${HOST} rm -rf kubeadmcfg.yaml pki start-etcd-cluster.sh
    sshpass -p ${USERPASS} scp -r ./etcd/${HOST}/* ${USER}@${HOST}:
done
```

## 命令初始化集群
```
kubeadm init --config kubeadmcfg-external-etcd.yaml --ignore-preflight-errors=FileAvailable--etc-kubernetes-manifests-etcd.yaml --v==5
```

## 验证集群可用
```
docker run --rm -it \
--net host \
-v /etc/kubernetes:/etc/kubernetes registry.aliyuncs.com/google_containers/etcd:3.5.0-0 etcdctl \
--cert /etc/kubernetes/pki/etcd/peer.crt \
--key /etc/kubernetes/pki/etcd/peer.key \
--cacert /etc/kubernetes/pki/etcd/ca.crt \
--endpoints https://192.168.13.64:2379 endpoint health --cluster
```

start-etcd-cluster.sh
```
#!/bin/bash
set -x
rm -rf /etc/kubernetes/pki
mkdir -p /etc/kubernetes/pki
cp -r ./pki /etc/kubernetes/
kubeadm init phase etcd local --config=./kubeadmcfg.yaml
```

然后到各主机上运行 start-etcd-cluster.sh 脚本
然后重启 kubelet
```
systemctl restart kubelet
```

至此，etcd 集群搭建完毕

## 启动集群初始化
```
kubeadm init --config kubeadmcfg-external-etcd.yaml --upload-certs --ignore-preflight-errors=FileAvailable--etc-kubernetes-manifests-etcd.yaml --ignore-preflight-errors=Port-10250
```

## 注意，本例测试搭建时，将 etcd 的 member 节点搭在了 work 节点上
当 k8s 主节点初始化之后，去 join work 节点时，kubelet 启不来，那是我们在搭建 etcd 集群时增加了 /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf 文件
只需修改此文件名为非 .conf 结尾即可
```
mv /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf.etcdback
```


## 查看集群启动配置
```
kubectl -n kube-system get cm kubeadm-config -o yaml
```
