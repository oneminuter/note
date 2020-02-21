## docker-compose 启动带密码的 redis

docker-compose.yml 文件

```
version: "3"
services:
  redis:
    image: redis
    container_name: redis_withauth
    ports:
      - 6379:6379
    volumes:
      - /Users/oneminuter/xiaolin/docker/redis/data:/data
    command: redis-server --requirepass 12345678
```

然后执行命令：
```
docker-compose up -d
```