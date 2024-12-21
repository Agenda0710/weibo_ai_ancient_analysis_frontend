<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-card>
          <div ref="likeChart" style="width: 100%; height: 400px;"></div> <!-- 点赞量区间柱状图 -->
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <div ref="commentChart" style="width: 100%; height: 400px;"></div> <!-- 评论量折线图 -->
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div ref="repostChart" style="width: 100%; height: 400px;"></div> <!-- 转发量区间横向柱状图 -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';

export default {
  name: "ArticleAnalysis",
  data() {
    return {
      form: {},
      selectedWord: '',
      likeChartData: {},   // 点赞量数据
      commentChartData: {},// 评论量数据
      repostChartData: {}  // 转发量数据
    }
  },
  methods: {
    fetchArticleTypeData() {
      axios.get('/api/articleAnalysis/', {
        params: {
          'type': this.selectedWord
        }
      }).then((response) => {
        const {like_counts} = response.data;
        const {comment_counts} = response.data;
        const {repost_counts} = response.data;
        this.commentChartData = comment_counts;
        this.repostChartData = repost_counts;
        // 确保 DOM 完全渲染后再绘制图表
        this.$nextTick(() => {
          console.log(like_counts);
          this.renderLikeChart(like_counts);
          this.renderCommentChart();
          this.renderRepostChart();
        });
      }).catch((error) => {
        console.error('Error fetching article data:', error);
      });
    },
    // 绘制点赞量区间的柱状图
    renderLikeChart(likeCounts) {
      const likeChart = echarts.getInstanceByDom(this.$refs.likeChart) || echarts.init(this.$refs.likeChart);

      // 格式化数据
      const categories = Object.keys(likeCounts);
      const data = Object.values(likeCounts);

      console.log(categories, data);

      const option = {
        title: {
          text: '点赞量区间统计'
        },
        xAxis: {
          type: 'category',
          data: categories
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: data,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      };
      // 设置图表选项
      likeChart.setOption(option);
    },
    renderCommentChart() {
      const chartDom = this.$refs.commentChart;
      const myChart = echarts.init(chartDom);

      const xAxisData = Object.keys(this.commentChartData);
      const yAxisData = Object.values(this.commentChartData);

      const option = {
        title: {
          text: '评论量统计',
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          name: '评论量',
          type: 'line',
          data: yAxisData,
          smooth: true,
        }],
      };

      myChart.setOption(option);
    },
    renderRepostChart() {
      const chartDom = this.$refs.repostChart;
      const myChart = echarts.init(chartDom);

      const intervals = Object.keys(this.repostChartData);
      const counts = Object.values(this.repostChartData);

      const option = {
        title: {
          text: '转发量统计',
        },
        tooltip: {},
        xAxis: {
          type: 'value',
          name: '数量',
        },
        yAxis: {
          type: 'category',
          data: intervals,
        },
        series: [{
          name: '转发量',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#409EFF', // Set a color for the bars
          },
        }],
      };

      myChart.setOption(option);
    },
  },
  created() {
    this.fetchArticleTypeData()
  },
  mounted() {
    // 页面加载时获取文章类型
    axios.get('/api/articleAnalysis/').then((response) => {
      this.articleTypeList = response.data.types;
    }).catch((error) => {
      console.error('Error fetching article types:', error);
    });
  }
}
</script>

<style scoped>
/* 为每个图表容器设置明确的宽高，避免图表无法展示 */
div[ref="likeChart"] {
  width: 100%;
  height: 400px;
}
</style>
