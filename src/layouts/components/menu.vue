<template>
  <div class="menu-container" :style="{ width: $store.state.asideWidth }">
    <el-menu
      background-color="#545c64"
      class="border-0"
      default-active="2"
      text-color="#fff"
      @select="handleSelect"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="true"
    >
      <template v-for="(item, index) in asideMenus" :key="index">
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="item.name"
        >
          <template #title>
            <el-icon><component :is="item.icon"></component></el-icon>
            <span>{{ item.name }}</span>
          </template>
          <template v-for="(ele, idx) in item.child" :key="idx">
            <el-menu-item :index="ele.frontPath">
              <el-icon><component :is="ele.icon"></component></el-icon>
              <span>{{ ele.name }}</span></el-menu-item
            >
          </template>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontPath">
          <el-icon><component :is="item.icon"></component></el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import managerService from "~/api/managerService";
import noticefy from "../../utils/noticefy";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const asideMenus = [
  {
    name: "后台面板",
    icon: "help",
    frontPath: "",
    child: [
      {
        name: "主控台",
        icon: "home-filled",
        frontPath: "/",
      },
    ],
  },
  {
    name: "商品管理",
    icon: "shopping-bag",
    frontPath: "",
    child: [
      {
        name: "商品管理",
        icon: "shopping-cart-full",
        frontPath: "/goods/list",
      },
    ],
  },
];
const router = useRouter();
const store = useStore();
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));

// const asideMenus = ref([]);

// 选择某个菜单
const handleSelect = (e) => {
  console.log("点击回调：", e);
  router.push(e);
};

// 获取用户菜单
// const getMenuList = () => {
//   managerService
//     .getMenuList()
//     .then((res) => {
//       asideMenus.value = res.menus;
//     })
//     .catch((err) => {
//       noticefy.noticefyMessage("error", err.message);
//     });
// };
onMounted(() => {
  // getMenuList();
});
</script>

<style lang="scss">
.menu-container {
  transition: all 0.2s;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: #545c64;
  border: none;
  @apply fixed;
}
</style>
