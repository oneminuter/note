# nginx 配置无缓冲输出

使用场景，在 chatgpt 的，经常看到 ai 的回答是流式输出
这里如果使用 nginx 做的服务代理，则需要加入一下配置，关闭缓冲区，才能实现流式输出

```
location / {
    # ...
    proxy_buffering off;
    proxy_request_buffering off;
    proxy_http_version 1.1;
    chunked_transfer_encoding on;
    proxy_set_header Connection '';
}
```

在上面的配置中，`proxy_buffering off` 和 `proxy_request_buffering off` 禁用了代理缓存，使 Nginx 直接将响应数据发送到客户端，从而实现了无缓冲输出。`proxy_http_version 1.1` 开启 HTTP/1.1 协议，以便支持 chunked 响应中的分块传输编码 (chunked_transfer_encoding on)。最后，`proxy_set_header Connection ''` 将连接头设置为空，以避免 Nginx 在输出时解释连接头，从而影响无缓冲输出。

请注意，上面的配置可能会对服务器端的性能产生负面影响，因为它将立即发送输出，而不考虑客户端的处理能力。因此，需要根据具体情况进行权衡和调整。