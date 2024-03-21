# 简介
一个适用于 yolov8（只使用过v8，其他不了解） 数据集的**网页**端标注工具。<br>
打开即用、无需上传图片就是它的优点！<br>
基于vue3+ts，不依赖后端和任何服务器(在线图标使用了iconify除外)。<br>
![](https://ferret.icu/api/file/WEBP_79BBDC92F33.webp)<br>
# 使用方法
键盘：  
`A` => `切换上一张图片`  
`D` => `切换下一张图片`  
`Q` => `切换上一个标签`  
`E` => `切换下一个标签`  
`ctrl + z` => `撤回（删除最后一个框）`  
  
 鼠标：  
`鼠标左键` => `正常拖动标注`  
`鼠标右键` => `拖动平移画布`  
`鼠标滚轮` => `缩放画布`  
ps 保存是在你切换图片的时候自动保存到你选择的输出目录，无需手动保存  
# ⚠浏览器兼容性
 由于使用了 showDirectoryPicker 的 Api，兼容性比较差  
[浏览器兼容性详情](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showDirectoryPicker#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)
# 在线体验地址
[在线体验](https://ferretangel.github.io/labelImageWeb/)
# 后续计划
1.优化ui设计  
2.处理其他浏览器兼容性  
3.数据格式自定义转换（可以通过在线编写js代码，实现对其他格式数据的实时读写）  
4.增加更多自定义选项（框的粗细等等，或者自动根据图片分辨率来设置框的粗细和标签名字大小）  
  
ps.以上顺序不分先后。  
## 项目使用  
```sh
https://github.com/FerretAngel/labelImageWeb.git
```
```sh
npm i
```
```sh
npm run dev
```
### 项目编译
```sh
npm run build
```
