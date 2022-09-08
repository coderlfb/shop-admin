import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 设置文件别名
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  plugins: [vue(), WindiCSS()],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://ceshi13.dishait.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
