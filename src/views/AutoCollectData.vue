<template>
  <div>
    <el-row>
      <h4 style="text-align: center">爬虫自动化</h4>
    </el-row>

    <!-- 下拉框：选择爬取类型数量 -->
    <el-row style="margin-top: 20px;">
      <el-select v-model="typeNum" placeholder="请选择爬取类型数量" style="width: 100%;">
        <el-option v-for="num in typeOptions" :key="num" :label="`类型 ${num}`" :value="num">
        </el-option>
      </el-select>
    </el-row>

    <!-- 下拉框：选择爬取页面数量 -->
    <el-row style="margin-top: 20px;">
      <el-select v-model="pageNum" placeholder="请选择爬取页面数量" style="width: 100%;">
        <el-option v-for="num in pageOptions" :key="num" :label="`页面 ${num}`" :value="num">
        </el-option>
      </el-select>
    </el-row>

    <!-- 提交按钮 -->
    <el-row style="margin-top: 20px;">
      <el-button type="primary" @click="submitData">提交</el-button>
    </el-row>

    <!-- 结果提示 -->
    <el-row v-if="responseMessage" style="margin-top: 20px;">
      <el-card  v-loading="loading">
        <el-alert :title="responseMessage" type="info" show-icon ></el-alert>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AutoCollectData",
  data() {
    return {
      typeNum: null, // 爬取类型数量
      pageNum: null, // 爬取页面数量
      responseMessage: "", // 后端返回的消息
      typeOptions: [1, 2, 3, 4, 5], // 类型数量选项
      pageOptions: [1, 2, 3, 4, 5], // 页面数量选项
      loading: true,
    };
  },
  methods: {
    async submitData() {
      // 检查两个下拉框是否有值
      if (!this.typeNum || !this.pageNum) {
        this.$message.error("请先选择爬取类型数量和页面数量！");
        return;
      }

      // 调用后端接口
      try {
        this.loading = true
        const response = await axios.post("/api/autoCollectData/", {
          type_num: this.typeNum,
          page_num: this.pageNum,
        });
        if (response.data.success) {
          this.loading = false
          this.responseMessage = "数据采集和词频分析成功！";
        }
      } catch (error) {
        this.loading = false
        this.responseMessage = "请求失败，请检查后端服务！";
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
h4 {
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
