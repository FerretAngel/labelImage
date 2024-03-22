<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { Snackbar } from "@varlet/ui";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import {
  getData,
  selectImageFolder,
  selectOutputFolder,
} from "@/utils/indexDb";
import {
  type Label,
  type ImageData,
  type LabelData,
  type StatesType,
  getRadomColor,
  FileIo,
  LabelManage,
  DrawAction,
} from "@/utils/lableImage";
import ListVue from "@/components/list.vue";
const canvasDom = ref<HTMLCanvasElement | null>(null);
const states = reactive<StatesType>({
  isShowChooseFolder: false,
  isShowLableName: true,
  isShowAddLable: false,
  isEditLable: false,
  lableIndex: 0,
  imageIndex: 0,
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
  currentLable: {
    id: 0,
    name: "person",
    color: "#a3103f",
  },
  currentState: {
    scale: 1,
    mouseX: 0,
    mouseY: 0,
  },
}); // 状态
const lableList = reactive(new Array<LabelData>()); // 当前图片的标签数据
const imageList = ref(new Array<ImageData>()); // 图片列表
const labelManage = new LabelManage(states); // 标签管理
let fileIo: FileIo | null = null, // 文件操作实例
  drawAction: DrawAction | null; // 画布上下文

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
  canvas.style.transformOrigin = "center center";
  canvas.style.setProperty("--scale", `${scale}`);
  canvas.style.setProperty("--x", `${(width - c_width) / 2}px`);
  canvas.style.setProperty("--y", `${(height - c_height) / 2}px`);
  states.currentState.scale = scale;
}
/**
 * 解析图片数据
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
      document.title = `标注图片-${imageData.name}`;
      resetCanvasPosition(); // 重置canvas位置，保持居中
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
  const { width, height, name } = states.currentImage;
  return fileIo.saveYoloFile(name, width, height, lableList);
}
/**
 * 根据yolo格式加载标签数据
 * @param imageName
 */
async function loadLable(imageName: string) {
  if (!fileIo) throw new Error("fileIo is null");
  const { width, height } = states.currentImage;
  const labelDataList = await fileIo.loadYoloFile(
    imageName,
    width,
    height,
    (id) => {
      if (!labelManage) throw new Error("LabelManage is null");
      const _lable = labelManage.getLabelById(id);
      if (!_lable) {
        return labelManage.addLabel("未知标签", "#FF0000", id);
      }
      return _lable;
    }
  );
  lableList.push(...labelDataList);
  // const name = imageName.split(".")[0] + ".txt";
  // const content = await fileIo.readFile(name);
  // if (!content) return;
  // const { width: imgWidth, height: imgHeight } = states.currentImage;
  // content.split("\n").forEach((item) => {
  //   if (!item) return;
  //   const [cid, x, y, width, height] = item.split(" ");
  //   const lableData = transfromYoloReverse(
  //     Number(x),
  //     Number(y),
  //     Number(width),
  //     Number(height),
  //     imgWidth,
  //     imgHeight
  //   );

  //   if (!lables) throw new Error("lables is null");
  //   const _lable = getLabelById(Number(cid));
  //   if (!_lable) throw new Error("lable is null");
  //   const { name, color } = _lable;
  //   lableList.push({
  //     id: getRadomId(),
  //     cid: Number(cid),
  //     name,
  //     color,
  //     x: lableData.x,
  //     y: lableData.y,
  //     width: lableData.width,
  //     height: lableData.height,
  //   });
  // });
}
/**
 * 加载图片具体操作
 * @param isNext 是否加载下一张
 */
async function loadImageAction(isNext: boolean | ImageData = true) {
  if (!drawAction) throw new Error("drawAction is null");
  try {
    if (!fileIo) return;
    const { refreshDraw } = drawAction;
    // 保存当前图片的标签数据
    await saveLable();
    // 清空当前标签数据
    lableList.length = 0;
    const imageData =
      typeof isNext === "boolean"
        ? isNext
          ? fileIo.nextImage
          : fileIo.prevImage
        : isNext;
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
  // 加载图片
  const imageData = fileIo.currentImage;
  if (!imageData) return;
  await loadImage(imageData);
  await loadLable(imageData.name);
  if (!canvasDom.value) throw new Error("canvasDom is null");
  drawAction = new DrawAction(canvasDom.value, lableList, states);
  drawAction.refreshDraw();
  Snackbar.clear();
  loadEvents();
}
/**
 * 注册事件
 */
function loadEvents() {
  if (!drawAction) throw new Error("drawAction is null");
  const { refreshDraw } = drawAction;
  // 监听ctrl+z
  let timmer: number | undefined;
  // 监听键盘事件
  window.onkeydown = (e) => {
    if (timmer && Date.now() - timmer < 200) return;
    if (!labelManage) throw new Error("labelManage is null");
    switch (e.code) {
      case "KeyE": // 下一个标签
        const _lable = labelManage.nextLabel();
        Snackbar.info("切换到标签:" + _lable?.name);
        refreshDraw();
        break;
      case "KeyQ": // 上一个标签
        const prev_lable = labelManage.prevLabel();
        Snackbar.info("切换到标签:" + prev_lable?.name);
        refreshDraw();
        break;
      case "KeyA": // 上一张图片
        loadImageAction(false);
        break;
      case "KeyD": // 下一张图片
        loadImageAction();
        break;
      case "KeyW": // 切换到编辑模式
        states.isEditLable = !states.isEditLable;
        Snackbar.info(
          "切换到" + (states.isEditLable ? "编辑" : "绘制") + "模式"
        );
        break;
      case "KeyZ": // 撤销
        if (e.ctrlKey) {
          lableList.pop();
          refreshDraw();
        }
        break;
    }
    timmer = Date.now();
  };
  // 监听鼠标中键复位
  window.onmousedown = (e) => {
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      resetCanvasPosition();
      return;
    }
  };
  // 阻止右键菜单
  window.oncontextmenu = (e) => {
    e.preventDefault();
  };
  window.onbeforeunload = async (e) => {
    e.preventDefault();
    Snackbar.loading("保存中...");
    labelManage.save();
    await saveLable();
    Snackbar.clear();
  };
  if (!canvasDom.value) throw new Error("canvasDom is null");
  const canvas = canvasDom.value;
  // 监听鼠标滚轮
  canvas.parentElement?.addEventListener(
    "wheel",
    (e: any) => {
      const scale = Number(canvas.style.getPropertyValue("--scale")) || 1;
      const scaleRate = scale * 0.1;
      const delta = e.deltaY > 0 ? -scaleRate : scaleRate;
      if (scale + delta < 0) return;
      // 修改css变量
      canvas.style.setProperty("--scale", `${scale + delta}`);
      refreshDraw();
      states.currentState.scale = scale + delta;
    },
    {
      passive: false,
    }
  );
}
onMounted(async () => {
  // @ts-ignore  ts没有showDirectoryPicker，所以忽略
  if (!window.showDirectoryPicker) {
    alert("当前浏览器不支持showDirectoryPicker, 请使用最新版edge/chrome浏览器");
    return;
  }
  await init();
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
  if (!labelManage) throw new Error("labelManage is null");
  const { id, name, color } = inputLabel;
  if (typeof id === "number") {
    labelManage.updateLabel(id, { id, name, color });
    Snackbar.info("修改标签成功");
  } else {
    labelManage.addLabel(name, color);
    Snackbar.info("添加标签成功");
  }
  inputLabel.id = undefined;
  inputLabel.name = "";
  inputLabel.color = getRadomColor();
  states.isShowAddLable = false;
}
/**
 * 添加标签
 */
function addLable() {
  inputLabel.id = undefined;
  inputLabel.color = getRadomColor();
  inputLabel.name = "";
  states.isShowAddLable = true;
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
  if (data.id === states.currentLable.id) return;
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
  if (!lableContextmenuState.data || !labelManage) return;
  const { name, id, color } = lableContextmenuState.data;
  if (isDelete) {
    const res = window.confirm("是否删除标签：" + name);
    if (res && id) {
      labelManage.deleteLabel(id);
      return;
    }
    Snackbar.info("取消删除");
    return;
  }
  states.isShowAddLable = true;
  inputLabel.id = id;
  inputLabel.name = name;
  inputLabel.color = color;
  console.log("编辑标签", lableContextmenuState.data);
}
</script>

<template>
  <div class="lableImageBody">
    <!-- 头部操作栏 -->
    <header>
      <div>
        <var-button
          type="primary"
          @click="states.isShowChooseFolder = true"
        >
          <Icon icon="solar:folder-bold-duotone" />
          选择文件夹</var-button
        >
        <var-button
          type="primary"
          @click="loadImageAction()"
        >
          <Icon icon="solar:gallery-minimalistic-outline" />
          下一张(D)</var-button
        >
        <var-button
          type="primary"
          @click="loadImageAction(false)"
        >
          <Icon icon="solar:gallery-minimalistic-outline" />
          上一张(A)</var-button
        >
        <var-button
          type="primary"
          @click="labelManage.prevLabel()"
        >
          <Icon icon="solar:adhesive-plaster-2-broken" />
          上一个(Q)</var-button
        >
        <var-button
          type="primary"
          @click="labelManage.nextLabel()"
        >
          <Icon icon="solar:adhesive-plaster-2-broken" />
          下一个(E)</var-button
        >
        <var-button
          type="primary"
          @click="states.isEditLable = !states.isEditLable"
          :title="
            states.isEditLable
              ? `当前可以对框进行调整位置、改变大小、右键删除操作`
              : `当前可以绘制框、移动画布、缩放画布`
          "
        >
          <Icon
            v-if="!states.isEditLable"
            icon="solar:gallery-edit-linear"
          />
          <Icon
            v-else
            icon="solar:clapperboard-edit-linear"
          />
          切换到{{ states.isEditLable ? "绘制" : "编辑" }}模式(W)</var-button
        >
      </div>
      <div>
        <div title="图片大小">
          <Icon
            icon="solar:gallery-minimalistic-outline"
            style="color: var(--color-primary)"
          />
          {{ states.currentImage.width }}
          × {{ states.currentImage.height }}
        </div>
        <div title="鼠标相对于画布的位置">
          <Icon
            icon="solar:mouse-minimalistic-line-duotone"
            style="color: var(--color-primary)"
          />
          {{ states.currentState.mouseX }}
          × {{ states.currentState.mouseY }}
        </div>
        <div :title="`画布缩放倍率:${states.currentState.scale.toFixed(4)}`">
          <Icon
            icon="solar:scale-linear"
            style="color: var(--color-primary)"
          />
          {{
            Math.floor(states.currentState.scale * 100)
              .toString()
              .padStart(2, "0")
          }}%
        </div>
      </div>
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
            style="
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
            :title="item.name"
            @click="loadImageAction(item)"
          >
            <img
              :src="item.url"
              style="
                width: 2em;
                height: 2em;
                object-fit: cover;
                margin-right: 0.5em;
                border-radius: 0.1em;
              "
              lazy="true"
            />
            <span
              style="
                max-width: 5em;
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
              "
              >{{ item.name }}</span
            >
          </var-button>
        </template>
      </div>
      <!-- 画布 -->
      <div class="main">
        <canvas
          ref="canvasDom"
          class="main"
          id="labelImageCanvas"
          @mousedown="drawAction?.start($event)"
          @mousemove="drawAction?.move($event)"
          @contextmenu="drawAction?.contextmenu($event)"
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
          @click="addLable()"
        >
          <Icon
            style="font-size: 2em"
            icon="ic:round-add"
          />
          添加标签
        </var-button>
        <ListVue
          style="height: 81vh"
          :data="labelManage?.labels ?? []"
        >
          <template #default="{ data, index }">
            <var-button
              :text="states.currentLable.id !== data.id"
              type="primary"
              size="small"
              @click="labelManage?.setLable(index)"
              @contextmenu="lableContextmenu($event, data as any)"
            >
              <div style="display: flex; width: 7em">
                <div
                  :style="{
                    marginRight: '0.5em',
                    transform: 'translateY(0.1em)',
                    width: '1em',
                    height: '1em',
                    borderRadius: '50%',
                    backgroundColor: data.color,
                  }"
                ></div>
                <div
                  style="
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: left;
                  "
                >
                  {{ data.name }}
                </div>
              </div>
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
      :title="inputLabel.id === undefined ? '添加标签' : '编辑标签'"
    >
      <var-input
        v-model="inputLabel.name"
        placeholder="标签名"
        style="width: 100%"
        variant="outlined"
        size="small"
      >
        <template #prepend-icon>
          <ColorPicker
            shape="circle"
            v-model:pureColor="inputLabel.color"
            format="hex"
          ></ColorPicker>
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
    padding: 0.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > div {
      display: flex;
      align-items: center;
      gap: 5px;
      & > * {
        display: flex;
        align-items: center;
      }
    }
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
    }
    .main {
      flex: 1;
      position: relative;
      overflow: hidden;
      background-image: conic-gradient(
        rgba(0, 0, 0, 0.06) 0 25%,
        transparent 0 50%,
        rgba(0, 0, 0, 0.06) 0 75%,
        transparent 0
      );
      background-size: 15px 15px;
      box-shadow: inset 0 0 10px 0 rgba(0, 0, 0, 0.3);
      border-radius: 0.5em 0.5em 0 0;
      z-index: 1;
      canvas {
        position: relative;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
        border-radius: 0.1em;
        z-index: 0;
        width: 100%;
        height: 100%;
        --scale: 1;
        --x: 0;
        --y: 0;
        transition: transform 0.2s;
        transform-origin: center center;
        transform: translate(var(--x), var(--y)) scale(var(--scale));
      }
    }
  }
}
</style>
