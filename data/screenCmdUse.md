# screen 命令使用

[TOC]

在服务器终端使用 screen 分屏操作

### 会话管理

### 创建新窗口
```shell
screen -S session_name
```

### 列出所有会话\
```
screen -ls
```

### 重新连接到会话
```
screen -r [session_id/name]
```

### 分离当前会话（在screen内部）
```
Ctrl+a d
```

### 强制重连（踢掉其他连接）
```
screen -D -r session_name
```

### 结束会话
```
exit  # 在screen内部输入
```

---

## 窗口操作

### 创建新窗口
```
Ctrl+a c
```

### 切换到下一个窗口
```
Ctrl+a n
```

### 切换到上一个窗口
```
Ctrl+a p
```

### 切换到指定编号窗口（0-9）
```
Ctrl+a 0-9
```

### 列出所有窗口
```
Ctrl+a "
```

### 重命名当前窗口
```
Ctrl+a A
```

### 关闭当前窗口
```
Ctrl+a k
```

---

## 分屏操作
### 水平分割
```
Ctrl+a S
```

### 垂直分割
```
Ctrl+a |
```

### 切换到下一个分屏区域
```
Ctrl+a Tab
```

### 关闭当前分屏区域
```
Ctrl+a X
```

### 只保留当前分屏区域
```
Ctrl+a Q
```

---

## 其他功能

### 锁定screen（需要密码解锁）
```
Ctrl+a x
```

### 查看帮助
```
Ctrl+a ?
```

### 进入复制模式（可以复制屏幕文本）
```
Ctrl+a [
```

### 粘贴
```
Ctrl+a ]
```

### 显示时间和系统信息
```
Ctrl+a t
```