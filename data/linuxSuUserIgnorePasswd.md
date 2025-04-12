# linux 免密切换到公共用户

背景
在 linux 中，我们会创建一个公共用户 dev, 用于启动服务, 但需要限制该用户不能通过 ssh 登录，其他用户可以通过 *su dev* 切到 dev 用户操作执行命令

## 创建 dev 用户组
```
groupadd dev
```

## 创建 dev 用户
```
useradd dev -g dev -m -s /bin/bash
```
- *-g dev* 指定用户组为 *dev*  
- *-m* 自动创佳 home 目录（如 /home/dev）
- *-s /bin/bash* 指定用户的登录Shell为 /bin/bash，确保其他用户可以切换到该用户

## 禁用 dev 通过 ssh 登录

### 方式一：通过SSH配置文件禁止

#### 修改 *etc/ssh/sshd_config* 文件，在文件最后加上
```
DenyUsers dev
```

#### 重启SSH服务
```
# centos
systemctl restart sshd
或 ubuntu
systemctl restart ssh
```

### 方式二：将用户的Shell设置为不可用的Shell
```
usermod -s /sbin/nologin dev
```
此方法会禁止所有形式的登录（包括SSH和本地登录），但其他用户仍可以通过 su 命令切换到 dev 用户（因为 su 不依赖登录Shell）


## 配置用户免密切换到 dev
编辑 PAM 配置文件 */etc/pam.d/su* 加入下面两行
```
auth [success=ignore default=1] pam_succeed_if.so user = dev
auth sufficient pam_succeed_if.so use_uid user ingroup dev
```
规则解释：
第1行：检查目标用户是否为 dev，如果是则跳过后续规则。  
第2行：检查当前用户是否属于 dev 组，如果是则允许免密切换。  