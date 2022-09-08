<template>
  <div>
    <el-result
      icon="warning"
      title="404提示"
      sub-title="你找到页面走丢了~"
    >
      <template #extra>
        <el-button
          type="primary"
          @click="goHome"
        >返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const { push } = useRouter();
const goHome = () => {
  push("/");
};
</script>

<style>
</style>