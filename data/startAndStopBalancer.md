# mongo 分片启停用 balancer

背景：禁用 balancer 后，你可以执行其他操作，例如执行维护任务或数据迁移，而不会影响分片集群的平衡

## 查看 balancer 状态
```
sh.getBalancerState()
```

## 禁用 balancer
```
sh.stopBalancer()
```

## 启用 balancer
```
sh.startBalancer()
```

请注意，禁用 balancer 可能会导致数据在分片之间的不均匀分布。在执行维护任务或数据迁移后，记得重新启用 balancer 以恢复数据的平衡状态