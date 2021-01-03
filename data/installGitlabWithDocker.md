# docker 搭建 gitlab

如果本地搭建，需要修改端口，不然会有端口冲突，那么可以用 docker 的方式来搭建，解决此问题
这里搭建的 `gitlab/gitlab-ce:latest` 社区版

## 创建容器
```
docker run -d --hostname gitlab.oneminuter.com \
  --publish 8443:443 --publish 8080:80 --publish 8022:22 \
  --name gitlab \
  --restart always \
  --volume /srv/gitlab/config:/etc/gitlab \
  --volume /srv/gitlab/logs:/var/log/gitlab \
  --volume /srv/gitlab/data:/var/opt/gitlab \
  --env GITLAB_OMNIBUS_CONFIG="external_url 'https://gitlab.oneminuter.com/';" \
  gitlab/gitlab-ce:latest
```

然后浏览器访问 `gitlab.oneminuter.com:8443` 就可以访问了，但是一般会报证书不受信任问题，解决方法，上 aliyun 申请免费的 SSL 证书，替换 docker 容器内的 `/etc/gitlab/ssl/gitlab.oneminuter.com.key` 和 `/etc/gitlab/ssl/gitlab.oneminuter.com.crt` 即可
注：这里的 oneminuter.com 是我的域名，和上面创建容器指定的一样，可以根据自己实际情况修改

如果自己没有域名，可以用可通过配置 /etc/hosts 用一个虚拟的域名代替

如果要去掉这个访问域名后面的 8443，可以用 nginx 代理一层
nginx 配置文件(gitlab.conf)如下:
```
server {
        listen       80;
	server_name  gitlab.oneminuter.com

        charset utf-8;

        access_log  /var/log/nginx/gitlab.access.log  main;
		error_log   /var/log/nginx/gitlab.error.log  error;
		client_max_body_size 0;
		rewrite ^(.*)$ https://${server_name}$1 permanent;
        location / {
		proxy_pass http://192.168.1.29:8080;
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

server {
	listen 443 ssl;
	server_name gitlab.oneminuter.com;
	access_log  /var/log/nginx/gitlab.access.log  main;
	error_log   /var/log/nginx/gitlab.error.log  error;
	ssl_certificate /etc/nginx/cert/gitlab.oneminuter.com.pem;
	ssl_certificate_key /etc/nginx/cert/gitlab.oneminuter.com.key;
	ssl_session_timeout 5m;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;
    client_max_body_size 0;
	location / {
	    proxy_pass https://192.168.1.29:8443/;
		proxy_redirect off;
		proxy_set_header Host $host;
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

## 配置 ssh 方式拉取代码
配置 $HOME/.ssh/config
```
Host gitlab.oneminuter.com
	Host gitlab.oneminuter.com
	Port 8022
	User git
```