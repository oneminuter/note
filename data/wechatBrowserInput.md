# 微信浏览器 input 无法输入

IOS系统中，微信移动端的input都不能输入了

可能是 user-select 导致的, user-select 是用来禁止用户进行复制选择的

```
*{
    -webkit-font-smoothing: antialiased;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-overflow-scrolling: touch;
}
 ```


 这是webkit内核浏览器下的一个bug

 ## 解决
 用 css not 排除掉 input 和 textarea 标签
 ```
 [contenteditable="true"], input, textarea {
    -webkit-user-select: auto!important;
    -khtml-user-select: auto!important;
    -moz-user-select: auto!important;
    -ms-user-select: auto!important;
    -o-user-select: auto!important;
    user-select: auto!important;
}
```