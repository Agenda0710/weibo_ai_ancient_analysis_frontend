<template>
  <div>
    <el-col :span="24">
      <el-card>
        <el-table :data="hotSearchData" stripe style="width: 100%">
          <!-- 序号列 -->
          <el-table-column
              label="序号"
              width="80"
              :formatter="formatIndex">
          </el-table-column>
          <el-table-column prop="content" label="内容"/>
          <el-table-column prop="description" label="描述"/>
          <el-table-column prop="sentiment" label="情感"/>
        </el-table>
      </el-card>
    </el-col>
    <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange">
    </el-pagination>
    <div>
      <div ref="sentimentChart" style="width: 600px;height:400px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  data() {
    return {
      hotSearchData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      sentimentCount: []
    };
  },
  mounted() {
    this.fetchHotSearchData();
  },
  methods: {
    fetchHotSearchData() {
      axios.get('/api/getHotSearchData/', {
        params: {
          page: this.currentPage,
          page_size: this.pageSize
        }
      }).then(response => {
        this.hotSearchData = response.data.hot_search_data;
        this.total = response.data.total;
        this.sentimentCount = response.data.sentiment_count
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
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchHotSearchData();
    }
  }
};
</script>
