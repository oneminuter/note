# 解决 nginx 转发 websocket 报 400 错误

本地测试 websocket 没问题，但是放到线上就有问题，线上用的 nginx 做的转发代理，而本地是直接连，错误消息如下：

WebSocket failed: Error during WebSocket handshake: Unexpected response code: 400

这个错误在本地测试环境以及访问非nginx转发都没有问题，由此推断出问题应该出现在nginx转发这个环节

修改 nginx 配置文件
```
server {
        listen       80;
        server_name  domain.com;
        charset utf-8;

        location / {
            proxy_pass http://127.0.0.1:8080;
            proxy_set_header Host $host;
            proxy_http_version 1.1; 
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 60;
            proxy_read_timeout 600;
            proxy_send_timeout 600;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
}
```

其中主要是下面这 3 行
```
proxy_http_version 1.1; 
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

其中第一行是告诉nginx使用HTTP/1.1通信协议，这是websoket必须要使用的协议。

第二行和第三行告诉nginx，当它想要使用WebSocket时，响应http升级请求。

参考：https://github.com/socketio/socket.io/issues/1942