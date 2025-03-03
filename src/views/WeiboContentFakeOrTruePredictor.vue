<template>
  <div>
    <el-row>
      <h4 style="text-align: center">虚假内容预测</h4>
    </el-row>
    <el-row>
      <el-input
          type="textarea"
          v-model="newsContent"
          placeholder="请输入需要预测的新闻内容"
          rows="4"
          style="width: 100%;"
      ></el-input>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-button type="primary" @click="predictContent">提交预测</el-button>
    </el-row>
    <el-row v-if="predictionResult" style="margin-top: 10px;">
      <el-alert
          :title="predictionResult"
          type="info"
          show-icon
          v-loading="loading"
          style="height: 100px; font-size: 20px; line-height: 100px; text-align: center;">
      </el-alert>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WeiboContentFakeOrTruePredictor",
  data() {
    return {
      newsContent: "震惊！人工智能有了自主意识，在大街上狂砍数十人，令人恐慌", // 用户输入的新闻内容
      predictionResult: "", // 预测结果
      loading: true,
    };
  },
  methods: {
    async predictContent() {
      this.predictionResult = ''
      if (!this.newsContent.trim()) {
        this.$message.error("新闻内容不能为空！");
        return;
      }
      // 调用后端 API
      axios.post("/api/predictFakeOrReal/", {
        text: this.newsContent,
      }).then((response) => {
        if (response.data.prediction) {
          this.loading = true;
          this.predictionResult = `预测结果：${response.data.prediction}`;
          this.loading = false;
        } else {
          this.$message.error("预测失败，请重试！");
        }
      }).catch((error) => {
        console.error(error);
        this.$message.error("请求失败！");
      });
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
