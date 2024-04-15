import { reactive, type UnwrapNestedRefs } from "vue";
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
export function getRadomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}
// 图片数据
export interface ImageData {
  name: string;
  value: FileSystemFileHandle;
  url: string;
}
// 标签分类数据
export interface Label {
  id: number;
  name: string;
  color: string;
}
// 标签的具体数据
export interface LabelData {
  id: string; // 唯一id
  name: string; // 名称
  cid: number; // class id
  color: string; // 颜色
  x: number;
  y: number;
  width: number;
  height: number;
}
interface FileIoParams {
  ImageDirHandle: FileSystemDirectoryHandle;
  OutputDirHandle: FileSystemDirectoryHandle;
}
export class FileIo {
  ImageDirHandle: FileSystemDirectoryHandle;
  OutputDirHandle: FileSystemDirectoryHandle;
  imagesData = new Array<ImageData>();
  index = 0;
  constructor(param: FileIoParams) {
    let { ImageDirHandle, OutputDirHandle } = param;
    this.ImageDirHandle = ImageDirHandle;
    this.OutputDirHandle = OutputDirHandle;
    this.saveYoloFile = this.saveYoloFile.bind(this);
    this.loadYoloFile = this.loadYoloFile.bind(this);
    this.readFile = this.readFile.bind(this);
    this.initImages = this.initImages.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.setIndex = this.setIndex.bind(this);
  }
  async initImages() {
    const { ImageDirHandle, imagesData } = this;
    //@ts-ignore
    for await (const [key, value] of ImageDirHandle.entries()) {
      // 忽略非图片文件
      if (!value.name.match(/\.(jpg|jpeg|png|gif)$/)) continue;
      const file = await value.getFile();
      const url = URL.createObjectURL(file);
      imagesData.push({ name: key, value, url });
    }
  }

  setIndex(index: number) {
    if (index < 0 || index >= this.imagesData.length)
      throw new Error("index out of range");
    this.index = index;
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
  transfromYolo(
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
  transfromYoloReverse(
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
   * 写入文件
   * @param {string} name 文件名
   * @param {string} content 文件内容
   */
  async saveFile(name: string, content: string) {
    const { OutputDirHandle } = this;
    const fileHandle = await OutputDirHandle.getFileHandle(name, {
      create: true,
    });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }
  /**
   * 保存为yolo格式
   */
  async saveYoloFile(
    imgName: string,
    imgWidth: number,
    imgHeight: number,
    lableList: LabelData[]
  ) {
    const { transfromYolo, saveFile } = this;
    let content = "";
    lableList.forEach((lable) => {
      let { x, y, width, height, cid } = lable;
      const yolo = transfromYolo(x, y, width, height, imgWidth, imgHeight);
      const str = `${cid} ${yolo.x} ${yolo.y} ${yolo.width} ${yolo.height}\n`;
      content += str;
    });
    const name = imgName.split(".")[0] + ".txt";
    await saveFile(name, content);
  }

  /**
   * 加载yolo数据文件
   */

  async loadYoloFile(
    name: string,
    imgWidth: number,
    imgHeight: number,
    getLabelById: (cid: number) => Label
  ): Promise<LabelData[]> {
    const fileName = name.split(".")[0] + ".txt";
    const { readFile, transfromYoloReverse } = this;
    const content = await readFile(fileName);
    if (!content) return [];
    return content
      .split("\n")
      .filter((item) => item)
      .map((item) => {
        const [_cid, x, y, width, height] = item.split(" ");
        const lableData = transfromYoloReverse(
          Number(x),
          Number(y),
          Number(width),
          Number(height),
          imgWidth,
          imgHeight
        );
        const cid = Number(_cid);
        const { name, color } = getLabelById(cid);
        const id = Math.random().toString(36).slice(2);
        return { id, cid, name, color, ...lableData };
      });
  }

  async readFile(name: string) {
    try {
      const { OutputDirHandle } = this;
      if (!OutputDirHandle) {
        console.error("OutputDirHandle is not initialized.");
        return undefined;
      }
      const fileHandle = await OutputDirHandle.getFileHandle(name);
      const file = await fileHandle.getFile();
      const text = await file.text();
      return text;
    } catch (error) {
      return undefined;
    }
  }

  get nextImage() {
    const { imagesData, index } = this;
    this.index = (index + 1) % imagesData.length;
    return imagesData[this.index];
  }
  get prevImage() {
    const { imagesData, index } = this;
    this.index = (index - 1 + imagesData.length) % imagesData.length;
    return imagesData[this.index];
  }

  get currentImage() {
    return this.imagesData[this.index];
  }
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
    if (!states.isEditLable) canvasDom.style.cursor = "default";
    if (cursor.includes("resize") && states.isEditLable) {
      this.ActionState = cursor as ActionState;
      return;
    }
    if (cursor.includes("move") && states.isEditLable) {
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
        const id = Math.random().toString(36).slice(2);
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
export class LabelManage {
  index: number = 0;
  labels: UnwrapNestedRefs<Label[]> = reactive([]);
  states: UnwrapNestedRefs<StatesType>;
  constructor(states: UnwrapNestedRefs<StatesType>) {
    this.states = states;
    this.nextLabel = this.nextLabel.bind(this);
    this.prevLabel = this.prevLabel.bind(this);
    this.addLabel = this.addLabel.bind(this);
    this.deleteLabel = this.deleteLabel.bind(this);
    this.updateLabel = this.updateLabel.bind(this);
    this.getLabelById = this.getLabelById.bind(this);
    this.save = this.save.bind(this);
    this.read = this.read.bind(this);
    this.getRadomColor = this.getRadomColor.bind(this);
    const { lableList = getDefalutLables(), currentIndex = 0 } = this.read();
    this.labels.push(...lableList);
    this.index = currentIndex ?? 0;
  }
  get currentLabel() {
    return this.labels[this.index];
  }
  nextLabel() {
    this.index = (this.index + 1) % this.labels.length;
    this.states.currentLable = this.currentLabel;
    return this.currentLabel;
  }
  prevLabel() {
    this.index = (this.index - 1 + this.labels.length) % this.labels.length;
    this.states.currentLable = this.currentLabel;
    return this.currentLabel;
  }
  setLable(index: number) {
    if (index < 0 || index >= this.labels.length) return;
    this.index = index;
    this.states.currentLable = this.currentLabel;
  }
  addLabel(name: string, color = this.getRadomColor(), _id?: number) {
    const id = _id ?? this.labels.length;
    this.labels.push({ name, color, id });
    return this.labels[this.labels.length - 1];
  }
  deleteLabel(id: number) {
    const index = this.labels.findIndex((item) => item.id === id);
    if (index === -1) return;
    this.labels.splice(index, 1);
  }
  updateLabel(id: number, label: Label) {
    console.log(id, label);
    const index = this.labels.findIndex((item) => item.id === id);
    if (index === -1) return;
    this.labels.splice(index, 1, label);
  }
  getLabelById(id: number) {
    return this.labels.find((item) => item.id === id);
  }
  save() {
    const { labels, index } = this;
    localStorage.setItem("lableList", JSON.stringify(labels));
    localStorage.setItem("currentIndex", JSON.stringify(index));
  }
  read() {
    const lableListStr = localStorage.getItem("lableList");
    const currentIndexStr = localStorage.getItem("currentIndex");
    return {
      lableList: lableListStr ? JSON.parse(lableListStr) : undefined,
      currentIndex: currentIndexStr ? Number(currentIndexStr) : undefined,
    };
  }
  getRadomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
}
