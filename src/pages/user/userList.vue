<template>
  <div class="page-box">
    <el-card shadow="never">
      <div class="search-header">
        <el-form :model="form" label-width="120px">
          <el-form-item label="关键词：">
            <el-input
              class="width405"
              placeholder="手机号/邮箱/会员昵称"
              v-model="form.keywords"
            />
          </el-form-item>
          <el-form-item label="会员等级：">
            <el-select v-model="form.memberGrade" placeholder="请选择会员等级">
              <template v-for="item in memberGradeList">
                <el-option :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">搜索</el-button>
            <el-button @click="onResetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never" class="mt-4">
      <el-button type="primary" @click="handleEdit">新增</el-button>
      <el-table
        v-loading="isShowLoading"
        :data="tableData"
        stripe
        style="width: 100%"
        class="mt-4"
        empty-text="暂无数据"
      >
        <el-table-column prop="username" label="会员">
          <template #default="scope">
            <div class="user-info-box">
              <el-avatar :src="scope.row.avatar"></el-avatar>
              <div class="ml-2">
                <p>{{ scope.row.username }}</p>
                <p>ID：{{ scope.row.id }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user_level" label="会员等级">
          <template #default="scope">
            <span>{{ scope.row.gradeName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="create_time" label="注册时间" />
        <el-table-column align="center" prop="status" label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleChangeUserStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              width="300"
              title="是否要删除该用户？"
              confirm-button-text="是"
              cancel-button-text="否"
              @confirm="handleDelete(scope.row)"
            >
              <template #reference>
                <el-button type="primary" text>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bar-box">
        <page-bar
          ref="pageRef"
          :totalCount="totalCount"
          @handleCurrentPageChange="handleCurrentPageChange"
        ></page-bar>
      </div>
    </el-card>
    <form-drawer
      ref="formDrawerRef"
      :title="drawerTitle"
      destoryClose
      @submit="handleSubmitForm"
    >
      <div>
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="用户名" required prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item required label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="addForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              action="#"
              list-type="picture-card"
              limit="1"
              :auto-upload="false"
            >
              <el-icon><Plus /></el-icon
              ><template #file="{ file }">
                <div>
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <el-icon><Delete /></el-icon>
                    </span>
                  </span>
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item required label="会员等级" prop="grade">
            <el-select v-model="addForm.grade" placeholder="请选择会员等级">
              <template v-for="item in memberGradeList">
                <el-option :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="addForm.status" />
          </el-form-item>
        </el-form></div
    ></form-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import memberGradeService from "~/api/memberGradeService.js";
import userService from "~/api/userService.js";
import noticefy from "~/utils/noticefy.js";
import PageBar from "~/components/pageCom.vue";
import formDrawer from "~/components/formDrawer.vue";

const form = reactive({
  keywords: "",
  memberGrade: "",
});
// 会员等级列表
const memberGradeList = ref([]);
const tableData = ref([]);
// 是否显示加载loading
const isShowLoading = ref(false);
// 总条数
const totalCount = ref(10);
// 当前页
const page = ref(1);

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

const validateGrade = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请选择会员等级"));
  } else {
    callback();
  }
};
const drawerTitle = ref("");
const formDrawerRef = ref(null);
const addForm = reactive({
  username: "",
  password: "",
  nickName: "",
  avatar: "",
  grade: "",
  mobile: "",
  email: "",
  status: true,
});
const addFormRef = ref(null);

const rules = reactive({
  username: [{ validator: validateUsername, trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  grade: [{ validator: validateGrade, trigger: "blur" }],
});

// 新增（编辑）用户
const handleEdit = (val) => {
  if (val.id) {
    drawerTitle.value = "修改";
    addForm.username = val.username;
    addForm.nickName = val.nickname;
    addForm.avatar = val.avatar;
    addForm.grade = val.user_level.id;
    addForm.mobile = val.phone;
    addForm.email = val.email;
    addForm.status = val.status === 1 ? true : false;
  } else {
    drawerTitle.value = "新增";
    addForm.username = "";
    addForm.nickName = "";
    addForm.avatar = "";
    addForm.grade = "";
    addForm.mobile = "";
    addForm.email = "";
    addForm.status = true;
  }
  formDrawerRef.value.handleShowDrawer();
};

// 删除用户
const handleDelete = (val) => {
  userService
    .deleteUser(val.id)
    .then((res) => {
      getUserList();
      noticefy.noticefyMessage("success", "删除成功!");
    })
    .catch((err) => {
      noticefy.noticefyMessage("error", err.message);
    });
};

const handleSubmitForm = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      const postData = {
        username: addForm.username,
        password: addForm.password,
        status: addForm.status ? 1 : 0,
        nickname: addForm.nickName,
        phone: addForm.mobile,
        email: addForm.email,
        user_level_id: addForm.grade,
      };
      userService
        .addUser(postData)
        .then((res) => {
          // 关闭弹窗
          formDrawerRef.value.handleShowDrawer();
          // 重新加载列表(第一页)
          page.value = 1;
          getUserList();
          noticefy.noticefyMessage("success", "添加成功！");
        })
        .catch((err) => {
          noticefy.noticefyMessage("error", err.message);
        });
    }
  });
};

// 点击切换页码
const handleCurrentPageChange = (val) => {
  page.value = val;
  getUserList();
};

// 点击搜索按钮
const onSearch = () => {
  getUserList();
};

// 点击重置按钮
const onResetSearch = () => {
  form.keywords = "";
  form.memberGrade = "";
  getUserList();
};

// 修改用户状态
const handleChangeUserStatus = (val) => {
  console.log("修改用户状态==", val);
  let userStatus = null;
  if (val.status) {
    userStatus = 1;
  } else {
    userStatus = 0;
  }
  userService
    .changeStatus(val.id, userStatus)
    .then((res) => {
      noticefy.noticefyMessage("success", "修改状态成功");
    })
    .catch((err) => {
      noticefy.noticefyMessage("error", err.message);
    });
};

// 获取用户列表
const getUserList = () => {
  isShowLoading.value = true;
  memberGradeService
    .getUserList(page.value, form.keywords, form.memberGrade)
    .then((res) => {
      if (res && res.list && res.list.length > 0) {
        res.list.forEach((item) => {
          if (item.user_level) {
            item.gradeName = item.user_level.name;
          }
          if (item.status == 1) {
            item.status = true;
          } else {
            item.status = false;
          }
        });
        tableData.value = res.list;
      } else {
        tableData.value = [];
      }
      totalCount.value = res.totalCount;
      isShowLoading.value = false;
    })
    .catch((err) => {
      isShowLoading.value = false;
      noticefy.noticefyMessage("error", err.message);
    });
};

// 获取会员等级列表
const getMemberGradeList = () => {
  memberGradeService.getGradeList().then((res) => {
    if (res && res.list && res.list.length > 0) {
      memberGradeList.value = res.list;
    }
  });
};

onMounted(() => {
  getMemberGradeList();
  getUserList();
});
</script>

<style lang="scss">
.width405 {
  width: 405px;
}

.page-bar-box {
  width: 100%;
  height: 50px;
  @apply mt-6 flex items-center justify-center;
}

.user-info-box {
  display: flex;
  align-items: center;
}
</style>

<style>
.el-upload--picture-card {
  width: 100px;
  height: 100px;
}

.el-upload-list__item.is-ready {
  width: 100px;
  height: 100px;
}
</style>
