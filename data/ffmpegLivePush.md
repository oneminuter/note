# ffmpeg 实现 mp4 转直播推流 & 拉留转推

[TOC]

## 视频转直播
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

## 加文字水印

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


 ## 直播转播
 ```
ffmpeg -re -i  "https://input.flv?xxxx" -c:v libx264 -preset slow -b:v 4000k -maxrate 5000k -bufsize 5000k -c:a aac -b:a 128k -f flv "rtmp://live-pushxxx/xxxx?txSecret=xxx"
 ```

- -re：以原始帧率读取输入（对于实时流非常有用）。
- -i input.flv?xxxx：指定输入直播源。
- -c:v libx264 和 -c:a aac：分别设置视频和音频编解码器。
- -preset medium/slow、-b:v 2500k、-maxrate 3000k 和 -bufsize 6000k：设置视频编码参数。
- -b:a 128k：设置音频比特率。
- -f flv：设置输出格式为FLV。
- -rtmp://live-pushxxx/xxxx?txSecret=xxx：完整的推流地址，包括密钥。

### 1. 调整推流编码参数

#### 视频编码参数：
- 比特率（Bitrate）：增加视频的比特率（如使用-b:v 4000k代替-b:v 2500k）可以提供更高的视频质量，但也会增加带宽需求。
- 编码预设（Preset）：使用较慢的预设（如-preset slow）可以在不增加比特率的情况下提高视频质量，但会增加推流延迟。
- CRF值（Constant Rate Factor）：降低CRF值（如使用-crf 18代替-crf 23）可以提高视频质量，但同样会增加文件大小和带宽需求。

#### 音频编码参数：
对于音频，通常使用AAC编码器和128kbps的比特率即可满足大部分需求。

### 2. 优化分辨率和帧率
分辨率（Resolution）：确保推流的分辨率与拉流端的显示分辨率相匹配或接近，避免不必要的上采样或下采样。
帧率（Framerate）：保持稳定的帧率对于视频流畅性至关重要。如果源视频帧率很高，但拉流端设备性能有限，可以考虑降低帧率以减轻负担。

### 3. 使用更高效的编码器和设置
编码器选择：确保使用最新版本的ffmpeg和经过优化的编码器，如libx264（H.264）或libx265（H.265/HEVC）。
硬件加速：如果可能的话，利用GPU进行硬件加速编码可以显著提高编码效率和质量。

## 其他
如果启动报错
```
Filtergraph 'drawtext=fontsize=20:fontcolor=white:x=10:y=10:text=%{pts\:hms}' was defined for video output stream 0:0 but codec copy was selected.
```
是由于在使用 -c:v copy 参数时，无法同时在视频输出流上应用 drawtext 滤镜
如果要解决，需要重新编码视频流
把 **-c:v** 参数调整为 libx264, 使用 libx264 编码视频流
