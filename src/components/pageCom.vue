<template>
  <el-pagination
    background
    :page-size="pageSize"
    layout="prev, pager, next"
    :total="totalCount"
    @current-change="handleCurrentPageChange"
    @prev-click="handlePrevClick"
    @next-click="handleNextClick"
  />
</template>

<script setup>
import { ref } from "vue";

defineProps({
  pageSize: {
    type: Number,
    default: 10,
  },
  totalCount: Number,
});

const emit = defineEmits(["submit"]);
const handleCurrentPageChange = (value) => {
  emit("handleCurrentPageChange", value);
};

const handlePrevClick = (value) => {
  emit("handleCurrentPageChange", value);
};

const handleNextClick = (value) => {
  emit("handleCurrentPageChange", value);
};
</script>
