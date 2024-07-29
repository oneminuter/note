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

## 按固定时长分割 mp4
```
ffmpeg -i input.mp4 -c copy -map 0 -f segment -segment_time 90 -segment_format mp4 -reset_timestamps 1 output%d.mp4
```
- -i input.mp4：指定输入文件。
- -c copy：复制流而不重新编码，这样可以保持原始质量并加快处理速度。
- -map 0：选择输入文件的全部流。
- -f segment：指定输出格式为 segment muxer，用于生成多个文件。
- -segment_time 10：设置每个片段的时长为 10 秒。
- -segment_format mp4：指定输出文件的封装格式为 MP4。
- -reset_timestamps 1：在每个新段开始时重置时间戳。这对于播放每个单独片段很重要，因为时间戳的连续性可能会导致问题。
- output%d.mp4：输出文件名模板，%d 是一个占位符，表示将自动插入的数字序列，用于区分不同的输出文件。

### 给每个分割的视频加文字水印
```
#!/bin/bash  
  
# 假设你的输出文件前缀是 "output"  
prefix="output"  
# 获取分割后的文件数量（这取决于你的视频长度和segment_time）  
# 注意：这个命令可能需要根据你的具体文件名和数量进行调整  
# 这里只是一个示例，可能不总是准确  
num_files=$(ls ${prefix}*.mp4 | wc -l)  
  
# 遍历每个文件并添加水印  
for (( i=0; i<$num_files; i++ )); do  
    # 构造文件名  
    filename="${prefix}${i}.mp4"  
    # 检查文件是否存在  
    if [ -f "$filename" ]; then  
        # 使用 ffmpeg 添加水印  
        # 这里假设你想在视频的右上角添加水印  
        # -vf "drawtext=fontfile=/Users/oneminuter/Library/Fonts/微软雅黑.ttf:text='第%d段':x=10:y=10:fontsize=24:fontcolor=white:box=1:boxcolor=0x00000080"  
        # 注意：%d 在这里不会直接替换为 i 的值，因为它在 filter_complex 中被处理  
        # 我们需要使用 -vf_args 来传递动态参数，但 FFmpeg 并不直接支持这种方式  
        # fontfile 指定使用的字体文件路径，要不然使用默认的可能会乱码
        # 因此，我们使用 printf 来构造完整的命令
        ffmpeg_cmd="ffmpeg -i \"$filename\" -vf \"drawtext=fontfile=/Users/oneminuter/Library/Fonts/微软雅黑.ttf:text='第${i}段':x=10:y=10:fontsize=24:fontcolor=white:box=1:boxcolor=0x00000080\" -codec:a copy output_with_watermark_${i}.mp4"  
        echo "Running: $ffmpeg_cmd"  
        eval "$ffmpeg_cmd"  
    fi  
done  
  
echo "All files have been processed."
```
将上面脚本写入一个 Bash 脚本文件，然后运行
