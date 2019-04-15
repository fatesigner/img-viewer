/**
 * interfaces
 */

export type ExcludeProp<T, K> = Pick<T, Exclude<keyof T, K>>;

export type IPhotoswipeInstance = Record<string, any>;

// photoswipe 选项
export interface IPhotoswipeBaseOptions {
  addCaptionHTMLFn?: any;
  galleryUID?: string;
  loop?: boolean;
  history?: boolean;
  focus?: boolean;
  mainClass?: string;
  showHideOpacity?: boolean;

  // Buttons/elements
  closeEl?: boolean;
  captionEl?: boolean;
  fullscreenEl?: boolean;
  zoomEl?: boolean;
  shareEl?: boolean;
  counterEl?: boolean;
  arrowEl?: boolean;
  preloaderEl?: boolean;

  // Tap on sliding area should close gallery
  tapToClose?: boolean;

  // Tap should toggle visibility of controlsgalleryUID
  tapToToggleControls?: boolean;

  // Mouse click on image should close the gallery,
  // only when image is smaller than size of the viewport
  clickToCloseNonZoomable?: boolean;

  barsSize?: { top: number; bottom: number };
  bgOpacity?: number;

  shareButtons?: { id: string; label: string; url: string; download: boolean }[];

  getThumbBoundsFn?: (...args: any[]) => any;

  [key: string]: any;
}

// photoswipe 事件
export interface IImgViewerListeners {
  // 图片显示（动画完成）之后出发
  presented?: () => void;
  // 图片关闭（动画完成）之后出发
  dismissed?: () => void;
}

export interface IPresentItem {
  src: string;
  msrc?: string;
  title?: string;
  author?: string;
  w?: number;
  h?: number;
}

export interface IPresentOptions {
  // 当前显示的图片序号
  index: number;
  // 待显示的图片集合
  items: IPresentItem[];
  photoswipeOpts?: IPhotoswipeBaseOptions;
  photoswipeInitial?: (photoswipeInstance: any) => void;
  listeners?: IImgViewerListeners;
}

export type IDelegateOptions = ExcludeProp<IPresentOptions, 'index' | 'items'> & {
  // 需要代理的元素
  targetEl: any;
  // item 选择器
  itemSelector: string;
  // img 选择器
  imgSelector?: string;
};
