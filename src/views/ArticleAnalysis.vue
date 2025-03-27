<template>
  <div class="analysis-container">
    <!-- 图表展示区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-star-on"></i>
            <span>点赞量区间分布</span>
            <el-button
                type="text"
                icon="el-icon-refresh"
                @click="fetchData"
                style="float: right; padding: 3px 0"
            ></el-button>
          </div>
          <div ref="likeChart" class="chart"></div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-chat-line-square"></i>
            <span>评论量趋势</span>
            <el-button
                type="text"
                icon="el-icon-refresh"
                @click="fetchData"
                style="float: right; padding: 3px 0"
            ></el-button>
          </div>
          <div ref="commentChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-share"></i>
            <span>转发量区间分布</span>
            <el-button
                type="text"
                icon="el-icon-refresh"
                @click="fetchData"
                style="float: right; padding: 3px 0"
            ></el-button>
          </div>
          <div ref="repostChart" class="chart-wide"></div>
        </el-card>
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
      likeChartData: {},
      commentChartData: {},
      repostChartData: {},
      charts: []
    }
  },
  methods: {
    fetchData() {
      const loading = this.$loading({
        target: '.analysis-container',
        text: '数据加载中...'
      });

      axios.get('/api/articleAnalysis/')
          .then((response) => {
            const { like_counts, comment_counts, repost_counts } = response.data;
            this.likeChartData = like_counts || {};
            this.commentChartData = comment_counts || {};
            this.repostChartData = repost_counts || {};

            this.$nextTick(() => {
              this.renderLikeChart();
              this.renderCommentChart();
              this.renderRepostChart();
            });
          })
          .catch((error) => {
            this.$message.error('数据加载失败: ' + error.message);
          })
          .finally(() => {
            loading.close();
          });
    },

    initChart(dom) {
      const chart = echarts.getInstanceByDom(dom) || echarts.init(dom);
      this.charts.push(chart);
      return chart;
    },

    renderLikeChart() {
      const chart = this.initChart(this.$refs.likeChart);
      const categories = Object.keys(this.likeChartData);
      const data = Object.values(this.likeChartData);

      const option = {
        title: {
          text: '点赞量区间统计',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>文章数量: {c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '文章数量'
        },
        series: [{
          name: '点赞量',
          type: 'bar',
          data: data,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: '#83bff6'},
              {offset: 0.5, color: '#188df0'},
              {offset: 1, color: '#0077e6'}
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#2378f7'},
                {offset: 0.7, color: '#2378f7'},
                {offset: 1, color: '#83bff6'}
              ])
            }
          }
        }]
      };

      chart.setOption(option);
    },

    renderCommentChart() {
      const chart = this.initChart(this.$refs.commentChart);
      const xAxisData = Object.keys(this.commentChartData);
      const yAxisData = Object.values(this.commentChartData);

      const option = {
        title: {
          text: '评论量趋势',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>评论量: {c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '评论量'
        },
        series: [{
          name: '评论量',
          type: 'line',
          data: yAxisData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#67C23A'
          },
          lineStyle: {
            color: '#67C23A',
            width: 3
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: 'rgba(103, 194, 58, 0.3)'},
              {offset: 1, color: 'rgba(103, 194, 58, 0.1)'}
            ])
          }
        }]
      };

      chart.setOption(option);
    },

    renderRepostChart() {
      const chart = this.initChart(this.$refs.repostChart);
      const intervals = Object.keys(this.repostChartData);
      const counts = Object.values(this.repostChartData);

      const option = {
        title: {
          text: '转发量区间分布',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}<br/>文章数量: {c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '文章数量'
        },
        yAxis: {
          type: 'category',
          data: intervals,
          axisLabel: {
            interval: 0
          }
        },
        series: [{
          name: '转发量',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {offset: 0, color: '#f56c6c'},
              {offset: 1, color: '#e6a23c'}
            ])
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          }
        }]
      };

      chart.setOption(option);
    },

    handleResize() {
      this.charts.forEach(chart => chart.resize());
    }
  },
  mounted() {
    this.fetchData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.charts.forEach(chart => chart.dispose());
  }
}
</script>

<style scoped>
.analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.card-header i {
  margin-right: 8px;
  color: #409EFF;
}

.chart {
  width: 100%;
  height: 350px;
}

.chart-wide {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .analysis-container {
    padding: 10px;
  }

  .chart {
    height: 300px;
  }

  .chart-wide {
    height: 350px;
  }
}
</style>
