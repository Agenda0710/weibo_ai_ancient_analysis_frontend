<template>
  <div>
    <el-row :gutter="20">
      <el-card>
        <el-col :span="24">
          <!-- 表格展示政策，时间，文件，分类 -->
          <el-table :data="policies" border>
            <el-table-column prop="time" label="时间" width="180"/>
            <el-table-column prop="title" label="政策文件"/>
            <el-table-column prop="category" label="分类"/>
          </el-table>
        </el-col>
      </el-card>
    </el-row>

    <el-row :gutter="20">
      <el-card>
        <el-col :span="24">
          <!-- 调用 Flask 后端接口的 AI 解读 -->
          <div v-if="aiAnalysis">
            <h3>AI 解读结果：</h3>
            <p>{{ aiAnalysis }}</p>
          </div>
        </el-col>
      </el-card>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-card style="margin-right: 10px">
          <!-- 政策分类饼状图 -->
          <div id="categoryChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <!-- 政策文件词云图 -->
          <div id="wordCloudChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";

export default {
  data() {
    return {
      policies: [],
      aiAnalysis: null,
      categoryChart: null,
      wordCloudData: [], // 存储词云数据
      wordCloudInstance: null, // 存储 ECharts 实例
    };
  },
  methods: {
    fetchPolicies() {
      axios.get("/api/analyze_ai_policies/").then((response) => {
        const data = response.data;
        this.policies = data.policies;
        this.aiAnalysis = data.ai_analysis;
        this.wordCloudData = data.word_cloud_data;

        // 绘制饼状图
        this.renderCategoryChart(data.category_chart_data);

        // 绘制词云图
        this.renderWordCloudChart();
      });
    },
    renderCategoryChart(data) {
      const chartDom = document.getElementById("categoryChart");
      this.categoryChart = echarts.init(chartDom);
      const option = {
        title: {text: "政策分类分布", left: "center"},
        tooltip: {trigger: "item"},
        series: [
          {
            name: "分类",
            type: "pie",
            radius: "50%",
            data: data,
          },
        ],
      };
      this.categoryChart.setOption(option);
    },
    renderWordCloudChart() {
      const chartDom = document.getElementById("wordCloudChart");
      if (!this.wordCloudInstance) {
        this.wordCloudInstance = echarts.init(chartDom);
      }
      const option = {
        title: {
          text: "政策文件词云",
          left: "center",
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            type: "wordCloud",
            gridSize: 10,
            sizeRange: [10, 50],
            rotationRange: [-90, 90],
            shape: "circle",
            textStyle: {
              // 使用函数动态设置每个单词的颜色
              color: () => `rgb(${Math.random() * 160}, ${Math.random() * 160}, ${Math.random() * 160})`,
            },
            data: this.wordCloudData,
          },
        ],
      };
      this.wordCloudInstance.setOption(option);
    },
  },
  mounted() {
    this.fetchPolicies();
  },
};
</script>

<style scoped>
#categoryChart,
#wordCloudChart {
  width: 100%;
  height: 400px;
}
</style>
