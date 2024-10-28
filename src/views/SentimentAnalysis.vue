<template>
  <div>
    <el-row>
      <el-col :span="11" style="margin-right: 2px">
        <el-card>
          <div style="width:100%;height:400px;" ref="keywordsSentimentChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div style="width:100%;height:400px;" ref="treeMapChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="11" style="margin-right: 2px">
        <el-card>
          <h5>文章内容与评论内容舆情趋势饼状图</h5>
          <div style="width:100%;height:400px;" ref="nestedPieChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <h5>热词TOP10</h5>
          <div style="width:100%;height:400px;" ref="keywordsBarChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts'
import {Loading} from "element-ui";

export default {
  name: "SentimentAnalysis",
  data() {
    return {
      keywordsSentimentData: '',
      articleSentimentData: null,
      commentSentimentData: null,
      topKeywordsData: [],
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      let loadingInstance = Loading.service({fullscreen: true});
      axios.get('/api/sentimentAnalysis/').then(response => {
        this.keywordsSentimentData = response.data.keywords_sentiment;
        this.articleSentimentData = response.data.article_sentiment;
        this.commentSentimentData = response.data.comment_sentiment;
        this.topKeywordsData = response.data.top_keywords;
        this.initKeywordsSentimentChart();
        this.initTreeMapChart();
        this.initNestedPieChart();
        this.initKeywordsBarChart();
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    },
    initKeywordsSentimentChart() {
      const chartDom = this.$refs.keywordsSentimentChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '关键词情感分析',
          left: 'center'
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
        series: [
          {
            data: [
              this.keywordsSentimentData.positive,
              this.keywordsSentimentData.neutral,
              this.keywordsSentimentData.negative,
            ],  // 使用获取到的数据
            type: 'bar',
            itemStyle: {
              color: (params) => {
                if (params.dataIndex === 0) return '#4caf50'; // 正面绿色
                if (params.dataIndex === 1) return '#ffa726'; // 中性橙色
                return '#f44336'; // 负面红色
              }
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    initTreeMapChart() {
      const chartDom = this.$refs.treeMapChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '热词情感趋势树形图',
          left: 'center'
        },
        series: [
          {
            type: 'treemap',
            data: [
              {
                name: '正面',
                value: this.keywordsSentimentData.positive,
              },
              {
                name: '中性',
                value: this.keywordsSentimentData.neutral,
              },
              {
                name: '负面',
                value: this.keywordsSentimentData.negative,
              }
            ]
          }
        ]
      };
      myChart.setOption(option);
    },
    initNestedPieChart() {
      const chartDom = this.$refs.nestedPieChart;
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          data: ['正面', '中性', '负面']
        },
        series: [
          {
            name: '文章情感',
            type: 'pie',
            radius: [0, '30%'],
            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              {value: this.articleSentimentData.positive, name: '正面'},
              {value: this.articleSentimentData.neutral, name: '中性'},
              {value: this.articleSentimentData.negative, name: '负面'}
            ]
          },
          {
            name: '评论情感',
            type: 'pie',
            radius: ['45%', '60%'],
            data: [
              {value: this.commentSentimentData.positive, name: '正面'},
              {value: this.commentSentimentData.neutral, name: '中性'},
              {value: this.commentSentimentData.negative, name: '负面'}
            ]
          }
        ]
      };
      myChart.setOption(option);
    },
    initKeywordsBarChart() {
      const chartDom = this.$refs.keywordsBarChart;
      const myChart = echarts.init(chartDom);
      const keywords = this.topKeywordsData.map(item => item[0]);
      const frequency = this.topKeywordsData.map(item => item[1]);

      const option = {
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: keywords  // 填入关键词
        },
        series: [
          {
            data: frequency, // 填入关键词频率
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight'
            }
          }
        ]
      };
      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>

</style>
