<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { Snackbar } from "@varlet/ui";
import { getData } from "@/utils/indexDb";
import {
  selectImageFolder,
  selectOutputFolder,
  getRadomId,
  transfromYolo,
  transfromYoloReverse,
} from "@/utils";
import {
  FileIo,
  type Label,
  type ImageData,
  type LabelData,
} from "@/utils/lableImage";
import ListVue from "@/components/list.vue";
const canvasDom = ref<HTMLCanvasElement | null>(null);
const states = reactive({
  isShowChooseFolder: false,
  lableIndex: 0,
  imageIndex: 0,
  isShowLableName: true,
  isShowAddLable: false,
  currentImage: {
    name: "",
    img: null as HTMLImageElement | null,
    width: 0,
    height: 0,
    dx: 0, // 图片在画布中的位置
    dy: 0,
    dw: 0,
    dh: 0,
  },
}); // 状态
const lableList = ref(new Array<LabelData>()); // 当前图片的标签数据
const imageList = ref(new Array<ImageData>()); // 图片列表
let fileIo: FileIo | null = null, // 文件操作实例
  canvasCtx: CanvasRenderingContext2D | null = null; // 画布上下文
/**
 * 默认标签
 */
function getDefalutLables() {
  return [
    { id: 0, name: "person", color: "#a3103f" },
    { id: 1, name: "bicycle", color: "#692079" },
    { id: 2, name: "car", color: "#e7b81" },
    { id: 3, name: "motorcycle", color: "#f89892" },
    { id: 4, name: "airplane", color: "#15aa3f" },
    { id: 5, name: "bus", color: "#a43389" },
    { id: 6, name: "train", color: "#89ca75" },
    { id: 7, name: "truck", color: "#4bce20" },
    { id: 8, name: "boat", color: "#40d49" },
    { id: 9, name: "traffic light", color: "#f47c7a" },
    { id: 10, name: "fire hydrant", color: "#1979b1" },
    { id: 11, name: "stop sign", color: "#a09f4b" },
    { id: 12, name: "parking meter", color: "#381366" },
    { id: 13, name: "bench", color: "#85c89" },
    { id: 14, name: "bird", color: "#6530ce" },
    { id: 15, name: "cat", color: "#bebff6" },
    { id: 16, name: "dog", color: "#6faf2c" },
    { id: 17, name: "horse", color: "#24557f" },
    { id: 18, name: "sheep", color: "#cf70f0" },
    { id: 19, name: "cow", color: "#e99d7d" },
    { id: 20, name: "elephant", color: "#636c60" },
    { id: 21, name: "bear", color: "#73c095" },
    { id: 22, name: "zebra", color: "#c07210" },
    { id: 23, name: "giraffe", color: "#6666d3" },
    { id: 24, name: "backpack", color: "#69786f" },
    { id: 25, name: "umbrella", color: "#6383ee" },
    { id: 26, name: "handbag", color: "#51159a" },
    { id: 27, name: "tie", color: "#c5a699" },
    { id: 28, name: "suitcase", color: "#9984fb" },
    { id: 29, name: "frisbee", color: "#ef1fa4" },
    { id: 30, name: "skis", color: "#ae918f" },
    { id: 31, name: "snowboard", color: "#71a4f5" },
    { id: 32, name: "sports ball", color: "#b6514c" },
    { id: 33, name: "kite", color: "#6be60e" },
    { id: 34, name: "baseball bat", color: "#a126f2" },
    { id: 35, name: "baseball glove", color: "#7659f5" },
    { id: 36, name: "skateboard", color: "#c69da7" },
    { id: 37, name: "surfboard", color: "#54e55b" },
    { id: 38, name: "tennis racket", color: "#739f3b" },
    { id: 39, name: "bottle", color: "#e405e0" },
    { id: 40, name: "wine glass", color: "#e130ee" },
    { id: 41, name: "cup", color: "#3c28b6" },
    { id: 42, name: "fork", color: "#ebe953" },
    { id: 43, name: "knife", color: "#23539" },
    { id: 44, name: "spoon", color: "#6ef2e6" },
    { id: 45, name: "bowl", color: "#5d5c4c" },
    { id: 46, name: "banana", color: "#43bfca" },
    { id: 47, name: "apple", color: "#7fef14" },
    { id: 48, name: "sandwich", color: "#781102" },
    { id: 49, name: "orange", color: "#56bb40" },
    { id: 50, name: "broccoli", color: "#a73b0" },
    { id: 51, name: "carrot", color: "#b2fffb" },
    { id: 52, name: "hot dog", color: "#2e8316" },
    { id: 53, name: "pizza", color: "#fd2993" },
    { id: 54, name: "donut", color: "#668aaf" },
    { id: 55, name: "cake", color: "#f7e147" },
    { id: 56, name: "chair", color: "#37af33" },
    { id: 57, name: "couch", color: "#b18370" },
    { id: 58, name: "potted plant", color: "#d9cafb" },
    { id: 59, name: "bed", color: "#e018e2" },
    { id: 60, name: "dining table", color: "#c007a7" },
    { id: 61, name: "toilet", color: "#4cf7a8" },
    { id: 62, name: "tv", color: "#c9fbf3" },
    { id: 63, name: "laptop", color: "#af94d7" },
    { id: 64, name: "mouse", color: "#d7e70e" },
    { id: 65, name: "remote", color: "#5f8711" },
    { id: 66, name: "keyboard", color: "#a55acf" },
    { id: 67, name: "cell phone", color: "#68d41" },
    { id: 68, name: "microwave", color: "#771f8d" },
    { id: 69, name: "oven", color: "#fd8cd6" },
    { id: 70, name: "toaster", color: "#ceea59" },
    { id: 71, name: "sink", color: "#fd3dfc" },
    { id: 72, name: "refrigerator", color: "#f1631c" },
    { id: 73, name: "book", color: "#eb624c" },
    { id: 74, name: "clock", color: "#120a7f" },
    { id: 75, name: "vase", color: "#cb528b" },
    { id: 76, name: "scissors", color: "#f66eb" },
    { id: 77, name: "teddy bear", color: "#8a405a" },
    { id: 78, name: "hair drier", color: "#c639cb" },
    { id: 79, name: "toothbrush", color: "#5af16b" },
  ];
}
/**
 * 标签操作相关，初始化，增删改查
 */
function lableAction(labels = getDefalutLables(), index = 0) {
  const lableList = ref(labels);
  const currentIndex = ref(index);
  function save() {
    localStorage.setItem("lableList", JSON.stringify(lableList.value));
    localStorage.setItem("currentIndex", JSON.stringify(currentIndex.value));
  }
  function read() {
    const lableListStr = localStorage.getItem("lableList");
    const currentIndexStr = localStorage.getItem("currentIndex");
    if (lableListStr) {
      lableList.value = JSON.parse(lableListStr);
    }
    if (currentIndexStr) {
      currentIndex.value = JSON.parse(currentIndexStr);
    }
  }
  function nextLabel() {
    currentIndex.value = (currentIndex.value + 1) % lableList.value.length;
    return lableList.value[currentIndex.value];
  }
  function prevLabel() {
    currentIndex.value =
      (currentIndex.value - 1 + lableList.value.length) %
      lableList.value.length;
    return lableList.value[currentIndex.value];
  }
  function currentLable() {
    return lableList.value[currentIndex.value];
  }
  function getLabelById(id: number) {
    return lableList.value.find((item) => item.id === id);
  }
  function getRadomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  function addLabel(name: string, color = getRadomColor()) {
    const id = lableList.value.length;
    lableList.value.push({ id, name, color });
    save();
  }
  function delLabel(id: number) {
    const index = lableList.value.findIndex((item) => item.id === id);
    if (index === -1) return;
    lableList.value.splice(index, 1);
    save();
  }
  function updateLabel(id: number, name: string, color: string) {
    const index = lableList.value.findIndex((item) => item.id === id);
    if (index === -1) return;
    lableList.value[index].name = name;
    lableList.value[index].color = color;
    save();
  }
  function setLable(id: number) {
    currentIndex.value = lableList.value.findIndex((item) => item.id === id);
  }
  read();
  return {
    lables: lableList,
    lableIndex: currentIndex,
    nextLabel,
    prevLabel,
    setLable,
    getLabelById,
    currentLable,
    getRadomColor,
    addLabel,
    delLabel,
    updateLabel,
  };
}
const {
  lables, // 标签数据
  setLable, // 设置当前标签
  addLabel, // 添加标签
  delLabel, // 删除标签
  updateLabel, // 修改标签
  getRadomColor, // 获取随机颜色
  currentLable, // 获取当前标签
  nextLabel, // 下一个标签
  prevLabel, // 上一个标签
  getLabelById, // 通过id获取标签
} = lableAction();

/**
 * 重置canvas位置,保持居中
 */
function resetCanvasPosition() {
  if (!canvasDom.value) return;
  // 把canvas居中缩放到父元素
  const canvas = canvasDom.value;
  const parent = canvas.parentElement;
  if (!parent) return;
  const { width, height } = parent.getBoundingClientRect();
  const c_width = canvas.width;
  const c_height = canvas.height;
  const scale = Math.min(width / c_width, height / c_height);
  // 考虑transformOrigin为居中
  canvas.style.setProperty("--scale", `${scale}`);
}
/**
 * 解析图片，加载到canvas中
 * @param imageData
 */
function loadImage(imageData: ImageData) {
  return new Promise<HTMLImageElement>(async (resolve, reject) => {
    const img = new Image();
    const data = await imageData.value.getFile();
    img.src = URL.createObjectURL(data);
    img.onload = () => {
      states.currentImage.name = imageData.name;
      states.currentImage.img = img;
      states.currentImage.width = img.width;
      states.currentImage.height = img.height;
      // 获取画布大小
      const cavans = canvasDom.value;
      if (!cavans) return;
      // 等比例缩放到画布大小，并居中显示
      cavans.width = img.width;
      cavans.height = img.height;
      cavans.style.width = img.width + "px";
      cavans.style.height = img.height + "px";
      // 设置标题
      document.title = imageData.name;
      resetCanvasPosition();// 重置canvas位置，保持居中
      resolve(img);
    };
    img.onerror = (e) => {
      Snackbar.error("加载图片失败");
      reject(e);
    };
  });
}
/**
 * 保存标签数据
 */
async function saveLable() {
  if (!fileIo) throw new Error("fileIo is null");
  if (lableList.value.length === 0) return;
  let content = "";
  const {
    width: imgWidth,
    height: imgHeight,
    name: imgName,
  } = states.currentImage;
  lableList.value.forEach((lable) => {
    let { x, y, width, height, cid } = lable;
    const yolo = transfromYolo(x, y, width, height, imgWidth, imgHeight);
    const str = `${cid} ${yolo.x} ${yolo.y} ${yolo.width} ${yolo.height}\n`;
    content += str;
  });
  const name = imgName.split(".")[0] + ".txt";
  await fileIo.saveFile(name, content);
}
/**
 * 根据yolo格式加载标签数据
 * @param imageName
 */
async function loadLable(imageName: string) {
  if (!fileIo) throw new Error("fileIo is null");
  const name = imageName.split(".")[0] + ".txt";
  const content = await fileIo.readFile(name);
  if (!content) return;
  const { width: imgWidth, height: imgHeight } = states.currentImage;
  content.split("\n").forEach((item) => {
    if (!item) return;
    const [cid, x, y, width, height] = item.split(" ");
    const lableData = transfromYoloReverse(
      Number(x),
      Number(y),
      Number(width),
      Number(height),
      imgWidth,
      imgHeight
    );

    if (!lables) throw new Error("lables is null");
    const _lable = getLabelById(Number(cid));
    if (!_lable) throw new Error("lable is null");
    const { name, color } = _lable;
    lableList.value.push({
      id: getRadomId(),
      cid: Number(cid),
      name,
      color,
      x: lableData.x,
      y: lableData.y,
      width: lableData.width,
      height: lableData.height,
    });
  });
}
/**
 * 加载图片具体操作
 * @param isNext 是否加载下一张
 */
async function loadImageAction(isNext: boolean | ImageData = true) {
  try {
    await saveLable();
    lableList.value = [];
    if (!fileIo) return;
    const imageData =
      typeof isNext === "boolean"
        ? isNext
          ? fileIo.nextImage
          : fileIo.prevImage
        : isNext;
    if (!imageData) return;
    if (typeof isNext !== "boolean")
      fileIo.index = fileIo.imagesData.findIndex(
        (item) => item.name === imageData.name
      );
    states.imageIndex = fileIo.index;
    await loadImage(imageData);
    await loadLable(imageData.name);
    refreshDraw();
  } catch (e: any) {
    console.error(e);
    Snackbar.error("加载图片失败:" + e.message);
  }
}
/**
 * canvas操作部分
 */
function drawAction() {
  let isDraw = false;
  let isDrag = false;
  let startPoint = { x: 0, y: 0 };
  let drawRect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
  function start(e: MouseEvent) {
    if (!canvasDom.value) return;

    // 复位
    if (e.button === 1) {
      canvasDom.value.style.setProperty("--x", "0px");
      canvasDom.value.style.setProperty("--y", "0px");
      canvasDom.value.style.setProperty("--scale", "1");
      return;
    }
    // 右键开始拖拽
    if (e.button === 2) {
      isDrag = true;
      canvasDom.value.style.cursor = "move";
      canvasDom.value.style.transition = "none";
      return;
    }
    // 左键开始画框
    if (e.button !== 0) return;
    isDraw = true;
    startPoint = { x: e.offsetX, y: e.offsetY };
  }
  function move(e: MouseEvent) {
    if (isDrag && canvasDom.value) {
      const canvas = canvasDom.value;
      const { movementX, movementY } = e;
      const originX = Number(
        canvas.style.getPropertyValue("--x").replace("px", "")
      );
      const originY = Number(
        canvas.style.getPropertyValue("--y").replace("px", "")
      );
      const scale = Number(canvas.style.getPropertyValue("--scale"));
      const x = originX + movementX / scale;
      const y = originY + movementY / scale;
      canvas.style.setProperty("--x", `${x}px`);
      canvas.style.setProperty("--y", `${y}px`);
      return;
    }
    if (!isDraw || !canvasCtx || !canvasDom.value) return;
    refreshDraw();
    const { color } = currentLable();
    canvasCtx.strokeStyle = color;
    canvasCtx.beginPath();
    let { x, y } = startPoint;
    let { x1, y1 } = {
      x1: e.offsetX,
      y1: e.offsetY,
    };
    // 修正坐标,保证x1,y1大于x,y
    if (x1 < x) [x, x1] = [x1, x];
    if (y1 < y) [y, y1] = [y1, y];
    // 相对于画布的坐标
    let _x = x;
    let _y = y;
    let _w = x1 - x;
    let _h = y1 - y;
    // 修正,保证不超出画布
    // 画框
    canvasCtx.strokeRect(_x, _y, _w, _h);
    canvasCtx.stroke();
    // 缓存框的位置
    drawRect.x = _x;
    drawRect.y = _y;
    drawRect.w = _w;
    drawRect.h = _h;
  }
  function end(e: MouseEvent) {
    if (isDrag && canvasDom.value) {
      isDrag = false;
      canvasDom.value.style.cursor = "default";
      canvasDom.value.style.transition = "transform 0.2s";
      return;
    }
    if (!canvasCtx) return;
    isDraw = false;
    const id = getRadomId();
    const { id: cid, name, color } = currentLable();
    const { x, y, w, h } = drawRect;
    // 小于5px不保存
    if (w < 5 || h < 5) {
      refreshDraw();
      return;
    }
    lableList.value.push({
      id,
      cid,
      name,
      color,
      x: x,
      y: y,
      width: w,
      height: h,
    });
    refreshDraw();
  }
  function drawImage() {
    const cavans = canvasDom.value;
    const ctx = canvasCtx;
    const img = states.currentImage.img;
    if (!ctx || !img || !cavans) return;
    // 获取画布大小
    const ctxw = Number(cavans.getAttribute("width")) || 0;
    const ctxh = Number(cavans.getAttribute("height")) || 0;
    // 等比例缩放到画布大小，并居中显示
    const dw = img.width;
    const dh = img.height;
    const dx = (ctxw - dw) / 2;
    const dy = (ctxh - dh) / 2;
    states.currentImage.dx = dx;
    states.currentImage.dy = dy;
    states.currentImage.dw = dw;
    states.currentImage.dh = dh;
    ctx.drawImage(img, dx, dy, dw, dh);
  }
  function drawLable() {
    lableList.value.forEach((lable) => {
      if (!canvasCtx || !lable) return;
      const { x, y, width, height, color } = lable;
      canvasCtx.strokeStyle = color;
      canvasCtx.fillStyle = color;
      // 把id画在左上角
      canvasCtx.lineWidth = 0.5;
      if (states.isShowLableName) {
        if (y - 2 > 10) canvasCtx.strokeText(lable.name, x, y - 2);
        else canvasCtx.strokeText(lable.name, x, y + height + 8);
      }
      canvasCtx.lineWidth = 1;
      canvasCtx.strokeRect(x, y, width, height);
    });
  }
  function refreshDraw() {
    // 清空画布
    if (!canvasCtx) return;
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    drawImage();
    drawLable();
  }
  window.onmouseup = end;
  return { start, move, end, refreshDraw };
}
const { start, move, refreshDraw } = drawAction();
// 初始化部分
async function init() {
  const ImageDirHandle = await getData<FileSystemDirectoryHandle>(
    "ImageDirHandle"
  );
  const OutputDirHandle = await getData<FileSystemDirectoryHandle>(
    "OutputDirHandle"
  );
  if (!ImageDirHandle || !OutputDirHandle) {
    states.isShowChooseFolder = true;
    Snackbar.error("请选择图片文件夹和输出文件夹");
    return;
  }
  Snackbar.loading("加载图片中...");
  fileIo = new FileIo({ ImageDirHandle, OutputDirHandle });
  try {
    await fileIo.initImages();
    imageList.value = fileIo.imagesData;
  } catch (error) {
    Snackbar.error("请重新选择图片文件夹");
    states.isShowChooseFolder = true;
    return;
  }
  fileIo.setIndex(states.imageIndex);
  states.isShowChooseFolder = false;
  // 矫正canvas大小
  if (!canvasDom.value || !canvasDom.value.parentElement) return;
  const ctx = canvasDom.value.getContext("2d");
  if (!ctx) return;
  canvasCtx = ctx;
  const rect = canvasDom.value.getBoundingClientRect();
  canvasDom.value.width = rect.width;
  canvasDom.value.height = rect.height;

  // 加载图片
  const imageData = fileIo.currentImage;
  if (!imageData) return;
  await loadImage(imageData);
  await loadLable(imageData.name);
  refreshDraw();
  Snackbar.clear();
}
/**
 * 注册事件
 */
function loadEvents() {
  // 监听ctrl+z
  let timmer: number | undefined;
  window.addEventListener("keydown", (e) => {
    if (timmer && Date.now() - timmer < 200) return;
    if (e.key === "d" || e.key === "D") {
      loadImageAction();
    } else if (e.key === "a" || e.key === "A") {
      loadImageAction(false);
    } else if (e.key === "q" || e.key === "Q") {
      const _lable = prevLabel();
      Snackbar.info("切换到标签:" + _lable?.name);
      refreshDraw();
    } else if (e.key === "e" || e.key === "E") {
      const _lable = nextLabel();
      Snackbar.info("切换到标签:" + _lable?.name);
      refreshDraw();
    } else if ((e.key === "z" || e.key === "Z") && e.ctrlKey) {
      lableList.value.pop();
      refreshDraw();
    }
    timmer = Date.now();
  });
  if (!canvasDom.value) return;
  const canvas = canvasDom.value;
  // 监听鼠标滚轮
  canvas.parentNode?.addEventListener(
    "wheel",
    (e: any) => {
      if (!canvasCtx) return;
      const scale = Number(canvas.style.getPropertyValue("--scale")) || 1;
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      if (scale + delta < 0.3) return;
      // 修改css变量
      canvas.style.setProperty("--scale", `${scale + delta}`);
      refreshDraw();
    },
    {
      passive: false,
    }
  );
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}
onMounted(async () => {
  // @ts-ignore  ts没有showDirectoryPicker，所以忽略
  if (!window.showDirectoryPicker) {
    alert("当前浏览器不支持showDirectoryPicker, 请使用最新版edge/chrome浏览器");
    return;
  }
  await init();
  loadEvents();
});

// 添加标签部分
const inputLabel = reactive({
  id: undefined as number | undefined,
  name: "",
  color: getRadomColor(),
});
/**
 * 确认添加标签
 */
function confirmAddLable() {
  const { id, name, color } = inputLabel;
  if (id) {
    updateLabel(id, name, color);
    Snackbar.info("修改标签成功");
  } else {
    addLabel(name, color);
  }
  inputLabel.id = undefined;
  inputLabel.name = "";
  inputLabel.color = getRadomColor();
  states.isShowAddLable = false;
}

// 标签的右键菜单部分
const lableContextmenuState = reactive({
  x: 0,
  y: 0,
  show: false,
  data: null as Label | null,
});
/**
 * 右键菜单事件
 * @param e
 * @param data
 */
function lableContextmenu(e: MouseEvent, data: Label) {
  e.preventDefault();
  lableContextmenuState.x = e.clientX;
  lableContextmenuState.y = e.clientY;
  lableContextmenuState.data = data;
  lableContextmenuState.show = true;
  window.addEventListener(
    "click",
    () => {
      lableContextmenuState.show = false;
    },
    { once: true }
  );
}
/**
 * 右键菜单操作
 * @param isDelete 是否删除
 */
function lableContextmenuAction(isDelete = false) {
  if (!lableContextmenuState.data) return;
  const { name, id, color } = lableContextmenuState.data;
  if (isDelete) {
    const res = window.confirm("是否删除标签：" + name);
    if (res && id) {
      delLabel(id);
      return;
    }
    Snackbar.info("取消删除");
    return;
  }
  states.isShowAddLable = true;
  inputLabel.id = id;
  inputLabel.name = name;
  inputLabel.color = color;
}
</script>

<template>
  <div class="lableImageBody">
    <!-- 头部操作栏 -->
    <header>
      <var-button
        type="primary"
        @click="states.isShowChooseFolder = true"
        >选择文件夹</var-button
      >
      <var-button
        type="primary"
        @click="loadImageAction()"
        >下一张(D)</var-button
      >
      <var-button
        type="primary"
        @click="loadImageAction(false)"
        >上一张(A)</var-button
      >
      <var-button
        type="primary"
        @click="prevLabel()"
        >上一个标签(Q)</var-button
      >
      <var-button
        type="primary"
        @click="nextLabel()"
        >下一个标签(E)</var-button
      >
    </header>
    <!-- 内容主体 -->
    <main>
      <!-- 图片列表 -->
      <div class="left">
        <var-divider description="文件" />
        <template
          v-for="(item, index) in imageList"
          :key="index"
        >
          <var-button
            :text="states.imageIndex !== index"
            type="primary"
            style="width: 100%"
            @click="loadImageAction(item)"
          >
            <img
              :src="item.url"
              style="
                width: 2em;
                height: 2em;
                object-fit: cover;
                margin-right: 0.5em;
              "
              lazy="true"
            />
            {{ item.name }}
          </var-button>
        </template>
      </div>
      <!-- 画布 -->
      <div class="main">
        <canvas
          ref="canvasDom"
          class="main"
          id="labelImageCanvas"
          @mousedown="start"
          @mousemove="move"
        >
        </canvas>
      </div>
      <!-- 标签列表 -->
      <div class="right">
        <var-divider description="标签" />
        <var-button
          style="width: 100%"
          type="info"
          :icon-container="true"
          @click="states.isShowAddLable = !states.isShowAddLable"
        >
          <Icon
            style="font-size: 2em"
            icon="ic:round-add"
          />
        </var-button>
        <ListVue :data="lables">
          <template #default="{ data, index }">
            <var-button
              :text="currentLable().id !== data.id"
              type="primary"
              size="small"
              @click="setLable(data.id as number)"
              @contextmenu="lableContextmenu($event, data as any)"
            >
              {{ data.name }}
              <div
                :style="{
                  marginLeft: '0.5em',
                  transform: 'translateY(0.1em)',
                  width: '1em',
                  height: '1em',
                  borderRadius: '50%',
                  backgroundColor: data.color,
                }"
              ></div>
            </var-button>
          </template>
        </ListVue>
      </div>
    </main>
    <!-- 弹窗部分 -->
    <!-- 选择文件夹 -->
    <var-dialog
      v-model:show="states.isShowChooseFolder"
      :cancelButton="false"
      @confirm="init()"
    >
      <var-button
        type="primary"
        @click="selectImageFolder()"
        >选择图片文件夹</var-button
      >
      <var-button
        type="primary"
        style="margin-top: 0.5em"
        @click="selectOutputFolder()"
        >选择输出文件夹</var-button
      >
    </var-dialog>
    <!-- 添加标签 -->
    <var-dialog
      v-model:show="states.isShowAddLable"
      @confirm="confirmAddLable()"
    >
      <var-input
        v-model="inputLabel.name"
        placeholder="标签名"
        style="width: 100%"
        size="small"
      >
        <template #append-icon>
          <!-- @vue-ignore,这里需要输入color，但是这个ui组件没适配。不影响使用。。。 -->
          <var-input
            style="width: 2em"
            v-model="inputLabel.color"
            type="color"
            size="small"
          >
          </var-input>
        </template>
      </var-input>
    </var-dialog>
    <!-- 标签右键菜单 -->
    <var-paper
      v-if="lableContextmenuState.show"
      :style="{
        position: 'fixed',
        display: 'block',
        left: 0,
        top: 0,
        backgroundColor: '#fff',
        transform: `translate(${lableContextmenuState.x}px, ${lableContextmenuState.y}px)`,
      }"
      :elevation="2"
    >
      <var-button
        type="primary"
        @click="lableContextmenuAction()"
      >
        编辑
      </var-button>
      <br />
      <var-button
        type="danger"
        @click="lableContextmenuAction(true)"
      >
        删除
      </var-button>
    </var-paper>
  </div>
</template>

<style lang="less" scoped>
.lableImageBody {
  width: calc(100vw - 6px);
  height: calc(100vh - 6px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  header {
    height: 4em;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 5px;
  }
  main {
    width: 100%;
    flex: 1;
    display: flex;
    gap: 5px;
    overflow: hidden;
    .left,
    .right {
      width: 10em;
      height: 100%;
      overflow-y: scroll;
    }
    .main {
      flex: 1;
      overflow: hidden;
      background-image: conic-gradient(
        rgba(0, 0, 0, 0.06) 0 25%,
        transparent 0 50%,
        rgba(0, 0, 0, 0.06) 0 75%,
        transparent 0
      );
      background-size: 15px 15px;
      display: grid;
      place-items: center;
      canvas {
        width: 100%;
        height: 100%;
        --scale: 1;
        --x: 0;
        --y: 0;
        transition: transform 0.2s;
        transform-origin: center center;
        // transform-origin: var(--origin-x) var(--origin-y);
        transform: scale(var(--scale)) translate(var(--x), var(--y));
      }
    }
  }
}
</style>
