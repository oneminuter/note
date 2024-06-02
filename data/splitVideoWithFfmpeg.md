# ffmpeg 分割视频 和 截图

[TOC]

## 分割视频
```
ffmpeg -ss 00:09:12 -t 00:01:18 -i input.mp4 -c copy output.mp4
```
- -ss: 切割开始时间
- -t: 分割时长
- -i: 源视频
- -c: 表示复制视频流和音频流，不进行重编码

这里注意：需要将 `-ss` 和 `-t` 参数放在 `-i` 前面，要不然可能回导致分割出来的视频前几秒黑屏

## 视频截图
```
ffmpeg -ss 00:00:10 -i taobao.mp4 -frames:v 1 1.jpg
```
- -i input.mp4 指定输入视频文件
- -ss 00:00:10.000 指定从视频的哪个时间点开始截图，这里的时间是10秒
- -frames:v 1 指定只抓取一帧作为截图
- output.jpg 是输出的图片文件名