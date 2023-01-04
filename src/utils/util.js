import NProgress from "nprogress";
export default {
  // 显示顶部全屏loading
  showFullLoading() {
    NProgress.start();
  },
  // 隐藏顶部全屏loading
  hideFullLoading() {
    NProgress.done();
  },

  /**
   * 获取本地图
   * @param name // 文件名 如 doc.png
   * @returns {*|string}
   */
  getAssetsImages(name) {
    return new URL(`/src/assets/${name}`, import.meta.url).href;
  },
};
