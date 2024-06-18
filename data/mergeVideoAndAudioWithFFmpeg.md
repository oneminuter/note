# ffmpeg 合并视频和音频

## 视频音频合并
```
ffmpeg -i input_video.mp4 -i input_audio.mp3 -c:v copy -c:a aac -strict experimental -b:a 192k output_video.mp4
```

- -i input_video.mp4: 输入视频文件。
- -i input_audio.mp3: 输入音频文件。
- -c:v copy: 视频流不进行编码，直接复制。
- -c:a aac: 将音频流编码为AAC格式。
- -strict experimental: 设置为实验性模式，以支持不标准的编码设置。
- output_video.mp4: 输出文件的名称。

确保输入的视频和音频的格式兼容，否则可能需要对其进行转码。
如果你需要转码视频或音频流，可以替换-c:v copy和-c:a aac为相应的编码器和选项，
例如使用-c:v libx264来使用H.264编码器，或者-c:a libmp3lame来使用MP3编码器。

## m3u8视频下载
```
ffmpeg -i http://example.com/playlist.m3u8 -c copy output.mp4
````

`-c copy` 表示直接复制流（不进行重新编码），这可以加快处理速度但可能会保留原始流的某些限制或问题。
如果你想要重新编码视频或音频，可以省略 `-c copy` 并添加适当的编码选项。  