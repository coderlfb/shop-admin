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
};
