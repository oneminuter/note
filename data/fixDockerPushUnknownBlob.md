# 解决 docker push: unknown blob

安装 docker 私有仓库之后，配置申请了域名和免费的 ssl 证书，使用 nginx 做反向代理
但是在本地 push docker 之后，报 `unknown blob` 的错误

nginx 配置如下
```
server {
        listen       80;
		server_name  docker.oneminuter.cn;

        charset utf-8;

        access_log  /var/log/nginx/docker.access.log  main;
		error_log   /var/log/nginx/docker.error.log  error;
		client_max_body_size 0;
		rewrite ^(.*)$ https://${server_name}$1 permanent;
        location / {
			proxy_pass http://192.168.1.4:5000;
        }

        error_page  404              /404.html;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
}

server {
	listen 443 ssl;
	server_name docker.oneminuter.cn;
	access_log  /var/log/nginx/docker.access.log  main;
	error_log   /var/log/nginx/docker.error.log  error;
	ssl_certificate /etc/nginx/cert/docker.oneminuter.cn.pem;
	ssl_certificate_key /etc/nginx/cert/docker.oneminuter.cn.key;
	ssl_session_timeout 5m;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;
        client_max_body_size 0;
	location / {
		proxy_pass http://192.168.1.4:5000/;
		proxy_redirect off;
		#proxy_set_header Host $host; // unknown blob 问题，把这行注释掉就好
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header http_user_agent $http_user_agent;
		proxy_connect_timeout 90;
		proxy_send_timeout 90;
		proxy_read_timeout 90;
		proxy_next_upstream http_502 http_504 http_503 error timeout invalid_header;
	}
}
```

问题出在
```
#proxy_set_header Host $host;
```
把这行注释掉就好了