# nginx 配置 ssl

[TOC]

## 配置
```
server {
	listen 443 ssl;
	server_name blog.oneminuter.com;
	#ssl on;
	ssl_certificate /usr/local/nginx/cert/blog.oneminuter.com.pem;
	ssl_certificate_key /usr/local/nginx/cert/blog.oneminuter.com.key;
	ssl_session_timeout 5m;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;
	location /v1/ {
		proxy_pass http://127.0.0.1:8081/;
		proxy_redirect off;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header http_user_agent $http_user_agent;
		proxy_connect_timeout 90;
		proxy_send_timeout 90;
		proxy_read_timeout 90;
		proxy_buffer_size 4k;
		proxy_buffers 4 32k;
		proxy_busy_buffers_size 64k;
		proxy_temp_file_write_size 64k;
		proxy_next_upstream http_502 http_504 http_503 error timeout invalid_header;
	}
}
```

## 配置 http 自动转发 https
```
	# rewrite ^(.*)$ https://$host$1 permanent; # 
	rewrite ^(.*)$ https://${server_name}$1 permanent;
```

示例

```
server {
        listen       80;
        server_name  api.meitianxin.cn;

        charset utf-8;

        access_log  /srv/logs/nginx/api.access.log  main;

		# rewrite ^(.*)$ https://$host$1 permanent; # 
		rewrite ^(.*)$ https://${server_name}$1 permanent;

        location /v1/ {
            root   html;
	    	try_files $uri $uri/ /index.html;
            index  index.html index.htm;
        }

        error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }
```

## nginx 编译 ssl 模块

### 问题：当配置 ssl 后，启动 nginx 报错

报错信息：
```
nginx: [emerg] unknown directive "ssl" in /usr/local/nginx/conf/nginx.conf
```

原因是：nginx 编译的时候，没有编译 ssl 模块

### 解决步骤

1. 重新编译 nginx
回到 nginx 的解压目录，执行

```shell
./configure --with-http_ssl_module
make
```

这里不需要执行，`make install`, 因为执行 `make install` 之后就会覆盖之前的安装

执行完上面的命令后，在解压目录的 `objs` 目录下会生成一个 nginx 可执行文件，将这个文件拷贝到安装目录（/usr/local/nginx/sbin/）覆盖就好
