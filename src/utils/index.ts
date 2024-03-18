import { setData, getData } from "@/utils/indexDb";
import { Snackbar } from "@varlet/ui";
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
