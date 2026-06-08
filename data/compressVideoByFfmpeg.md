# 视频压缩
背景: 在一个不太平常的日子，我打开我的官网，我的官网首屏背景是一个视频，大概496兆, 然后这个视频，是一直循环播放的。然后呢，我就忘记关了关闭了网页, 就一直开着，4个多小时，电脑也没有息屏

睡了一觉之后，突然间收到阿里云CDN欠费了, 打开手机一看，CDN 八九个小时之内，消耗了50块钱左右, 瞬间惊起，打开阿里云后台一看，流量瞬间飙升,开始以为是被黑, 一看流量全来自国内，才想到我的官网一直在打开着

打开调试工具一看，原来视频播放完之后，播放下一遍的时候，他会再去请求这个视频, 查了一下相关资料，如果文件太大，浏览器不会走 disk cache, 导致每次循环播放都要请求网络下载这个视频

## 使用 FFMPEG 压缩视频
```
ffmpeg -i office_bg_video1.mp4 \
    -an \
    -vf "scale='min(1920,iw)':-2" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p \
    -crf 30 -preset slow \
    -movflags +faststart \
    office_bg_video1_h264.mp4
```

或者压缩为 .webm 格式
```
ffmpeg -i office_bg_video1.mp4 \
    -an -vf "scale='min(1920,iw)':-2" \
    -c:v libvpx-vp9 -crf 36 -b:v 0 \
    office_bg_video1.webm
```

实验下来，第一种压缩方式压缩后的文件大小要比第二种更小