# linux 安装 docker-compose

方式一：

```shell
curl -L https://github.com/docker/compose/releases/download/1.24.0-rc3/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose
```

方式二：
```shell
yum update -y
yum install docker epel-release python-pip -y
pip install --upgrade pip
pip install docker-compose
```