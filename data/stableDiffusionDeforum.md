# stable diffusion deforum 生成动画

[TOC]

## 安装 Anaconda3
```
wget https://repo.anaconda.com/archive/Anaconda3-2023.07-2-Linux-x86_64.sh
sh Anaconda3-2023.07-2-Linux-x86_64.sh
```

## 安装 python 和 git
```
sudo apt install git python3.10-venv -y
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui && cd stable-diffusion-webui
python -m venv venv
pip3 install -r requirements.txt
```

## 启动
```
./webui.sh --server-name="0.0.0.0" --no-half --enable-insecure-extension-access


常用参数：

--server-name：Sets hostname of server
--no-half： do not switch the model to 16-bit floats
--nowebui：True to launch the API instead of the webui
--enable-insecure-extension-access  启用插件安装
```

## 安装 deforum 插件
参考：
https://github.com/deforum-art/sd-webui-deforum
https://github.com/camenduru/stable-diffusion-webui-docker

## 安装 sd-webui-controlnet
参考：
```
https://github.com/Mikubill/sd-webui-controlnet
```



## 模型
```
model: ReV Animated 

---------
Sampler
DPM++SDE Karras

-------
Strength schedule
0: (0.65), 25: (0.55)

-------

Motion:
Translation X
0:(0), 30:(15), 210:(15), 300:(0)


Translation Z
0:(0.2), 60:(10), 300:(15)


Rotation 3D X
0:(0), 60:(0), 150:(0.5), 210:(0.5), 270:(0.5), 300:(0)


Rotation 3D Y
0:(0), 60:(-3.5), 120:(-2.5), 180:(-2.8), 240:(-2), 300:(0)


Rotation 3D Z
0:(0), 60:(0.2), 120:(0), 180:(-0.5), 240:(0), 300:(0.5), 360:(0.8)

--------

Noise schedule
0:(-0.06*(cos(3.141*t/15)**100)+0.06)

--------

Anti blur
Amount schedule
0:(0.05)

--------

FOV schedule 
0: (120)
```

## promots
```
{
    "0":"0 years old girl, Soft skin, no teeth, chubby cheeks, bright eyes, innocent expression, plump face, innocent smile",
    "30":"1 year old girl, Tiny teeth, tender skin, silky hair, joyful expression, curious gaze, lively and adorable, carefree",
    "60":"3 years old girl, Primary teeth starting to fall out, youthful appearance, playful smile, bright eyes, clear skin, innocent and lively",
    "90":"6 years old girl, Permanent teeth growing in, delicate facial features, innocent smile, bright eyes, clear skin, innocent and lively",
    "120":"10 years old girl,Teeth gradually aligning, refined facial features, youthful aura, bright eyes, innocent smile, vibrant and adorable",
    "150":"15 years old girl, Adolescent appearance, beautiful facial features, clear gaze, shy smile, smooth skin, youthful vitality, innocent and romantic",
    "180":"20 years old girl, Mature face, graceful features, bright eyes, confident smile, smooth and delicate skin, youthful beauty, vibrant and lively",
    "210":"30 years old woman, Mature appearance, dignified features, deep and bright eyes, confident smile, smooth skin, mature charm, self-assured",
    "240":"40 years old woman, Smooth skin, smiling lips, fine lines, bright eyes, determined expression",
    "270":"50 years old woman, Traces of time, mature face, wise gaze, confident smile, appearance of fine lines, composed and mature, elegant demeanor",
    "300":"60 years old woman, Deep wrinkles, sagging eyes, eye bags, loose skin, wise gaze",
    "330":"70 years old woman, Deep wrinkles, sagging eyes, prominent eye bags, loose jawline, seasoned countenance",
    "360":"80 years old woman, The passage of time, benevolent countenance, wise gaze, warmth in the smile, increased wrinkles, benevolent wisdom, serene years"
}
```

## 其他

### 安装模型
参考：
```
https://civitai.com/models/4201/realistic-vision-v51
```

### 查看 gpu 运行情况
```
nvidia-smi -l
```