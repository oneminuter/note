#supervisor 基本命令

启动Supervisor服务
```shell
supervisord -c /etc/supervisor/supervisord.conf
```

supervisord，初始启动Supervisord，启动、管理配置中设置的进程。


```shell
supervisorctl stop programxxx，停止某一个进程(programxxx)，programxxx为[program:blogdemon]里配置的值，这个示例就是blogdemon。
supervisorctl start programxxx，启动某个进程
supervisorctl restart programxxx，重启某个进程
supervisorctl stop all，停止全部进程，注：start、restart、stop都不会载入最新的配置文件。
supervisorctl reload，载入最新的配置文件，并按新的配置启动、管理所有进程。
```