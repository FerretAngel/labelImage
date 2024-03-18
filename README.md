# 简介
一个适用于 yolov8 数据集的**网页**端标注工具。<br>
打开即用、无需上传图片就是它的优点！<br>
基于vue3+ts，不依赖后端和任何服务器(在线图标使用了iconify除外)。<br>
![](http://note.ferret.icu/file/WEBP_79BBDC92F33.webp)<br>
# 使用方法
`A` => `切换上一张图片`<br>
`D` => `切换下一张图片`<br>
`Q` => `切换上一个标签`<br>
`E` => `切换下一个标签`<br>
`ctrl + z` => `撤回（删除最后一个框）`<br>
<br>
`鼠标左键` => `正常拖动标注`<br>
`鼠标右键` => `拖动平移画布`<br>
`鼠标滚轮` => `缩放画布`<br>
ps 保存是在你切换图片的时候自动保存到你选择的输出目录，无需手动保存<br>
# ⚠浏览器兼容性
 由于使用了 showDirectoryPicker 的 Api，兼容性比较差<br>
[浏览器兼容性详情](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showDirectoryPicker#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)
# 在线体验地址
[在线体验](https://ferretangel.github.io/labelImageWeb/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
