<template>
  <el-container>
    <el-header>
      <f-header />
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth" class="aside-container">
        <f-menu />
      </el-aside>
      <el-main>
        <tag-list />
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import FHeader from "./components/header.vue";
import FMenu from "./components/menu.vue";
import TagList from "./components/tagList.vue";
</script>

<style>
.aside-container {
  transition: all 0.2s;
}
</style>
