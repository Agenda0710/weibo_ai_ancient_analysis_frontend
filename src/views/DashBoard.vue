<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="8" :lg="8">
        <el-card class="stat-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-document"></i>
            <span>总文章个数</span>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ totalArticles }}</h3>
            <p class="stat-desc">累计文章总数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8">
        <el-card class="stat-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-user-solid"></i>
            <span>最高点赞量作者</span>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ topLikedAuthor }}</h3>
            <p class="stat-desc">最受欢迎作者</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="8">
        <el-card class="stat-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-location-information"></i>
            <span>最多城市</span>
          </div>
          <div class="card-content">
            <h3 class="stat-number">{{ topCity }}</h3>
            <p class="stat-desc">文章发布最多地区</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中部图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-chat-line-square"></i>
            <span>评论点赞量 Top 4</span>
          </div>
          <el-table
              :data="topCommentsList"
              border
              style="width: 100%"
              height="340px"
              class="comment-table"
          >
            <el-table-column
                label="昵称"
                prop="authorname"
                width="180"
                align="center"
            >
              <template #default="{row}">
                <el-tag type="info">{{ row.authorname }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                label="评论内容"
                prop="content"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                label="点赞数"
                prop="like_counts"
                align="center"
                width="120"
            >
              <template #default="{row}">
                <el-tag type="success">{{ row.like_counts }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-data-line"></i>
            <span>文章发布时间分布</span>
          </div>
          <div id="articleCountChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-pie-chart"></i>
            <span>文章篇幅分布</span>
          </div>
          <div id="articleTypePieChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-cloudy"></i>
            <span>用户名词云</span>
          </div>
          <div id="word-cloud" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';
import 'echarts-wordcloud';

export default {
  name: "DashBoard",
  data() {
    return {
      totalArticles: 0,
      topLikedAuthor: '',
      topCity: '',
      aiArticleWordLengthList: [],
      topCommentsList: [],
      dates: [],
      counts: [],
      wordCloudData: []
    };
  },
  methods: {
    fetchArticleStatistics() {
      const loadingInstance = this.$loading({fullscreen: true, text: '数据加载中...'});

      axios.get('/api/articleStatistics/')
          .then(response => {
            this.totalArticles = response.data.total_articles;
            this.topLikedAuthor = response.data.top_liked_author;
            this.topCity = response.data.top_city;
            this.topCommentsList = response.data.top_comments_list;
            this.dates = response.data.dates;
            this.counts = response.data.counts;
            this.aiArticleWordLengthList = response.data.ai_article_word_length_list;
            this.wordCloudData = response.data.wordcloud_data;

            this.$nextTick(() => {
              this.renderLineChart();
              this.renderPieChart();
              this.renderWordCloud();
              loadingInstance.close();
            });
          })
          .catch(error => {
            console.error("Error fetching article statistics:", error);
            loadingInstance.close();
            this.$message.error('数据加载失败');
          });
    },

    renderLineChart() {
      const chartDom = document.getElementById('articleCountChart');
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: '文章发布时间趋势',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>文章数: {c}'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dates,
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'value',
          name: '文章数量'
        },
        series: [{
          data: this.counts,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: 'rgba(58, 77, 233, 0.8)'},
              {offset: 1, color: 'rgba(58, 77, 233, 0.1)'}
            ])
          },
          itemStyle: {
            color: '#3a4de9'
          },
          emphasis: {
            focus: 'series'
          }
        }]
      };

      myChart.setOption(option);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    },

    renderPieChart() {
      const chartDom = document.getElementById('articleTypePieChart');
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: '文章篇幅分布',
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
          data: this.aiArticleWordLengthList.map(item => item.name)
        },
        series: [{
          name: '文章篇幅',
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
          data: this.aiArticleWordLengthList
        }]
      };

      myChart.setOption(option);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    },

    renderWordCloud() {
      const chartDom = document.getElementById('word-cloud');
      const myChart = echarts.init(chartDom);

      const option = {
        title: {
          text: '用户名词云',
          left: 'center',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          formatter: function (params) {
            return `${params.name}: ${params.value}`;
          }
        },
        series: [{
          type: 'wordCloud',

          // 调整词云形状和大小
          shape: 'circle',  // 可以改为 'circle', 'cardioid', 'diamond', 'triangle-forward', 'triangle', 'pentagon', 'star'
          left: 'center',
          top: 'center',
          width: '90%',
          height: '90%',

          // 调整字体大小范围（原12-60改为20-80）
          sizeRange: [20, 80],

          // 调整旋转范围（原-90到90改为-45到45）
          rotationRange: [-45, 45],
          rotationStep: 15,

          // 调整词间距（原8改为12）
          gridSize: 12,

          // 调整绘制区域
          drawOutOfBound: false,

          // 文字样式
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            // 颜色保持不变
            color: function () {
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
          data: this.wordCloudData
        }]
      };

      myChart.setOption(option);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    }
  },
  mounted() {
    this.fetchArticleStatistics();
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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
  font-size: 18px;
}

.card-content {
  padding: 10px;
  text-align: center;
}

.stat-number {
  font-size: 28px;
  margin: 10px 0;
  color: #333;
}

.stat-desc {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 340px;
}

.comment-table {
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .stat-number {
    font-size: 24px;
  }

  .chart {
    height: 300px;
  }
}
</style>
