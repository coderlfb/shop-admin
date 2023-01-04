<template>
  <div class="menu-container" :style="{ width: $store.state.asideWidth }">
    <el-menu
      background-color="#545c64"
      class="border-0"
      :default-active="$store.state.defaultActive"
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
            <el-menu-item :index="ele.frontpath">
              <el-icon><component :is="ele.icon"></component></el-icon>
              <span>{{ ele.name }}</span></el-menu-item
            >
          </template>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
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
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const route = useRoute();
const asideMenus = computed(() => store.state.menus);
const defaultActive = computed(() => (store.state.defaultActive = route.path));
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));

// 选择某个菜单
const handleSelect = (e) => {
  console.log("点击菜单回调：", e);
  router.push(e);
};
store.commit("initMenusActive", route.path);
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

.menu-container::-webkit-scrollbar {
  width: 0px;
}
</style>
