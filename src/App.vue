<script setup></script>

<template>
  <router-view></router-view>
</template>

<style>
.btn {
  @apply bg-purple-300 text-white px-8 py-2 transition-all duration-500 my-2 hover:(bg-purple-600) focus:(ring-8 ring-blue-200);
}

#nprogress .bar {
  background: #f4f4f4 !important;
  height: 3px !important;
}
</style>
