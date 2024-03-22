import { setData, getData } from "@/utils/indexDb";
import { Snackbar } from "@varlet/ui";
import type { Ref, UnwrapNestedRefs } from "vue";
import type { Label, LabelData } from "./lableImage";
const FOLDER_KEY = "lableImageFolder";
const OUTPUT_KEY = "lableImageOutput";

/**
 * 选择图片文件夹，必须要使用用户触发的事件调用
 */
export async function selectImageFolder() {
  try {
    // @ts-ignore
    const ImageDirHandle = (await showDirectoryPicker({
      id: FOLDER_KEY,
      mode: "read",
      startIn: "pictures",
    })) as FileSystemDirectoryHandle;
    setData("ImageDirHandle", ImageDirHandle);
  } catch (error) {
    console.error(error);
    // @ts-ignore
    Snackbar.error("打开文件夹失败, 请检查是否拒绝了权限请求");
  }
}
/**
 * 选择输出文件夹，必须要使用用户触发的事件调用
 */
export async function selectOutputFolder() {
  try {
    // @ts-ignore
    const OutputDirHandle = (await showDirectoryPicker({
      id: OUTPUT_KEY,
      mode: "readwrite",
    })) as FileSystemDirectoryHandle;
    setData("OutputDirHandle", OutputDirHandle);
  } catch (error) {
    console.error(error);
    // @ts-ignore
    Snackbar.error("打开文件夹失败, 请检查是否拒绝了权限请求");
  }
}
/**
 * 获取一个随机字符串
 * @returns
 */
export function getRadomId() {
  return Math.random().toString(36).substr(2);
}
/**
 * x,y,w,h 转换为yolo格式
 * @param x
 * @param y
 * @param width
 * @param height
 * @param imageWidth
 * @param imageHeight
 * @returns
 */
export function transfromYolo(
  x: number,
  y: number,
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number
) {
  const centerx = x + width / 2;
  const centery = y + height / 2;
  return {
    x: centerx / imageWidth,
    y: centery / imageHeight,
    width: width / imageWidth,
    height: height / imageHeight,
  };
}

/**
 * yolo格式转换为x,y,w,h
 * @param centerX
 * @param centerY
 * @param width
 * @param height
 * @param imageWidth
 * @param imageHeight
 * @returns
 */
export function transfromYoloReverse(
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number
) {
  const w = width * imageWidth;
  const h = height * imageHeight;
  const x = centerX * imageWidth - w / 2;
  const y = centerY * imageHeight - h / 2;
  return {
    x,
    y,
    width: w,
    height: h,
  };
}
/**
 * 默认标签
 */
export function getDefalutLables() {
  return [
    { id: 0, name: "person", color: "#a3103f" },
    { id: 1, name: "bicycle", color: "#692079" },
    { id: 2, name: "car", color: "#e7b814" },
    { id: 3, name: "motorcycle", color: "#f89892" },
    { id: 4, name: "airplane", color: "#15aa3f" },
    { id: 5, name: "bus", color: "#a43389" },
    { id: 6, name: "train", color: "#89ca75" },
    { id: 7, name: "truck", color: "#4bce20" },
    { id: 8, name: "boat", color: "#40d492" },
    { id: 9, name: "traffic light", color: "#f47c7a" },
    { id: 10, name: "fire hydrant", color: "#1979b1" },
    { id: 11, name: "stop sign", color: "#a09f4b" },
    { id: 12, name: "parking meter", color: "#381366" },
    { id: 13, name: "bench", color: "#85c892" },
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
    { id: 43, name: "knife", color: "#235393" },
    { id: 44, name: "spoon", color: "#6ef2e6" },
    { id: 45, name: "bowl", color: "#5d5c4c" },
    { id: 46, name: "banana", color: "#43bfca" },
    { id: 47, name: "apple", color: "#7fef14" },
    { id: 48, name: "sandwich", color: "#781102" },
    { id: 49, name: "orange", color: "#56bb40" },
    { id: 50, name: "broccoli", color: "#a73b02" },
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
    { id: 67, name: "cell phone", color: "#68d414" },
    { id: 68, name: "microwave", color: "#771f8d" },
    { id: 69, name: "oven", color: "#fd8cd6" },
    { id: 70, name: "toaster", color: "#ceea59" },
    { id: 71, name: "sink", color: "#fd3dfc" },
    { id: 72, name: "refrigerator", color: "#f1631c" },
    { id: 73, name: "book", color: "#eb624c" },
    { id: 74, name: "clock", color: "#120a7f" },
    { id: 75, name: "vase", color: "#cb528b" },
    { id: 76, name: "scissors", color: "#f66eb4" },
    { id: 77, name: "teddy bear", color: "#8a405a" },
    { id: 78, name: "hair drier", color: "#c639cb" },
    { id: 79, name: "toothbrush", color: "#5af16b" },
  ];
}

export function cacheLable(lables: Label[]) {
  localStorage.setItem("cacheLables", JSON.stringify(lables));
}
export function getLables() {
  const lables = localStorage.getItem("cacheLables");
  if (!lables) return getDefalutLables();
  return JSON.parse(lables) as Label[];
}

export interface StatesType {
  isShowChooseFolder: boolean;
  isShowLableName: boolean;
  isShowAddLable: boolean;
  isEditLable: boolean;
  lableIndex: number;
  imageIndex: number;
  lineWidth?: number;
  currentImage: {
    name: string;
    img: HTMLImageElement | null;
    width: number;
    height: number;
    dx: number; // 图片在画布中的位置
    dy: number;
    dw: number;
    dh: number;
  };
  currentLable: Label;
  selectLableId?: string;
  currentState: {
    scale: number;
    mouseX: number;
    mouseY: number;
  };
}
type ActionState =
  | "none"
  | "draw"
  | "drag"
  | "move"
  | "w-resize"
  | "e-resize"
  | "n-resize"
  | "s-resize"
  | "nw-resize"
  | "ne-resize"
  | "sw-resize"
  | "se-resize";
export class DrawAction {
  DOM: HTMLCanvasElement;
  CTX: CanvasRenderingContext2D;
  lableList: UnwrapNestedRefs<LabelData[]>;
  states: UnwrapNestedRefs<StatesType>;
  ActionState: ActionState = "none";
  startPoint = { x: 0, y: 0 };
  tempRect = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };
  /**
   *
   * @param DOM canvas元素
   * @param lableList reactive标签数据
   * @param states reactive状态数据
   */
  constructor(
    DOM: HTMLCanvasElement,
    lableList: UnwrapNestedRefs<LabelData[]>,
    states: UnwrapNestedRefs<StatesType>
  ) {
    this.DOM = DOM;
    this.CTX = DOM.getContext("2d") as CanvasRenderingContext2D;
    if (!this.CTX) throw new Error("canvas 2d context is null");
    this.lableList = lableList;
    this.states = states;
    this.start = this.start.bind(this);
    this.move = this.move.bind(this);
    this.end = this.end.bind(this);
    this.refreshDraw = this.refreshDraw.bind(this);
    this.drawImage = this.drawImage.bind(this);
    this.drawLable = this.drawLable.bind(this);
    this.drawRect = this.drawRect.bind(this);
    this.findLable = this.findLable.bind(this);
    this.findLableBorder = this.findLableBorder.bind(this);
    this.drawing = this.drawing.bind(this);
    this.movingCanvas = this.movingCanvas.bind(this);
    this.movingLable = this.movingLable.bind(this);
    this.resizeLable = this.resizeLable.bind(this);
    this.contextmenu = this.contextmenu.bind(this);
    this.deleteLable = this.deleteLable.bind(this);
    window.onmouseup = this.end.bind(this);
  }
  get currentLable() {
    return this.states.currentLable;
  }
  get currentImage() {
    return this.states.currentImage;
  }
  get lineWidth() {
    const { currentImage, states } = this;
    // 优先使用用户设置的线宽
    if (states.lineWidth) return states.lineWidth;
    // 根据图片大小自动计算线宽
    const { width, height } = currentImage;
    const min_w = Math.min(width, height);
    return Math.max(1, Math.floor(min_w / 200));
  }
  findLable(offsetX: number, offsetY: number): LabelData | undefined {
    const { lableList } = this;
    for (let i = lableList.length - 1; i >= 0; i--) {
      const { x, y, width, height } = lableList[i];
      if (
        offsetX >= x &&
        offsetX <= x + width &&
        offsetY >= y &&
        offsetY <= y + height
      ) {
        return lableList[i];
      }
    }
  }
  findLableBorder(
    offsetX: number,
    offsetY: number,
    lable: LabelData
  ): "s" | "n" | "w" | "e" | "center" | "none" {
    const { x, y, width, height } = lable;
    const { lineWidth } = this;
    const x1 = x + width;
    const y1 = y + height;
    const border = lineWidth;
    if (offsetX >= x && offsetX <= x + border) return "w";
    if (offsetX >= x1 - border && offsetX <= x1 + border) return "e";
    if (offsetY >= y && offsetY <= y + border) return "n";
    if (offsetY >= y1 - border && offsetY <= y1 + border) return "s";
    if (
      offsetX >= x + border &&
      offsetX <= x1 - border &&
      offsetY >= y + border &&
      offsetY <= y1 - border
    )
      return "center";
    return "none";
  }
  /**
   * 移动框
   */
  movingLable(e: MouseEvent) {
    const { DOM, lableList, states } = this;
    const { selectLableId } = states;
    const lable = lableList.find((l) => l.id === selectLableId);
    if (!lable) return;
    const scale = Number(DOM.style.getPropertyValue("--scale"));
    const { x, y, width, height } = lable;
    const { movementX, movementY } = e;
    lable.x += movementX / scale;
    lable.y += movementY / scale;
    // 限制移动范围
    if (lable.x < 0) lable.x = 0;
    if (lable.y < 0) lable.y = 0;
    if (lable.x + width > DOM.width) lable.x = DOM.width - width;
    if (lable.y + height > DOM.height) lable.y = DOM.height - height;
    this.refreshDraw();
  }
  /**
   * 改变框大小
   */
  resizeLable(e: MouseEvent) {
    const { DOM, lableList, states, ActionState: state } = this;
    const { selectLableId } = states;
    const lable = lableList.find((l) => l.id === selectLableId);
    if (!lable) return;
    const { x, y, width, height } = lable;
    const scale = Number(DOM.style.getPropertyValue("--scale"));
    const movementX = e.movementX / scale;
    const movementY = e.movementY / scale;
    const { lineWidth } = this;
    const x1 = x + width;
    const y1 = y + height;
    switch (state) {
      case "w-resize":
        lable.x += movementX;
        lable.width -= movementX;
        break;
      case "e-resize":
        lable.width += movementX;
        break;
      case "n-resize":
        lable.y += movementY;
        lable.height -= movementY;
        break;
      case "s-resize":
        lable.height += movementY;
        break;
      case "nw-resize":
        lable.x += movementX;
        lable.y += movementY;
        lable.width -= movementX;
        lable.height -= movementY;
        break;
      case "ne-resize":
        lable.y += movementY;
        lable.width += movementX;
        lable.height -= movementY;
        break;
      case "sw-resize":
        lable.x += movementX;
        lable.width -= movementX;
        lable.height += movementY;
        break;
      case "se-resize":
        lable.width += movementX;
        lable.height += movementY;
        break;
    }
    // 限制移动范围
    if (lable.x < 0) lable.x = 0;
    if (lable.y < 0) lable.y = 0;
    if (lable.x + lable.width > DOM.width) lable.width = DOM.width - lable.x;
    if (lable.y + lable.height > DOM.height)
      lable.height = DOM.height - lable.y;
    // 限制最小宽度
    if (lable.width < lineWidth * 2) lable.width = lineWidth * 2;
    if (lable.height < lineWidth * 2) lable.height = lineWidth * 2;
    this.refreshDraw();
  }
  /**
   * 移动画布
   */
  movingCanvas(e: MouseEvent) {
    const { DOM: canvas } = this;
    const { movementX, movementY } = e;
    const originX = Number(
      canvas.style.getPropertyValue("--x").replace("px", "")
    );
    const originY = Number(
      canvas.style.getPropertyValue("--y").replace("px", "")
    );
    const x = originX + movementX;
    const y = originY + movementY;
    canvas.style.setProperty("--x", `${x}px`);
    canvas.style.setProperty("--y", `${y}px`);
  }
  /**
   * 删除标签
   */
  deleteLable(id: string) {
    const { lableList } = this;
    const index = lableList.findIndex((l) => l.id === id);
    if (index === -1) return;
    lableList.splice(index, 1);
    this.refreshDraw();
  }
  /**
   * 画框
   */
  drawing(e: MouseEvent) {
    const {
      CTX: canvasCtx,
      startPoint,
      tempRect,
      currentLable,
      refreshDraw,
      drawRect,
    } = this;
    refreshDraw();
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
    // 缓存框的最后位置
    tempRect.x = _x;
    tempRect.y = _y;
    tempRect.w = _w;
    tempRect.h = _h;
    const { color } = currentLable;
    drawRect({
      x: _x,
      y: _y,
      width: _w,
      height: _h,
      color,
    });
  }
  /**
   * 右键菜单
   */
  contextmenu(e: MouseEvent) {
    e.preventDefault();
    const { states, findLable, deleteLable } = this;
    if (!states.isEditLable) return;
    const { offsetX, offsetY } = e;
    const lable = findLable(offsetX, offsetY);
    if (!lable) return;
    this.states.selectLableId = lable.id;
    this.refreshDraw();
    confirm("确定删除标签吗？") && deleteLable(lable.id);
  }
  drawRect(
    {
      x,
      y,
      width,
      height,
      color,
      name,
    }: {
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      name?: string;
    },
    bolder = false
  ) {
    const { CTX, lineWidth, states } = this;
    CTX.strokeStyle = color;
    CTX.fillStyle = color;
    // 把id画在左上角
    CTX.lineWidth = lineWidth / 2.5;
    CTX.font = `${lineWidth * 5}px Arial`;
    if (states.isShowLableName) {
      const _name = name ?? states.currentLable.name;
      if (y > lineWidth * 4) CTX.strokeText(_name, x, y - lineWidth * 2);
      else CTX.strokeText(_name, x, y + height + 4 * lineWidth);
    }
    CTX.lineWidth = bolder ? lineWidth * 1.5 : lineWidth;
    CTX.strokeRect(x, y, width, height);
  }
  start(e: MouseEvent) {
    const { DOM: canvasDom, states } = this;
    // 右键开始拖拽
    if (e.button === 2 && !states.isEditLable) {
      this.ActionState = "drag";
      canvasDom.style.cursor = "move";
      canvasDom.style.transition = "none";
      return;
    }
    // 左键开始移动
    if (e.button !== 0) return;
    this.startPoint = { x: e.offsetX, y: e.offsetY };
    const cursor = canvasDom.style.cursor;
    if (cursor.includes("resize")) {
      this.ActionState = cursor as ActionState;
      return;
    }
    if (cursor.includes("move")) {
      this.ActionState = "move";
      return;
    }
    this.ActionState = "draw";
  }
  move(e: MouseEvent) {
    const {
      DOM,
      drawing,
      states,
      movingCanvas,
      ActionState: state,
      findLable,
      findLableBorder,
      movingLable,
      resizeLable,
    } = this;
    const { currentState } = states;
    const { offsetX, offsetY } = e;
    currentState.mouseX = offsetX;
    currentState.mouseY = offsetY;
    if (state === "drag") {
      movingCanvas(e);
    } else if (state === "draw") {
      drawing(e);
    } else if (state === "move") {
      movingLable(e);
    } else if (state.includes("resize")) {
      resizeLable(e);
    } else if (states.isEditLable) {
      // 寻找标签
      const { offsetX, offsetY } = e;
      const lable = findLable(offsetX, offsetY);
      if (!lable) {
        DOM.style.cursor = "default";
        this.states.selectLableId = undefined;
        this.refreshDraw();
        return;
      }
      this.states.selectLableId = lable.id;
      this.refreshDraw();
      const border = findLableBorder(offsetX, offsetY, lable);
      switch (border) {
        case "none":
          DOM.style.cursor = "default";
          return;
        case "center":
          DOM.style.cursor = "move";
          return;
        default:
          DOM.style.cursor = border + "-resize";
          return;
      }
    }
  }
  end() {
    const {
      DOM: canvas,
      currentLable,
      tempRect,
      lableList,
      refreshDraw,
      ActionState: state,
      lineWidth,
    } = this;
    switch (state) {
      case "drag":
        canvas.style.cursor = "default";
        canvas.style.transition = "transform 0.2s";
        break;
      case "draw":
        const id = getRadomId();
        const { id: cid, name, color } = currentLable;
        const { x, y, w, h } = tempRect;
        // 小于lineWidth不保存
        if (w < lineWidth || h < lineWidth) {
          refreshDraw();
          break;
        }
        lableList.push({
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
        break;
    }
    this.ActionState = "none";
  }
  drawImage() {
    const { DOM, currentImage } = this;
    const cavans = DOM;
    const { img } = currentImage;
    if (!img) return;
    DOM.style.backgroundImage = `url(${img.src})`;
    const { width, height } = cavans;
    DOM.style.backgroundSize = `${width}px ${height}px`;
  }
  drawLable() {
    const { lableList, drawRect, states } = this;
    const { selectLableId } = states;
    lableList.forEach((lable) => drawRect(lable, lable.id === selectLableId));
  }
  refreshDraw() {
    const { CTX, drawImage, drawLable } = this;
    // 清空画布
    const { width, height } = CTX.canvas;
    CTX.clearRect(0, 0, width, height);
    drawImage();
    drawLable();
  }
}
