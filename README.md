# img-viewer

[![npm][npm-image]][npm-url]
[![build][travis-image]][travis-url]
[![download][download-image]][download-url]
[![commitizen][commitizen-image]][commitizen-url]
[![semantic][semantic-image]][semantic-url]

[npm-image]: https://img.shields.io/npm/v/@fatesigner/img-viewer.svg?color=red
[npm-url]: https://npmjs.com/package/@fatesigner/img-viewer
[travis-image]: https://travis-ci.com/fatesigner/img-viewer.svg?branch=master&color=success
[travis-url]: https://travis-ci.com/fatesigner/img-viewer
[download-image]: https://img.shields.io/npm/dw/@fatesigner/img-viewer.svg?color=green
[download-url]: https://npmjs.com/package/@fatesigner/img-viewer
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-green.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square
[semantic-url]: https://opensource.org/licenses/MIT

适用于 PC 和移动端的 web 图片相册浏览器. 

[DEMO](https://photoswipe.com/)

## 说明
- 基于 [PhotoSwipe v4.1.3](https://github.com/dimsemenov/PhotoSwipe) 并使用 typescript 编写，提供了一套更易用的 API
- 利用 Webpack 的 [dynamic import](https://webpack.docschina.org/guides/code-splitting/) 以减少首屏加载时间
- 支持函数直接调用弹出，无需操作 document
## 安装

```bash
npm i -S @fatesigner/img-viewer
```

## 使用
#### startup.ts
```ts
import { ImgViewer } from '@fatesigner/img-viewer';

// 配置默认选项
ImgViewer.config({
  // 是否循环滑动
  loop: false,
  // 禁止 hash history
  history: false
});
```
#### html
```html
<ul id="photoswipe">
  <li data-size="600x800" 
      data-src="your original imgage src" 
      data-src-mini="your mini imgage src" 
      data-title="title 1" 
      data-author="author 1">
    <img src="your mini imgage src" alt="" title="" />
  </li>
  <li data-size="600x600" 
      data-title="title 2" 
      data-author="author 2">
    <img src="your mini imgage src" alt="" title="" />
  </li>
  <li data-size="600x1200" 
      data-title="title 3" 
      data-author="author 3">
    <img src="your mini imgage src" alt="" title="" />
  </li>
</ul>
```
#### main.ts
```ts
import { ImgViewer } from '@fatesigner/img-viewer';

// 直接打开
ImgViewer.present({
  index: 1,
  items: [
    {
      author: 'author 1',
      title: 'title 1',
      w: 600,
      h: 800,
      src: 'your original imgage src',
      msrc: 'your mini imgage src'
    },
    {
      author: 'author 2',
      title: 'title 2',
      w: 600,
      h: 600,
      src: 'your original imgage src',
      msrc: 'your mini imgage src'
    },
    {
      author: 'author 3',
      title: 'title 3',
      w: 600,
      h: 1200,
      src: 'your original imgage src',
      msrc: 'your mini imgage src'
    }
  ],
  // 监听事件
  listeners: {
    presented() {
      console.log('The imgViewer was presented.');
    },
    dismissed() {
      console.log('The imgViewer was dismissed.');
    }
  }
});

// 绑定页面上的 container，可以拥有 zoom 动画效果
let imgViewer = new ImgViewer({
  targetEl: document.querySelector('#photoswipe'),
  itemSelector: 'li',
  imgSelector: 'img',
  // 监听事件
  listeners: {
    presented() {
      console.log('The imgViewer was presented.');
    },
    dismissed() {
      console.log('The imgViewer was dismissed.');
    }
  }
});

// 手动打开
imgViewer.present();

// 关闭
imgViewer.dismiss();
```

## API（静态方法）
### ImgViewer.config(options: [IPhotoswipeBaseOptions](#IPhotoswipeBaseOptions))
> 在使用前预先配置默认选项.

### ImgViewer.present(options: [IPresentOptions](#IPresentOptions))
> 以函数调用的方式打开图片，无需操作 document.

### ImgViewer.dismiss()
> 关闭图片（一般无需手动关闭）.

## API（实例方法）
### new ImgViewer(options: [IDelegateOptions](#IDelegateOptions))
> 初始化实例，绑定页面元素.

### present(index?: number)
> 手动打开图片，指定显示第一张图片的序号，默认为 0.

### dismiss()
> 关闭图片（一般无需手动关闭）.

## 接口&参数
### IPresentOptions
| Param | type |  default | Description |
| --- | --- | --- | --- |
| index | Number | 0 | 图片序号（显示第一张图片的序号） |
| items | [IPresentItem](#IPresentItem)[] | [] | 图片清单 |
| photoswipeOpts | [IPhotoswipeBaseOptions](#IPhotoswipeBaseOptions) | [DefaultPhotoswipeBaseOptions](#DefaultPhotoswipeBaseOptions) | photoswipe 参数 |
| photoswipeInitial | (pswp: any) => void | null | 提供一个函数初始化 photoswipe 实例，可以在这个函数中绑定事件，改变属性（不推荐）等操作 |
| listeners | [IImgViewerListeners](#IImgViewerListeners) | null | 事件监听器 |

### IDelegateOptions
| Param | type |  default | Description |
| --- | --- | --- | --- |
| index | Number | 0 | 图片序号（显示第几张） |
| items | [IPresentItem](#IPresentItem)[] | [] | 图片清单 |
| photoswipeOpts | [IPhotoswipeBaseOptions](#IPhotoswipeBaseOptions) | [DefaultPhotoswipeBaseOptions](#DefaultPhotoswipeBaseOptions) | photoswipe 参数 |
| listeners | [IImgViewerListeners](#IImgViewerListeners) | null | 事件监听器 |

### IPresentItem
> 图片的属性及参数

| Param | type |  default | Description |
| --- | --- | --- | --- |
| src | String | null | 图片地址（大图） |
| msrc | String | null | 图片地址（缩略图） |
| w | Number | null | 图片宽度 |
| h | Number | null | 图片高度 |
| title | String | null | 标题 |
| author | String | null | 作者 |

### IImgViewerListeners
> 事件监听，其他事件可查看 [photoswipe.com](https://photoswipe.com/documentation/api.html)
```ts
export interface IImgViewerListeners {
  // 图片显示（动画完成）之后触发
  presented?: () => void;
  // 图片关闭（动画完成）之后触发
  dismissed?: () => void;
}
```
> 目前只封装了图片显示、关闭事件，如果需要绑定其他事件可以使用 photoswipeInitial，如下
```ts
let imgViewer = new ImgViewer({
  targetEl: document.querySelector('#photoswipe'),
  itemSelector: 'li',
  imgSelector: 'img',
  // 监听事件
  listeners: {
    presented() {
      console.log('The imgViewer was presented.');
    },
    dismissed() {
      console.log('The imgViewer was dismissed.');
    }
  },
  // 初始化 photoswipe 实例
  photoswipeInitial(pswp) {
    // Mouse was used (triggers only once)
    pswp.listen('mouseUsed', function() { });

    // Opening zoom in animation starting
    pswp.listen('initialZoomIn', function() { });

    // Opening zoom in animation finished
    pswp.listen('initialZoomInEnd', function() { });

    // Closing zoom out animation started
    pswp.listen('initialZoomOut', function() { });

    // Closing zoom out animation finished
    pswp.listen('initialZoomOutEnd', function() { });
  }
});

imgViewer.present();
```

### IPhotoswipeBaseOptions
> photoswipe 参数，具体可查看 [photoswipe.com](https://photoswipe.com/documentation/options.html)
> 基于常用场景的考虑，目前只封装了部分参数，其余参数可在此基础上增加，接口没有做限制.
```ts
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
}
```

### DefaultPhotoswipeBaseOptions
> photoswipe 默认参数

```ts
export const DefaultPhotoswipeBaseOptions: IPhotoswipeBaseOptions = {
  loop: true,
  history: true,
  focus: false,
  mainClass: 'pswp--minimal--dark',
  barsSize: { top: 0, bottom: 0 },
  // Buttons/elements
  closeEl: true,
  captionEl: true,
  fullscreenEl: true,
  zoomEl: true,
  shareEl: false,
  counterEl: true,
  arrowEl: true,
  preloaderEl: true,
  bgOpacity: 0.7,
  tapToClose: true,
  tapToToggleControls: false,
  shareButtons: [
    { id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true }
  ],
  addCaptionHTMLFn: function (item, captionEl, isFake) {
    if (!item.title) {
      captionEl.children[0].innerText = '';
      return false;
    }
    if (item.author) {
      captionEl.children[0].innerHTML = item.title + '<br/><small>' + item.author + '</small>';
    }
    return true;
  }
}
```
