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
});
const lableList = ref(new Array<LabelData>());
const imageList = ref(new Array<ImageData>());
let fileIo: FileIo | null = null,
  canvasCtx: CanvasRenderingContext2D | null = null;
function getDefalutLables() {
  return [
    { id: 0, name: "car", color: "#ff0000" },
    { id: 1, name: "truck", color: "#00ff00" },
    { id: 2, name: "fish", color: "#0000ff" },
  ];
}
function lableAction(labels = getDefalutLables(), index = 0) {
  const lableList = ref(labels);
  const currentIndex = ref(index);
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
  }
  function delLabel(id: number) {
    const index = lableList.value.findIndex((item) => item.id === id);
    if (index === -1) return;
    lableList.value.splice(index, 1);
  }
  function updateLabel(id: number, name: string, color: string) {
    const index = lableList.value.findIndex((item) => item.id === id);
    if (index === -1) return;
    lableList.value[index].name = name;
    lableList.value[index].color = color;
  }
  function setLable(id: number) {
    currentIndex.value = lableList.value.findIndex((item) => item.id === id);
  }
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
  lables,
  setLable,
  addLabel,
  delLabel,
  updateLabel,
  getRadomColor,
  currentLable,
  nextLabel,
  prevLabel,
  getLabelById,
} = lableAction();

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
      resetCanvasPosition();
      resolve(img);
    };
    img.onerror = (e) => {
      Snackbar.error("加载图片失败");
      reject(e);
    };
  });
}
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
    (e) => {
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
  // @ts-ignore
  if (!window.showDirectoryPicker) {
    alert("当前浏览器不支持showDirectoryPicker, 请使用最新版edge/chrome浏览器");
    return;
  }
  await init();
  loadEvents();
});

// 添加标签
const inputLabel = reactive({
  id: undefined as number | undefined,
  name: "",
  color: getRadomColor(),
});
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

// 右键菜单
const lableContextmenuState = reactive({
  x: 0,
  y: 0,
  show: false,
  data: null as Label | null,
});
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
    <main>
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
              @contextmenu="lableContextmenu($event, data)"
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
