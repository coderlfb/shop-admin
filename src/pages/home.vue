<template>
  <div>
    <el-row :gutter="20">
      <template v-for="(item, index) in baseStatisticalList" :key="index">
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="card-title">{{ item.title }}</span>
                <el-tag effect="plain" type="success" v-if="index === 0">{{
                  item.unit
                }}</el-tag>
                <el-tag effect="plain" type="danger" v-else-if="index === 1">{{
                  item.unit
                }}</el-tag>
                <el-tag effect="plain" v-else-if="index === 2">{{
                  item.unit
                }}</el-tag>
                <el-tag effect="plain" type="warning" v-else>{{
                  item.unit
                }}</el-tag>
              </div>
            </template>
            <div class="card-body">
              <span class="body-value">{{ item.value }}</span>
              <el-divider />
              <div class="footer-box">
                <span>{{ item.subTitle }}</span>
                <span>{{ item.subValue }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
    <el-row :gutter="20" class="mt-4">
      <template v-for="item in middleMenus">
        <el-col :span="3">
          <el-card shadow="hover" @click="handleClickCard(item)">
            <div class="card-box">
              <i class="el-icon mb-2 text-violet-500">
                <img :src="item.imgUrl" />
              </i>
              <span class="menu-name">{{ item.name }}</span>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import noticefy from "~/utils/noticefy.js";
import managerService from "../api/managerService";
import { useRouter } from "vue-router";
import utils from "../utils/util.js";

const router = useRouter();
const baseStatisticalList = ref([]);
const middleMenus = ref([
  {
    id: 1,
    name: "用户",
    imgUrl: reactive(utils.getAssetsImages("user.png")),
    path: "",
  },
  {
    id: 2,
    name: "商品",
    imgUrl: reactive(utils.getAssetsImages("goods.png")),
    path: "/goods/list",
  },
  {
    id: 3,
    name: "订单",
    imgUrl: reactive(utils.getAssetsImages("order.png")),
  },
  {
    id: 4,
    name: "评价",
    imgUrl: reactive(utils.getAssetsImages("evaluation.png")),
  },
  {
    id: 5,
    name: "图库",
    imgUrl: reactive(utils.getAssetsImages("image.png")),
  },
  {
    id: 6,
    name: "公告",
    imgUrl: reactive(utils.getAssetsImages("notice.png")),
  },
  {
    id: 7,
    name: "配置",
    imgUrl: reactive(utils.getAssetsImages("configuration.png")),
  },
  {
    id: 8,
    name: "优惠券",
    imgUrl: reactive(utils.getAssetsImages("coupon.png")),
  },
]);

// 点击菜单卡片跳转页面
const handleClickCard = (val) => {
  // let middleMenus = middleMenus.value;
  middleMenus.value.forEach((item) => {
    if (item.name === val.name) {
      // 跳转对应页面
      router.push(item.path);
    }
  });
};

const getStatisticalInfo = () => {
  managerService
    .getStatisticalInfo()
    .then((res) => {
      if (res && res.panels) {
        baseStatisticalList.value = res.panels;
      }
    })
    .catch((err) => {
      noticefy.noticefyMessage("error", err.message);
    });
};

onMounted(() => {
  getStatisticalInfo();
});
</script>

<style lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-title {
    font-size: 14px;
  }
}

.card-body {
  .body-value {
    font-size: 28px;
    color: #303133;
    font-weight: 700;
    opacity: 0.7;
  }

  .footer-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-size: 400;
    color: #6b7280;
  }
}

.card-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .menu-name {
    font-size: 14px;
  }
}
</style>

<style>
.el-tag {
  width: 28px;
  height: 20px;
  /* border-color: #b3e19d;
  color: #67c23a; */
}

.el-tag--plain.el-tag--success {
  border-color: #b3e19d;
  color: #67c23a;
}

.el-main {
  height: 100%;
  padding: 20px;
  background: #f3f4f6;
}
</style>
