<template>
  <div class="predict-container">
    <el-card shadow="hover" class="predict-card">
      <div slot="header" class="card-header">
        <span class="title">垃圾信息检测</span>
        <span class="subtitle">输入文本内容，检测是否为垃圾/欺诈信息</span>
      </div>

      <el-form label-position="top">
        <el-form-item label="待检测文本">
          <el-input
              type="textarea"
              v-model="text"
              placeholder="请输入需要检测的文本"
              :rows="6"
              resize="none"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="submitText"
              :loading="loading"
              size="medium"
              class="submit-btn"
          >
            <i class="el-icon-search"></i> 检测文本
          </el-button>
        </el-form-item>
      </el-form>

      <template v-if="result">
        <el-card shadow="never" class="result-card">
          <div class="result-item">
            <span class="result-label">预测结果:</span>
            <span class="result-value">{{ result }}</span>
          </div>

          <div class="result-item" v-if="category">
            <span class="result-label">欺诈类型:</span>
            <span class="result-value">{{ category }}</span>
          </div>

          <div class="result-item" v-if="reason">
            <span class="result-label">判定理由:</span>
            <span class="result-value">{{ reason }}</span>
          </div>
        </el-card>
      </template>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PredictJunkInformation",
  data() {
    return {
      text: "我是国家级非遗针灸第18代传人！加我微信教你量子针灸，隔空治疗癌症不是梦",
      result: "",
      category: "",
      reason: "",
      loading: false,
    };
  },
  methods: {
    async submitText() {
      if (!this.text.trim()) {
        this.$message.error("请输入文本！");
        return;
      }

      this.loading = true;
      this.result = "";
      this.category = "";
      this.reason = "";

      try {
        const response = await axios.post("/api/predictJunkInformation/", {
          text: this.text,
        });

        const data = response.data;
        this.result = data.result || "未知";
        this.category = data.category || "未分类";
        this.reason = data.reason || "无详细理由";

      } catch (error) {
        console.error(error);
        this.$message.error("检测失败，请稍后重试！");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.predict-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.predict-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.submit-btn {
  width: 150px;
}

.result-card {
  margin-top: 20px;
  border-left: 4px solid #409EFF;
  background-color: #f0f9ff;
}

.result-item {
  display: flex;
  margin-bottom: 10px;
  line-height: 1.6;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-label {
  font-weight: bold;
  min-width: 80px;
  color: #606266;
}

.result-value {
  flex: 1;
  color: #303133;
}
</style>
