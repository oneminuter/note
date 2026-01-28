# 使用 certbot 安装 https 所需 ssl 证书

[TOC]

## 安装 Certbot
Ubuntu/Debian

```shell
# 更新包列表
sudo apt update 

# 安装 Certbot
sudo apt install certbot

# 如果使用 Nginx
sudo apt install certbot python3-certbot-nginx

# 如果使用 Apache
sudo apt install certbot python3-certbot-apache
```

CentOS/RHEL/Fedora

```shell
# 启用 EPEL 仓库（CentOS/RHEL）
sudo yum install epel-release

# 安装 Certbot
sudo yum install certbot

# 或使用 Snap（推荐方式）
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## 申请证书的几种方法

### 方法一：使用 Webroot 插件（推荐）
适合已经运行的网站，无需停止服务

```shell
# 基本语法
sudo certbot certonly --webroot -w /var/www/html -d example.com -d www.example.com

# 示例
sudo certbot certonly --webroot -w /var/www/your-site -d yourdomain.com -d www.yourdomain.com
```

### 方法二：使用 Nginx 插件（自动配置）
```shell
# Certbot 会自动修改 Nginx 配置
sudo certbot --nginx -d example.com -d www.example.com
```

### 方法三：使用 Apache 插件
```shell
# Certbot 会自动修改 Apache 配置
sudo certbot --apache -d example.com -d www.example.com
```

### 方法四：独立模式（无 Web 服务器）
```shell
# 临时占用 80 端口，需确保端口空闲
sudo certbot certonly --standalone -d example.com -d www.example.com
```

## 证书申请流程示例
```shell
# 1. 使用交互式方式申请
sudo certbot certonly --webroot

# 按照提示输入：
# - 邮箱地址（用于续期通知）
# - 同意服务条款
# - 网站根目录路径
# - 域名（多个用空格分隔）

# 2. 或一次性指定所有参数
sudo certbot certonly --webroot \
  -w /var/www/example \
  -d example.com \
  -d www.example.com \
  -m your-email@example.com \
  --agree-tos \
  --no-eff-email
```

## 证书位置
申请成功后，证书会保存在
```
/etc/letsencrypt/live/yourdomain.com/
├── cert.pem      # 证书
├── chain.pem     # 中间证书
├── fullchain.pem # 完整证书链
└── privkey.pem   # 私钥
```

## 自动续期配置
Let's Encrypt 证书有效期为 90 天，需要定期续期
```shell
# 测试续期（不实际执行）
sudo certbot renew --dry-run

# 手动续期所有证书
sudo certbot renew

# 查看证书过期时间
sudo certbot certificates
```

## 设置自动续期
```shell
# 编辑 crontab
sudo crontab -e

# 添加以下行（每天凌晨3点检查并续期）
0 3 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

## Nginx 配置示例
```shell
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    
    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # 其他配置...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

## 端口被占用
```shell
# 停止占用 80/443 端口的服务
sudo systemctl stop nginx
sudo certbot certonly --standalone
sudo systemctl start nginx
```


## 多个域名
```shell
# 申请包含多个域名的证书
sudo certbot certonly --webroot \
  -w /var/www/site1 -d domain1.com -d www.domain1.com \
  -w /var/www/site2 -d domain2.com -d www.domain2.com
```