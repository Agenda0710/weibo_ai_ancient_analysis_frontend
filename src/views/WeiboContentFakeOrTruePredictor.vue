<template>
  <div class="predict-container">
    <el-card shadow="hover" class="predict-card">
      <div slot="header" class="card-header">
        <span class="title">虚假内容预测</span>
        <span class="subtitle">输入新闻内容，预测其真实性</span>
      </div>

      <el-form label-position="top">
        <el-form-item label="新闻内容">
          <el-input
              type="textarea"
              v-model="newsContent"
              placeholder="请输入需要预测的新闻内容"
              :rows="6"
              resize="none"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="predictContent"
              :loading="loading"
              size="medium"
              class="submit-btn"
          >
            <i class="el-icon-search"></i> 提交预测
          </el-button>
        </el-form-item>
      </el-form>

      <el-card
          v-if="predictionResult"
          shadow="never"
          class="result-card"
          :class="resultCardClass"
      >
        <div class="result-content">
          <i :class="resultIconClass"></i>
          <span class="result-text">{{ predictionResult }}</span>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WeiboContentFakeOrTruePredictor",
  data() {
    return {
      newsContent: "故宫专家冒死公开慈禧御用延寿丹，只需将朱砂、水银、童子尿混合蒸煮，连服7日返老还童！转发到5个群领取电子秘方",
      predictionResult: "",
      loading: false,
    };
  },
  computed: {
    resultCardClass() {
      return this.predictionResult.includes('真实') ? 'real-card' : 'fake-card';
    },
    resultIconClass() {
      return this.predictionResult.includes('真实')
          ? 'el-icon-success success-icon'
          : 'el-icon-warning warning-icon';
    }
  },
  methods: {
    async predictContent() {
      if (!this.newsContent.trim()) {
        this.$message.error("新闻内容不能为空！");
        return;
      }

      this.loading = true;
      this.predictionResult = '';

      try {
        const response = await axios.post("/api/predictFakeOrReal/", {
          text: this.newsContent,
        });

        if (response.data.prediction) {
          this.predictionResult = `预测结果：${response.data.prediction}`;
        } else {
          this.$message.error("预测失败，请重试！");
        }
      } catch (error) {
        console.error(error);
        this.$message.error("请求失败！");
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
  border-left: 4px solid;
}

.real-card {
  border-left-color: #67C23A;
  background-color: #f0f9eb;
}

.fake-card {
  border-left-color: #F56C6C;
  background-color: #fef0f0;
}

.result-content {
  display: flex;
  align-items: center;
  padding: 15px;
}

.result-text {
  font-size: 16px;
  margin-left: 10px;
}

.success-icon {
  color: #67C23A;
  font-size: 24px;
}

.warning-icon {
  color: #F56C6C;
  font-size: 24px;
}
</style>
