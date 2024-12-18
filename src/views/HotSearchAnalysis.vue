<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-table :data="hotSearchData" stripe style="width: 100%" v-loading="loading">
            <!-- 序号列 -->
            <el-table-column
                label="序号"
                width="120">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容"/>
            <el-table-column prop="description" label="描述"/>
            <el-table-column prop="sentiment" label="情感"/>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card v-loading="loading">
          <h3>AI模型解读</h3>
          <div style="font-size: 14px; line-height: 1.8; color: #333;">
            <ul>
              <li v-for="(item) in parsedAiInterpretations" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="6"></el-col>
      <el-col :span="12">
        <el-card>
          <div ref="sentimentChart" style="width:100%;height:400px;margin: 0 auto"></div>
        </el-card>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';


export default {
  data() {
    return {
      hotSearchData: [],
      sentimentCount: [],
      loading: true,
      aiInterpretations: '', // AI 模型返回的原始解读内容
      parsedAiInterpretations: [], // 分段处理后的解读内容
    };
  },
  mounted() {
    this.fetchHotSearchData();
  },
  methods: {
    parseInterpretations(rawText) {
      // 按段落分割原始内容，保留数字开头的段落
      return rawText.split(/\d+\./).filter(Boolean).map((text, index) => `${index + 1}. ${text.trim()}`);
    },
    fetchHotSearchData() {
      axios.get('/api/getHotSearchData/').then(response => {
        this.hotSearchData = response.data.hot_search_data;
        this.sentimentCount = response.data.sentiment_count;
        this.aiInterpretations = response.data.ai_interpretation;
        this.parsedAiInterpretations = this.parseInterpretations(this.aiInterpretations);
        this.loading = false
        this.initSentimentChart();
      }).catch(error => {
        console.error("Error fetching data:", error);
      });
    },
    initSentimentChart() {
      const chartDom = this.$refs.sentimentChart;
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: '热搜情感分布'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: ['正面', '中性', '负面']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [this.sentimentCount['正面'], this.sentimentCount['中性'], this.sentimentCount['负面']],
          type: 'bar',
          itemStyle: {
            color: function (params) {
              const colorList = ['#4CAF50', '#FFC107', '#F44336'];
              return colorList[params.dataIndex];
            }
          }
        }]
      };
      myChart.setOption(option);
    },
  }
};
</script>
<style>
.el-col {
  min-height: 1px
}
</style>
