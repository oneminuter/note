# ffmpeg 实现 mp4 转直播推流 & 拉留转推

```
./ffmpeg -re -i video.mp4 -c:v copy -crf 23 -c:a aac -f flv 'rtmp://xxx'
```
参数：
 - -re：		指定以实时流的方式读取输入文件
 - -i：		输入文件路径
 - -c:v：	复制视频流
 - -c:a：	使用 AAC 编码音频流
 - -f：		指定输出格式为 FLV

当想在播放视频帧中增加时间，用于知道目前播放的实时进度的话，可以使用 drawtext

```
./ffmpeg -re -i video.mp4 -vf 'drawtext=fontsize=20:fontcolor=white:x=10:y=10:text=%{pts\\:hms}' -c:v libx264 -preset veryfast -crf 23 -c:a aac -f flv 'rtmp://xxxx'
```
参数：
- -preset：		编码速度预设为 veryfast
- -crf：			CRF 值为 23，控制视频质量

其中 drawtext 滤镜的参数如下所示：
 - fontfile：	指定字体文件的路径。你需要将 /path/to/font.ttf 替换为实际的字体文件路径，可以不指定，如果无该值，则使用默认字体
 - fontsize：	指定时间戳的字体大小。
 - fontcolor：	指定时间戳的字体颜色。
 - x 和 y：		指定时间戳在视频帧中的位置。
 - text：		指定时间戳的显示格式。%{pts\\:hms} 表示以时分秒的格式显示时间戳。示例中的时间戳是以时分秒 **HH: MM :SS** 的格式显示在视频帧上


## 其他
如果启动报错
```
Filtergraph 'drawtext=fontsize=20:fontcolor=white:x=10:y=10:text=%{pts\:hms}' was defined for video output stream 0:0 but codec copy was selected.
```
是由于在使用 -c:v copy 参数时，无法同时在视频输出流上应用 drawtext 滤镜
如果要解决，需要重新编码视频流
把 **-c:v** 参数调整为 libx264, 使用 libx264 编码视频流
