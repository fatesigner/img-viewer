/**
 * photoswipe
 */

import { merge } from 'lodash';
import { GetGUID } from '@fatesigner/utils/random';
import { IsFunction } from '@fatesigner/utils/type-check';
import { AddEventListener, Closest, RemoveEventListener } from '@fatesigner/utils/document';

import {
  IDelegateOptions,
  IImgViewerListeners,
  IPhotoswipeBaseOptions,
  IPhotoswipeInstance,
  IPresentItem,
  IPresentOptions
} from './interfaces';

import './img-viewer.scss';

export const DefaultPresentOptions: IPresentOptions = {
  index: 0,
  items: []
};

export const DefaultDelegateOptions: IDelegateOptions = {
  targetEl: null,
  itemSelector: null,
  imgSelector: 'img'
};

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
  shareButtons: [{ id: 'download', label: 'Download image', url: '{{raw_image_url}}', download: true }],
  addCaptionHTMLFn: function (item, captionEl) {
    if (!item.title) {
      captionEl.children[0].innerText = '';
      return false;
    }
    if (item.author) {
      captionEl.children[0].innerHTML = item.title + '<br/><small>' + item.author + '</small>';
    }
    return true;
  }
};

// 设置一个值判断 photoswipe lib 是否已加载完成
let loaded = false;

abstract class ImgViewerAbstract {
  // 配置
  readonly options: any;

  // 打开
  abstract present(): Promise<void>;

  // 关闭
  abstract dismiss(): void;

  // 销毁实例
  abstract destroy(): void;
}

export class ImgViewer implements ImgViewerAbstract {
  static defaultOptions: IPhotoswipeBaseOptions = DefaultPhotoswipeBaseOptions;
  static instance: IPhotoswipeInstance;
  // 监听 document.body click 事件
  static readonly _listeners: any = {
    onBodyClick: null
  };

  readonly options: IDelegateOptions = DefaultDelegateOptions;
  instance: IPhotoswipeInstance;

  // 监听 targetEl click 事件
  private readonly _listeners: any = {
    onTargetElClick: null
  };

  /**
   * 配置
   * @param opts
   */
  static config(opts: IPhotoswipeBaseOptions) {
    merge(this.defaultOptions, opts);
  }

  /**
   * 获取 template，appendTo 至 document.body，并返回该元素
   */
  static getTemplateEl(): any {
    let $tpl: Element = document.getElementById('photoSwipeTemplate');
    let templateStr;
    if (!$tpl) {
      templateStr = `
<div id="photoSwipeTemplate" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="pswp__bg"><div class="pswp__spinner"></div></div>
  <div class="pswp__scroll-wrap">
    <div class="pswp__container">
      <div class="pswp__item"></div>
      <div class="pswp__item"></div>
      <div class="pswp__item"></div>
    </div>
    <div class="pswp__ui pswp__ui--hidden">
      <div class="pswp__top-bar">
        <div class="pswp__counter"></div>
        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
        <button class="pswp__button pswp__button--share" title="Share"></button>
        <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
        <div class="pswp__preloader">
          <div class="pswp__preloader__icn">
            <div class="pswp__preloader__cut">
              <div class="pswp__preloader__donut"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
        <div class="pswp__share-tooltip"></div>
      </div>
      <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
      <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
      <div class="pswp__caption">
        <div class="pswp__caption__center"></div>
      </div>
    </div>
  </div>
</div>`;
      const el = document.createElement('div');
      el.innerHTML = templateStr;
      $tpl = el.children[0];
      document.getElementsByTagName('body')[0].appendChild($tpl);
    }

    return $tpl;
  }

  // 转换 item
  static mapItem(item: any): any {
    if (item) {
      (item as any).size = !!(item.w && item.h);
      // 设置默认尺寸为 800x800
      item.w = item.w ? item.w : 800;
      item.h = item.h ? item.h : 800;
    }
    return item as any;
  }

  /**
   * 创建 photoswipe 实例
   * @param items
   * @param photoswipeOpts
   * @param listeners
   * @param photoswipeInitial
   */
  static async createPhotoswipe(
    items: IPresentItem[],
    photoswipeOpts: IPhotoswipeBaseOptions,
    listeners: IImgViewerListeners,
    photoswipeInitial?: (pswp: any) => void
  ): Promise<IPhotoswipeInstance> {
    const $tpl = this.getTemplateEl();

    // 显示 loading 状态
    if (!loaded) {
      $tpl.className += ' pswp--open';
      $tpl.querySelector('.pswp__bg').style.opacity = photoswipeOpts.bgOpacity;
    }

    const [res1, res2] = await Promise.all([
      import('photoswipe/dist/photoswipe.js'),
      import('photoswipe/dist/photoswipe-ui-default.js')
    ]);

    const PhotoSwipe = res1.default;
    const PhotoSwipeUI_Default = res2.default;

    if (!loaded) {
      loaded = true;
      $tpl.className = $tpl.className.replace(new RegExp('(\\s|^)pswp--open(\\s|$)'), ' ');
    }

    const instance: IPhotoswipeInstance = new PhotoSwipe($tpl, PhotoSwipeUI_Default, items, photoswipeOpts);

    /* instance.listen('gettingData', (index: number, item: any) => {
      if (item.html === undefined && item.onloading === undefined && !item.size) {

      }
    }); */

    // Image loaded
    instance.listen('imageLoadComplete', function (index: number, item: any) {
      if (item.html === undefined && item.onloading === undefined && !item.size) {
        item.onloading = true;
        // unknown size
        const img = new Image();
        img.onload = () => {
          // will get size after load
          item.w = img.width; // set image width
          item.h = img.height; // set image height
          instance.invalidateCurrItems(); // reinit Items
          instance.updateSize(true); // reinit Items
        };
        img.src = item.src; // let's download image
      }
    });

    if (listeners) {
      if (IsFunction(listeners.presented)) {
        instance.listen('initialZoomInEnd', listeners.presented);
      }

      if (IsFunction(listeners.dismissed)) {
        instance.listen('close', listeners.dismissed);
      }
    }

    // 绑定 body click 事件 以解决关闭异常的问题
    if (!this._listeners.onBodyClick) {
      this._listeners.onBodyClick = (e: any) => {
        const target = Closest(e.target, '.pswp', true);
        if (target && target.getAttribute('aria-hidden') === 'true' && target.classList.length > 1) {
          target.classList = 'pswp';
        }
      };
    }

    if (photoswipeInitial) {
      photoswipeInitial(instance);
    }

    return instance;
  }

  constructor(opts: IDelegateOptions) {
    this.options = merge({}, { photoswipeOpts: ImgViewer.defaultOptions }, opts);

    // 监听 targetEl item 点击事件
    this._listeners.onTargetElClick = async (e: any) => {
      const target = Closest(e.target, this.options.itemSelector);
      if (target) {
        const $items = this.options.targetEl.querySelectorAll(this.options.itemSelector);
        const index = Array.from($items).findIndex((x) => x === target);
        this.present(index);
      }
    };

    AddEventListener(this.options.targetEl, 'click', this._listeners.onTargetElClick);
  }

  /**
   * 打开
   * @param opts
   */
  static async present(opts: IPresentOptions) {
    opts = merge({}, DefaultPresentOptions, { photoswipeOpts: this.defaultOptions }, opts);

    (opts.photoswipeOpts as any).index = opts.index;
    opts.photoswipeOpts.galleryUID = GetGUID(12);

    // 鉴于 photoswipe 在关闭后会将 _isDestroying 设置为 true，所以无法重用之前的实例，这里每次都创建新的
    this.instance = await this.createPhotoswipe(
      opts.items.map((x) => ImgViewer.mapItem(x)),
      opts.photoswipeOpts,
      opts.listeners,
      opts.photoswipeInitial
    );

    this.instance.init();
  }

  async present(index = 0) {
    // 获取 items 数据
    const $items = this.options.targetEl.querySelectorAll(this.options.itemSelector);

    if (!$items.length) {
      return;
    }

    const items = [];
    let $el;
    let size: string[] = ['0', '0'];
    let index_ = 0;

    for (let i = 0, l = $items.length; i < l; i++) {
      $el = $items[i];
      const size_ = $el.getAttribute('data-size');
      if (size_) {
        size = size_.split('x');
      }
      const $img = $el.querySelector(this.options.imgSelector);
      const item = ImgViewer.mapItem({
        el: $img,
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10),
        author: $el.getAttribute('data-author'),
        title: $el.getAttribute('data-title') || $img.getAttribute('title'),
        src: $el.getAttribute('data-src') || $img.getAttribute('src'),
        msrc: $el.getAttribute('data-mini-src') || $img.getAttribute('src')
      });
      items.push(item);
      if (i == index) {
        index_ = i;
        this.options.photoswipeOpts.showHideOpacity = !item.size;
      }
    }

    // 设置图片显示序号
    (this.options.photoswipeOpts as any).index = index_;
    this.options.photoswipeOpts.galleryUID = GetGUID(12);
    this.options.photoswipeOpts.getThumbBoundsFn = (index) => {
      const thumbnail = items[index].el;
      const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
      const rect = thumbnail.getBoundingClientRect();
      return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
    };

    this.instance = await ImgViewer.createPhotoswipe(
      items,
      this.options.photoswipeOpts,
      this.options.listeners,
      this.options.photoswipeInitial
    );

    this.instance.init();
  }

  /**
   * 关闭
   */
  static dismiss() {
    if (this.instance) {
      this.instance.close();
    }
  }

  /**
   * 摧毁实例
   */
  static destroy() {
    // 移除事件
    if (this._listeners.onBodyClick) {
      RemoveEventListener(document.body, 'click', this._listeners.onBodyClick);
    }

    if (this.instance) {
      this.instance.destroy();
      this.instance = undefined;
    }
  }

  dismiss(): void {
    if (this.instance) {
      this.instance.close();
    }
  }

  destroy(): void {
    if (this._listeners.onTargetElClick) {
      RemoveEventListener(this.options.targetEl, 'click', this._listeners.onTargetElClick);
    }

    if (this.instance) {
      this.instance.destroy();
      this.instance = undefined;
    }
  }
}
