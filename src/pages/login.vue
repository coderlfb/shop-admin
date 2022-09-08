<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="left">
      <div>
        <div class="title">欢迎来到商城管理后台</div>
        <div class="text-light-50">《vue3+vite+element-plus实战开发》</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="right">
      <div class="welcome-text">欢迎回来</div>
      <div class="sub-title">
        <div class="gray-line"></div>
        <div class="text-gray-400">账号密码登录</div>
        <div class="gray-line"></div>
      </div>
      <el-form ref="ruleFormRef" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input
            class="width250"
            prefix-icon="User"
            v-model="form.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="width250"
            prefix-icon="Lock"
            show-password
            v-model="form.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        round
        class="width250"
        color="#626aef"
        :loading="isLoading"
        @click="handleLogin()"
        >登录</el-button
      >
    </el-col>
  </el-row>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, computed, onMounted, onBeforeUnmount, reactive } from "vue";
import managerService from "~/api/managerService.js";
import noticefy from "~/utils/noticefy.js";
import auth from "~/utils/auth.js";
import user from "~/utils/user.js";

const validateUsername = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("用户名不能为空"));
  } else {
    callback();
  }
};
const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("密码不能为空"));
  } else {
    callback();
  }
};

const form = reactive({
  username: "",
  password: "",
});
const isLoading = ref(false);

const rules = reactive({
  password: [{ validator: validatePassword, trigger: "blur" }],
  username: [{ validator: validateUsername, trigger: "blur" }],
});

const router = useRouter();
const ruleFormRef = ref(null);

const handleLogin = () => {
  // 验证表单内容
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      isLoading.value = true;
      const postData = {
        username: form.username,
        password: form.password,
      };
      managerService
        .login(postData)
        .then((res) => {
          if (res) {
            // 存储token
            auth.setToken(res.token);
            // 跳转到首页
            router.push("/");
            noticefy.noticefyMessage("success", "登录成功");
          }
          isLoading.value = false;
        })
        .catch((err) => {
          isLoading.value = false;
          noticefy.noticefyMessage("error", err.message);
        });
    }
  });
};
const onKeyUp = (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
};
onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
  // console.log("组件挂载==========onMounted");
});

onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>

<style lang="scss">
.login-container {
  @apply min-h-screen bg-indigo-500;

  .left,
  .right {
    @apply flex items-center justify-center;

    .title {
      @apply font-bold text-5xl text-light-50 mb-4;
    }
  }
  .right {
    @apply bg-light-50 flex-col;

    .welcome-text {
      @apply font-bold text-3xl text-black mb-4;
    }

    .sub-title {
      @apply flex items-center justify-center space-x-2 mb-6;

      .gray-line {
        @apply bg-gray-300 h-px w-60px;
      }
    }

    .width250 {
      @apply w-[250px];
    }
  }
}
</style>
