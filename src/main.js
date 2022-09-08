import { createApp } from "vue";
// import './style.css'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "virtual:windi.css";
import router from "./router/index.js";
import App from "./App.vue";
import store from "./store";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./permission";
import "nprogress/nprogress.css";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount("#app");
