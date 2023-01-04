<template>
  <el-drawer
    v-model="isShowDrawer"
    :title="title"
    :size="size"
    :close-on-click-modal="false"
    direction="rtl"
    :destroy-on-close="destroyOnClose"
    @close="handleCloseDrawer"
  >
    <div class="form-drawer">
      <div class="body">
        <slot></slot>
      </div>
      <div class="btn-group">
        <el-button type="primary" @click="submit">{{
          confirmButtonText
        }}</el-button>
        <el-button type="info" @click="handleShowDrawer">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

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

const store = useStore();
const isShowDrawer = ref(false);

const handleShowDrawer = () => {
  isShowDrawer.value = !isShowDrawer.value;
  if (isShowDrawer.value) {
    store.commit("changeZIndex", 1);
  } else {
    store.commit("changeZIndex", 10);
  }
};

const handleCloseDrawer = () => {
  store.commit("changeZIndex", 10);
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
