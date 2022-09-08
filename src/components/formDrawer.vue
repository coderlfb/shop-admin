<template>
  <el-drawer
    v-model="isShowDrawer"
    :title="title"
    :size="size"
    :close-on-click-modal="false"
    direction="rtl"
    :destroy-on-close="destroyOnClose"
  >
    <div class="form-drawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="btn-group">
        <el-button type="primary" @click="submit">{{
          confirmButtonText
        }}</el-button>
        <el-button type="primary" @click="handleShowDrawer">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  title: String,
  size: {
    type: String,
    default: "45%",
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmButtonText: {
    type: String,
    default: "确认",
  },
});

const isShowDrawer = ref(false);

const handleShowDrawer = () => {
  isShowDrawer.value = !isShowDrawer.value;
};

const emit = defineEmits(["submit"]);
const submit = () => emit("submit");

// 向父组件暴露方法
defineExpose({
  handleShowDrawer,
});
</script>

<style lang="scss">
.form-drawer {
  width: 100%;
  height: 100%;
  position: relative;

  @apply flex flex-col;

  .body {
    flex: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
  }

  .btn-group {
    height: 50px;
    @apply mt-auto flex items-center;
  }
}
</style>
