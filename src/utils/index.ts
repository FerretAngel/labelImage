import { setData, getData } from "@/utils/indexDb";
import { Snackbar } from "@varlet/ui";
const FOLDER_KEY = "lableImageFolder";
const OUTPUT_KEY = "lableImageOutput";

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

export function getRadomId() {
  return Math.random().toString(36).substr(2);
}

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
