# 使用 nginx 代理 openai 请求

由于墙的原因，本地直接请求 openai 的接口是请求不通的，这时候我们只需要买一台国外服务器，在上面部署 nginx，使用 nginx 代理转发请求，就可以实现国内本地请求 openai 的接口了

nginx 配置文件示例如下
```
map $http_Authorization $apiKey {  
    # default "newValue";		# 如果没有 X-Original-Header header，则使用默认值 "newValue" ，这里没用到直接注释掉
    # ~^(.*)$ $1;         		# 如果有 Authorization header，则使用其原始值，这里没用到直接注释掉
    custom_key "sk-***Cn";		# custom_key 可以自定义名，前端传过来时需要与此对应
}

resolver 8.8.8.8;
proxy_ssl_server_name on; # 防止 ssl 握手失败

server {
    listen       80;
    server_name  [***].com; # 代理域名

    charset utf-8;

    access_log  /var/log/nginx/[***].com.log  main;  # 日志这里需要替换 [***]

    # Allow specific IP address
    # allow 192.168.0.1/32;
    # allow 192.168.0.2/32;
    # deny all;

    rewrite ^(.*)$ https://${server_name}$1 permanent;
}

server {
	listen 443 ssl;
	server_name [***].com;	# 代理域名
	ssl_certificate /usr/local/nginx/cert/[***].com.pem;		# 证书文件这里需要替换 [***]
	ssl_certificate_key /usr/local/nginx/cert/[***].com.key;	# 证书文件这里需要替换 [***]
	ssl_session_timeout 5m;
	ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
	ssl_prefer_server_ciphers on;

    # Allow specific IP address 只让指定 ip 访问，其他 IP 禁止访问
    allow  192.168.0.1/32;
    allow  192.168.0.2/32;
	deny all;

	location / {
		proxy_pass https://api.openai.com/;
		proxy_set_header Host api.openai.com;
		proxy_redirect off;
		proxy_set_header X-Real-IP $server_addr;	# 这里要用 $server_addr
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Authorization "Bearer $apiKey";	# 这里 $apiKey 对应上面的 map 第二个定义变量值
		proxy_connect_timeout 90;
		proxy_send_timeout 90;
		proxy_read_timeout 90;
		proxy_buffer_size 4k;
		proxy_buffers 4 32k;
		proxy_busy_buffers_size 64k;
		proxy_temp_file_write_size 64k;
		proxy_next_upstream http_502 http_504 http_503 error timeout invalid_header;

		proxy_buffering off;
		proxy_cache off;
    	proxy_request_buffering off;
   		proxy_http_version 1.1;
    	chunked_transfer_encoding on;
    	proxy_set_header Connection '';
	}
}

```