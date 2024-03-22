import { Snackbar } from "@varlet/ui";
const INDEX_DB_NAME = "LABEL_IMAGE_INDEXDB";
const OBJECT_STORE_NAME = "LABEL_IMAGE_OBJECT_STORE";
const FOLDER_KEY = "lableImageFolder";
const OUTPUT_KEY = "lableImageOutput";
/**
 * 打开indexDB
 * @returns IDBDatabase
 */
function open() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const db = indexedDB.open(INDEX_DB_NAME, 3);
    db.onupgradeneeded = (event) => {
      const db = (event.target as any).result;
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME);
      }
      db.onversionchange = () => db.close();
      db.onsuccess = () => resolve(db.result);
    };
    db.onerror = (event) => {
      reject(event);
    };
    db.onsuccess = (event) => {
      resolve(db.result);
    };
  });
}

/**
 * 获取缓存数据
 * @param key 
 * @returns Promise<T | undefined>
 */
export async function getData<T>(key: string) {
  return new Promise<T | undefined>(async (resolve, reject) => {
    const db = await open();
    const request = db
      .transaction(OBJECT_STORE_NAME, "readonly")
      .objectStore(OBJECT_STORE_NAME)
      .get(key);

    request.onerror = (event) => {
      console.error("getData error", event);
      reject(undefined);
    };
    request.onsuccess = (event) => {
      resolve(request.result);
    };
  });
}
/**
 * 缓存数据
 * @param key 
 * @param value 
 * @returns void
 */
export async function setData(key: string, value: any) {
  return new Promise<void>(async (resolve, reject) => {
    const db = await open();
    const request = db
      .transaction(OBJECT_STORE_NAME, "readwrite")
      .objectStore(OBJECT_STORE_NAME)
      .put(value, key);

    request.onerror = (event) => {
      console.error("setData error", event);
      reject();
    };
    request.onsuccess = (event) => {
      resolve();
    };
  });
}


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