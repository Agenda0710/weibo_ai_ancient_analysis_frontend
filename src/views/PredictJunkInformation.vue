<template>
  <div>
    <el-form @submit.prevent="submitText">
      <el-form-item>
        <el-input
            v-model="text"
            placeholder="请输入需要检测的文本"
            type="textarea"
            rows="5"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submitText">
          检测文本
        </el-button>
      </el-form-item>
    </el-form>
    <el-card v-if="result" class="result-card">
      <p><strong>预测结果:</strong> {{ result }}</p>
      <p v-if="category"><strong>欺诈类型:</strong> {{ category }}</p>
      <p v-if="reason"><strong>判定理由:</strong> {{ reason }}</p>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PredictJunkInformation",
  data() {
    return {
      text: "", // 用户输入的文本
      result: "", // 检测结果
      category: "", // 欺诈类别
      reason: "", // 判定理由
      loading: false, // 加载状态
    };
  },
  methods: {
    async submitText() {
      if (!this.text) {
        this.$message.error("请输入文本！");
        return;
      }
      this.loading = true;
      this.result = "";
      this.category = "";
      this.reason = "";

      try {
        axios.post("/api/predictJunkInformation/", {
          text: this.text,
        }).then(response => {
          const data = response.data;
          this.result = data.result;
          if (data.category) {
            this.category = data.category;
          }
          if (data.reason) {
            this.reason = data.reason;
          }
        })
      } catch (error) {
        this.$message.error("检测失败，请稍后重试！");
      } finally {
        this.loading = false;
      }
    },
  },
}
</script>

<style scoped>

</style>
