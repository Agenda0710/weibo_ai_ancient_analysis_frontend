<template>
  <div class="likes-analysis-container">
    <!-- 顶部点赞区间折线图 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-star-on"></i>
            <span>点赞区间评论数分布</span>
            <el-button
                type="text"
                icon="el-icon-refresh"
                @click="fetchLikesData"
                style="float: right; padding: 3px 0"
            ></el-button>
          </div>
          <div class="chart" ref="likesChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部两列图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-user"></i>
            <span>评论用户性别分布</span>
          </div>
          <div class="chart" ref="genderPieChart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-chat-line-round"></i>
            <span>评论内容词云</span>
          </div>
          <div class="chart" ref="wordCloudChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import axios from "axios";

export default {
  name: "LikesAnalysis",
  data() {
    return {
      likeData: [],
      genderData: [],
      wordData: [],
      charts: []
    }
  },
  methods: {
    fetchLikesData() {
      const loading = this.$loading({
        target: '.likes-analysis-container',
        text: '数据加载中...'
      });

      axios.get('/api/commentsAnalysis/')
          .then((response) => {
            this.likeData = response.data.data || [];
            this.genderData = response.data.gender_data || [];
            this.wordData = response.data.word_data || [];

            this.$nextTick(() => {
              this.renderLikesChart();
              this.renderGenderPieChart();
              this.renderWordCloudChart();
            });
          })
          .catch(error => {
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

    renderLikesChart() {
      const chart = this.initChart(this.$refs.likesChart);
      const likeRanges = this.likeData.map(item => item.like_range);
      const commentCounts = this.likeData.map(item => item.comment_count);

      const option = {
        title: {
          text: '点赞区间评论数分布',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>评论数: {c} 条'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: likeRanges,
          axisLabel: {
            rotate: 30,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '评论数',
          minInterval: 1
        },
        dataZoom: [{
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          bottom: '5%'
        }],
        series: [{
          name: '评论数',
          type: 'line',
          smooth: true,
          data: commentCounts,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#409EFF'
          },
          lineStyle: {
            color: '#409EFF',
            width: 3
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
            ])
          }
        }]
      };

      chart.setOption(option);
    },

    renderGenderPieChart() {
      const chart = this.initChart(this.$refs.genderPieChart);

      // 格式化性别数据，将f/m转换为中文
      const formattedGenderData = this.genderData.map(item => {
        let name = '';
        let color = '';

        if (item.name === 'f') {
          name = '女';
          color = '#F56C6C'; // 女性使用红色
        } else if (item.name === 'm') {
          name = '男';
          color = '#409EFF'; // 男性使用蓝色
        } else {
          name = item.name;
          color = '#E6A23C'; // 其他使用黄色
        }

        return {
          ...item,
          name: name,
          itemStyle: {
            color: color
          }
        };
      });

      const option = {
        title: {
          text: '评论用户性别分布',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: formattedGenderData.map(item => item.name)
        },
        series: [{
          name: '性别分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          data: formattedGenderData
        }]
      };

      chart.setOption(option);
    },

    renderWordCloudChart() {
      const chart = this.initChart(this.$refs.wordCloudChart);

      const option = {
        title: {
          text: '评论内容词云',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '90%',
          height: '90%',
          sizeRange: [20, 80],
          rotationRange: [-45, 45],
          rotationStep: 15,
          gridSize: 12,
          drawOutOfBound: false,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: () => {
              return `rgb(${[
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',')})`;
            }
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: this.wordData
        }]
      };

      chart.setOption(option);
    },

    handleResize() {
      this.charts.forEach(chart => chart.resize());
    }
  },
  mounted() {
    this.fetchLikesData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.charts.forEach(chart => chart.dispose());
  }
}
</script>

<style scoped>
.likes-analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.chart-row {
  margin-top: 20px;
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
  height: 400px;
}

@media (max-width: 768px) {
  .likes-analysis-container {
    padding: 10px;
  }

  .chart {
    height: 350px;
  }
}
</style>
