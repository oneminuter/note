# mysql 创建用户并授权

先用mysql root 用户账户登录到mysql
```shell
create user test identified by '123456';
```

对用户分配权限
```shell
grant all privileges on *.* to 'test'@'%';
```

\*.*  (数据库名.表名)，这里表示所有表及其下面的所有库，如果只对某数据库授予权限，比如test数据库下所有表授予权限：test.*