# 使用 systemd 部署应用程序

[TOC]

配置 systemd 服务来部署 Python 程序

## 创建 systemd 服务文件
```shell
vim /etc/systemd/system/test_server.service
```

## 服务配置内容
```
[Unit]
Description=Test Server Python Application
After=network.target

[Service]
Type=simple
User=dev
Group=dev
WorkingDirectory=/home/dev/test_server

# Conda 环境配置
Environment="PATH=/home/dev/miniconda3/envs/你的环境名/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="ADAPTIVE_PLANNER_PROMPTS_PATH=./xxx.yaml"
Environment="META_MCP_DISABLE_HTTPX_ASYNC=1"
Environment="cfg=prod.conf.yaml"

# 启动命令
ExecStart=/home/dev/miniconda3/envs/你的环境名/bin/uvicorn app.main:app --host 0.0.0.0 --port 8110

# 重启策略
Restart=always
RestartSec=10

# 日志配置
StandardOutput=journal
StandardError=journal
SyslogIdentifier=test_server

# 资源限制（可选）
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

## 查找 Conda 环境路径
```
# 激活你的 conda 环境
conda activate 你的环境名

# 查看 Python 路径
which python
# 输出类似：/home/build/miniconda3/envs/你的环境名/bin/python

# 查看 uvicorn 路径
which uvicorn
# 输出类似：/home/build/miniconda3/envs/你的环境名/bin/uvicorn
```

## 调整服务文件权限
```
sudo chmod 644 /etc/systemd/system/test_server.service
```

## 重载 systemd 并启动服务
```
# 重载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start test_server

# 查看服务状态
sudo systemctl status test_server

# 设置开机自启
sudo systemctl enable test_server
```

## 日志管理
```
# 查看实时日志
sudo journalctl -u test_server -f

# 查看最近 100 行日志
sudo journalctl -u test_server -n 100

# 查看今天的日志
sudo journalctl -u test_server --since today

# 清理旧日志（保留最近 7 天）
sudo journalctl --vacuum-time=7d
```

## 常用管理命令
```
# 停止服务
sudo systemctl stop test_server

# 重启服务
sudo systemctl restart test_server

# 禁用开机自启
sudo systemctl disable test_server

# 查看服务是否启用
sudo systemctl is-enabled test_server
```

## 配置日志轮转
如果担心日志占用空间过大，可以配置 journald：
```
sudo vim /etc/systemd/journald.conf
```
添加或修改：
```
[Journal]
SystemMaxUse=500M
SystemMaxFileSize=100M
MaxRetentionSec=7day
```
然后重启 journald：
```
systemctl restart systemd-journald
```

## 排查问题
```
# 查看详细错误信息
sudo journalctl -u test_server -xe

# 检查配置文件语法
sudo systemd-analyze verify test_server.service

# 检查文件权限
ls -la /home/build/test_server
```

## 查看所有服务状态
```
# 查看所有已加载的服务单元
systemctl list-units --type=service

# 查看所有服务（包括未激活的）
systemctl list-units --type=service --all

# 只查看正在运行的服务
systemctl list-units --type=service --state=running
```

## 查看所有单元类型
```
# 查看所有类型的单元（service, socket, timer等）
systemctl list-units --all

# 按状态筛选
systemctl list-units --state=active
systemctl list-units --state=failed
```

## 查看已安装的服务文件
```
# 列出所有已安装的服务单元文件
systemctl list-unit-files --type=service

# 查看已启用的服务
systemctl list-unit-files --type=service --state=enabled
```

## 查看服务详细状态
```
# 查看特定服务的状态
systemctl status 服务名.service

# 查看系统整体状态
systemctl status
```

## 常用筛选技巧
```
# 使用 grep 筛选
systemctl list-units --type=service | grep nginx

# 查看启动失败的服务
systemctl --failed

# 以树形结构查看服务依赖
systemctl list-dependencies 服务名.service
```






