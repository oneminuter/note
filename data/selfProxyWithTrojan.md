# trojan 自建代理

[TOC]

## trojan 是干什么的
它是一个代理协议/软件,核心思路是把代理流量伪装成普通的 HTTPS 流量

## 前置条件
 - 域名解析，把自定义的域名指向服务器的公网IP
 - 安全组:入站放行 443(trojan 服务端口)和 80(certbot 申请/续期证书要用)

## 1. 更新系统
```shell
sudo dnf update -y
```

## 2. 安装 trojan 二进制
```shell
wget https://github.com/trojan-gfw/trojan/releases/download/v1.16.0/trojan-1.16.0-linux-amd64.tar.xz
tar -xvf trojan-1.16.0-linux-amd64.tar.xz
sudo mv trojan/trojan /usr/bin/
sudo mkdir -p /etc/trojan
```
装完可以 trojan --version 确认一下

## 3. 安装 certbot
```shell
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```
最后那行软链是为了能直接敲 certbot 而不用写全路径。

## 4. 申请 TLS 证书
```shell
sudo certbot certonly --standalone -d pxy.yourdomain.com
```
*yourdomain.com* 是自定义域名

--standalone 模式下 certbot 会自己临时起一个监听 80 端口的小服务来完成域名验证,所以这一步要求 80 端口空闲。成功后证书在:
```
/etc/letsencrypt/live/pxy.yourdomain.com/fullchain.pem
/etc/letsencrypt/live/pxy.yourdomain.com/privkey.pem
```

## 5. 写服务端配置
```shell
sudo vim /etc/trojan/config.json

# 写入如下内容
{
    "run_type": "server",
    "local_addr": "0.0.0.0",
    "local_port": 443,
    "remote_addr": "127.0.0.1",
    "remote_port": 80,
    "password": [
        "youpasswod1",
        "youpasswod2"
    ],
    "log_level": 1,
    "ssl": {
        "cert": "/etc/letsencrypt/live/pxy.yourdomain.com/fullchain.pem",
        "key": "/etc/letsencrypt/live/pxy.yourdomain.com/privkey.pem",
        "key_password": "",
        "cipher": "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384",
        "cipher_tls13": "TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_256_GCM_SHA384",
        "prefer_server_cipher": true,
        "alpn": [
            "http/1.1"
        ],
        "reuse_session": true,
        "session_ticket": false,
        "session_timeout": 600,
        "plain_http_response": "",
        "curves": "",
        "dhparam": ""
    },
    "tcp": {
        "prefer_ipv4": false,
        "no_delay": true,
        "keep_alive": true,
        "reuse_port": false,
        "fast_open": false,
        "fast_open_qlen": 20
    },
    "mysql": {
        "enabled": false,
        "server_addr": "127.0.0.1",
        "server_port": 3306,
        "database": "trojan",
        "username": "trojan",
        "password": ""
    }
}
```
几个关键字段:
 - *local_port: 443* — 对外伪装成 HTTPS,必须是 443 才像正常网站
 - *remote_addr/remote_port* — fallback 地址。有人主动探测或密码错误时,流量被原样转发到这里,对方看到的是一个正常网页而不是报错。理想情况下 127.0.0.1:80 应该真的跑着一个 nginx 站点,这是伪装的最后一环
 - *password* — 数组,可以配多个,相当于多个用户

## 6. 写 systemd 服务
```shell
sudo nano /etc/systemd/system/trojan.service
```
写入如下内容：
```
[Unit]
Description=trojan
After=network.target nss-lookup.target

[Service]
Type=simple
StandardError=journal
ExecStart=/usr/bin/trojan /etc/trojan/config.json
Restart=on-failure
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

## 7. 启动并设置开机自启
```shell
sudo systemctl daemon-reload
sudo systemctl enable trojan
sudo systemctl start trojan
sudo systemctl status trojan
```

## 8. 配置证书自动续期
Let's Encrypt 证书只有 90 天有效期,必须自动续期,否则三个月后客户端会突然连不上。
```shell
echo "0 0,12 * * * root /usr/bin/certbot renew --quiet --post-hook 'systemctl restart trojan'" | sudo tee -a /etc/crontab > /dev/null
```
装完务必跑一次演练确认链路是通的:
```
sudo certbot renew --dry-run
```

## 9. 开启 BBR 加速
这一步和 trojan 无关,是跨境链路优化。BBR 是 Google 的拥塞控制算法,在高延迟、有丢包的国际线路上比默认的 cubic 快得多,基本是这类机器的标配。
```shell
# 加载内核模块
sudo modprobe tcp_bbr

# 立即生效
sudo sysctl -w net.core.default_qdisc=fq
sudo sysctl -w net.ipv4.tcp_congestion_control=bbr

# 持久化(重启后仍生效)
sudo tee /etc/sysctl.d/99-bbr.conf << 'EOF'
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr
EOF

echo "tcp_bbr" | sudo tee /etc/modules-load.d/bbr.conf

# 验证
sysctl net.ipv4.tcp_congestion_control
```
最后一行输出 net.ipv4.tcp_congestion_control = bbr 就成功了。

## 客户端配置

服务器搭完后,客户端(Clash / v2rayN / Shadowrocket 等)填这几项:

| 项 | 值 |
|---|---|
| 类型 | trojan |
| 地址 | pxy.yuhong.space |
| 端口 | 443 |
| 密码 | config.json 里 `password` 的值 |
| SNI | pxy.yuhong.space |
| 跳过证书验证 | **否**(用的是正式证书,不需要跳过) |



