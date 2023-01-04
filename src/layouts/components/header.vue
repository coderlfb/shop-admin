<template>
  <div class="header-container">
    <span class="logo">
      <el-icon class="mr-2"><ElemeFilled /></el-icon>
      后台商城
    </span>
    <el-icon class="icon-btn" @click="handleOpenAndPackup">
      <Fold v-if="$store.state.asideWidth == '250px'" />
      <Expand v-else />
    </el-icon>
    <el-tooltip
      class="box-item"
      effect="dark"
      content="刷新"
      placement="bottom"
    >
      <el-icon class="icon-btn" @click="handleRefresh"><Refresh /></el-icon>
    </el-tooltip>

    <div class="right-user-container">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="全屏"
        placement="bottom"
      >
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown class="drop-down" @command="handleCommand">
        <span class="dropdown-link">
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="changePassword"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <form-drawer
      ref="formDrawerRef"
      title="修改密码"
      destroyOnClose
      @submit="changePassword"
    >
      <div>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          size="small"
        >
          <el-form-item label="旧密码：" required prop="oldPassword">
            <el-input
              type="password"
              show-password
              v-model="form.oldPassword"
              placeholder="请输入旧密码"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码："
            type="password"
            show-password
            required
            prop="newPassword"
          >
            <el-input
              v-model="form.newPassword"
              type="password"
              show-password
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" required prop="rePassword">
            <el-input
              v-model="form.rePassword"
              type="password"
              show-password
              placeholder="请确认密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </form-drawer>
  </div>
</template>
<script setup>
import noticefy from "~/utils/noticefy.js";
import managerService from "~/api/managerService";
import { useRouter } from "vue-router";
import auth from "~/utils/auth";
import store from "~/store";
import { useFullscreen } from "@vueuse/core";
import { ref, reactive } from "vue";
import formDrawer from "~/components/formDrawer.vue";

const validateNewPassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("旧密码不能为空"));
  } else {
    callback();
  }
};
const validateOldPassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("新密码不能为空"));
  } else {
    callback();
  }
};

const validateRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("确认密码不能为空"));
  } else {
    callback();
  }
};

const { isFullscreen, toggle } = useFullscreen();
const form = reactive({
  oldPassword: "",
  newPassword: "",
  rePassword: "",
});

const rules = reactive({
  oldPassword: [{ validator: validateOldPassword, trigger: "blur" }],
  newPassword: [{ validator: validateNewPassword, trigger: "blur" }],
  rePassword: [{ validator: validateRePassword, trigger: "blur" }],
});

const router = useRouter();
const formRef = ref(null);
const formDrawerRef = ref(null);

const handleRefresh = () => {
  location.reload();
};

// 展开/收起侧边栏
const handleOpenAndPackup = () => {
  store.commit("handleSetAsideWidth");
};

const handleCommand = (command) => {
  if (command === "logout") {
    logout();
  } else if (command === "changePassword") {
    formDrawerRef.value.handleShowDrawer();
  }
};

// 修改密码
const changePassword = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const postData = {
        oldpassword: form.oldPassword,
        password: form.newPassword,
        repassword: form.rePassword,
      };
      managerService
        .changePassword(postData)
        .then((res) => {
          noticefy.noticefyMessage("success", "修改密码成功，请重新登录");
          // 清除token
          auth.removeToken();
          // 清除当前用户状态（vuex中的用户信息）
          store.commit("SET_USERINFO", {});
          // 返回登录页
          router.push("/login");
          // 关闭当前抽屉
          formDrawerRef.value.handleShowDrawer();
        })
        .catch((err) => {
          noticefy.noticefyMessage("error", err.message);
        });
    }
  });
};

// 退出登录
const logout = () => {
  noticefy.showModal("warning", "是否要退出登录", "提示").then(() => {
    // 点击“确认”按钮
    managerService
      .logout()
      .then((res) => {
        // 清除token
        auth.removeToken();
        // 清除当前用户状态（vuex中的用户信息）
        store.commit("SET_USERINFO", {});
        // 返回登录页
        router.push("/login");
        noticefy.noticefyMessage("success", "退出登录成功");
      })
      .catch((err) => {
        noticefy.noticefyMessage("error", err.message);
      });
  });
};
</script>
<style lang="scss">
.header-container {
  @apply flex bg-indigo-700 items-center text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 10;

  .logo {
    @apply flex justify-center items-center text-xl font-thin;
    width: 250px;
  }

  .icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
  }

  .icon-btn:hover {
    @apply bg-indigo-600;
  }

  .right-user-container {
    @apply ml-auto flex items-center;

    .drop-down {
      height: 64px;
      cursor: pointer;
      @apply flex justify-center items-center mx-5;

      .dropdown-link {
        @apply flex justify-center items-center text-light-50;
      }
    }
  }
}
</style>
