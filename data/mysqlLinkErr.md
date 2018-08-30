# mysql错误：this authentication plugin is not supported

mysql新版本（8.0以上）将root用户使用的plugin更新成caching_sha2_password
登录mysql输入如下命令可以看到:
```shell
select host,user,plugin from mysql.user;
```

## 解决办法
将root(或者其他用户)的plugin改成mysql_native_password

```
ALTER USER ‘root’@’localhost’ IDENTIFIED WITH mysql_native_password BY ‘rootPassrod’;
```
代码有两层含义:
第一:修改root的密码为’root’，摒弃原来的旧密码。
第二：使用mysql_native_password对新密码进行编码

## 再启动应用，报错
**this user requires mysql native password authentication**

在连接mysql的url上加上**?allowNativePasswords=true**，这次正常了