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
    };
  },
  mounted() {
    this.fetchHotSearchData();
  },
  methods: {
    fetchHotSearchData() {
      axios.get('/api/getHotSearchData/').then(response => {
        this.hotSearchData = response.data.hot_search_data;
        this.sentimentCount = response.data.sentiment_count
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
