<template>
  <div
    class="f-tag-list"
    :style="{ left: $store.state.asideWidth, zIndex: $store.state.zIndex }"
  >
    <el-tabs
      v-model="activeTab"
      type="card"
      class="flex-1"
      @tab-remove="removeTab"
      @tab-change="changeTab"
      style="min-width: 100px"
    >
      <el-tab-pane
        v-for="item in tabList"
        :closable="item.path != '/'"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      >
      </el-tab-pane>
    </el-tabs>
    <span class="tag-btn">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="close_other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="close_all">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height: 44px"></div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate, useRouter } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";
import { useStore } from "vuex";

const cookie = useCookies();
const store = useStore();
const route = useRoute();
const router = useRouter();

const activeTab = ref(route.path);
const tabList = ref([
  {
    title: "后台首页",
    path: "/",
  },
]);

const addTab = (tab) => {
  let notTab = tabList.value.findIndex((t) => t.path == tab.path) == -1;
  if (notTab) {
    tabList.value.push(tab);
  }
  cookie.set("tabList", tabList.value);
};

// 切换tag标签
const changeTab = (path) => {
  activeTab.value = path;
  store.state.defaultActive = path;
  router.push(path);
};

// 关闭tag标签
const removeTab = (val) => {
  let newTab = activeTab.value;
  tabList.value.forEach((item, index) => {
    if (item.path === val) {
      let nextTab = tabList.value[index + 1] || tabList.value[index - 1];
      console.log(nextTab);
      if (nextTab) {
        newTab = nextTab;
      }
    }
  });
  activeTab.value = newTab.path;
  tabList.value = tabList.value.filter((tab) => tab.path != val);
  cookie.set("tabList", tabList.value);

  // 关闭tab同时关闭当前页面
  router.push(newTab.path);
  // 关闭tab时左边菜单栏同时切换到对应页面
  store.state.defaultActive = newTab.path;
};

// 处理下拉菜单指令
const handleCommand = (command) => {
  const tagList = tabList.value;
  // 关闭其他tag标签（除当前选中标签和默认显示标签）
  if (command === "close_other") {
    let newTabList = [];
    for (let i = 0; i < tagList.length; i++) {
      const ele = tagList[i];
      if (ele.path === "/" || ele.path === activeTab.value) {
        newTabList.push(ele);
      }
    }
    tabList.value = newTabList;
  } else if (command === "close_all") {
    // 关闭全部标签（除默认显示标签）
    let newTagList = tagList.filter((tag) => tag.path === "/");
    tabList.value = newTagList;
    // 默认切换到主控台
    router.push("/");
    store.state.defaultActive = "/";
    activeTab.value = "/";
  }
  cookie.set("tabList", tabList.value);
};

onBeforeRouteUpdate((to, from) => {
  activeTab.value = to.path;
  addTab({ title: to.meta.title, path: to.path });
});

// 刷新后初始化tag标签
const initTabList = () => {
  let tabs = cookie.get("tabList");
  if (tabs) {
    tabList.value = tabs;
  }
};
initTabList();
</script>

<style lang="scss">
.f-tag-list {
  @apply fixed bg-gray-100 flex items-center;
  top: 64px;
  right: 0;
  height: 44px;
}

.tag-btn {
  height: 32px;
  @apply bg-white rounded ml-auto flex items-center px-2;
}
</style>

<style scope>
.el-tabs__header {
  height: 32px !important;
  border: 0 !important;
  @apply mb-0;
}

.el-tabs__nav {
  border: 0 !important;
}

.el-tabs__item {
  height: 32px;
  line-height: 32px;
  border: 0 !important;
  @apply bg-white mx-1 rounded;
}

.el-tabs__nav-next,
.el-tabs__nav-prev {
  line-height: 36px;
}

.is-disabled {
  cursor: not-allowed;
  @apply text-gray-300;
}
</style>
