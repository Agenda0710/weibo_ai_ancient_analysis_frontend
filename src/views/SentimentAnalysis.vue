<template>
  <div v-loading="loading" element-loading-text="数据加载中..." element-loading-background="rgba(255, 255, 255, 0.7)">
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :xs="24" :sm="12" :lg="11">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <span class="card-title">关键词情感分析</span>
            <el-tooltip content="刷新图表" placement="top">
              <el-button icon="el-icon-refresh" circle size="mini" @click="refreshChart('keywordsSentimentChart')"></el-button>
            </el-tooltip>
          </div>
          <div class="chart-container" ref="keywordsSentimentChart"></div>
          <div class="chart-footer">
            <el-tag type="success">正面: {{ keywordsSentimentData.positive || 0 }}</el-tag>
            <el-tag type="warning" style="margin: 0 10px;">中性: {{ keywordsSentimentData.neutral || 0 }}</el-tag>
            <el-tag type="danger">负面: {{ keywordsSentimentData.negative || 0 }}</el-tag>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="12" style="margin-left: 10px;">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <span class="card-title">热词情感分布</span>
            <el-tooltip content="刷新图表" placement="top">
              <el-button icon="el-icon-refresh" circle size="mini" @click="refreshChart('treeMapChart')"></el-button>
            </el-tooltip>
          </div>
          <div class="chart-container" ref="treeMapChart"></div>
          <div class="chart-footer">
            <el-progress :percentage="calculatePercentage('positive')" :color="customColors" :show-text="false"></el-progress>
            <div class="progress-labels">
              <span>正面 {{ calculatePercentage('positive') }}%</span>
              <span>中性 {{ calculatePercentage('neutral') }}%</span>
              <span>负面 {{ calculatePercentage('negative') }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="11">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <span class="card-title">文章与评论情感对比</span>
            <el-tooltip content="刷新图表" placement="top">
              <el-button icon="el-icon-refresh" circle size="mini" @click="refreshChart('nestedPieChart')"></el-button>
            </el-tooltip>
          </div>
          <div class="chart-container" ref="nestedPieChart"></div>
          <div class="chart-footer">
            <el-radio-group v-model="pieType" size="mini" @change="updatePieChart">
              <el-radio-button label="article">文章情感</el-radio-button>
              <el-radio-button label="comment">评论情感</el-radio-button>
            </el-radio-group>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="12" style="margin-left: 10px;">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <span class="card-title">热词TOP10</span>
            <div>
              <el-tooltip content="刷新图表" placement="top">
                <el-button icon="el-icon-refresh" circle size="mini" @click="refreshChart('keywordsBarChart')"></el-button>
              </el-tooltip>
              <el-tooltip content="切换排序" placement="top">
                <el-button icon="el-icon-sort" circle size="mini" @click="toggleSort"></el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="chart-container" ref="keywordsBarChart"></div>
          <div class="chart-footer">
            <el-tag>总热词数: {{ topKeywordsData.length }}</el-tag>
            <el-tag type="info" style="margin-left: 10px;">最高频次: {{ getMaxFrequency() }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';

export default {
  name: "SentimentAnalysis",
  data() {
    return {
      keywordsSentimentData: { positive: 0, neutral: 0, negative: 0 },
      articleSentimentData: { positive: 0, neutral: 0, negative: 0 },
      commentSentimentData: { positive: 0, neutral: 0, negative: 0 },
      topKeywordsData: [],
      loading: true,
      pieType: 'article',
      sortDesc: true,
      charts: {},
      customColors: [
        { color: '#4CAF50', percentage: 20 },
        { color: '#FFC107', percentage: 50 },
        { color: '#F44336', percentage: 80 }
      ]
    }
  },
  mounted() {
    this.fetchData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    Object.values(this.charts).forEach(chart => chart && chart.dispose());
  },
  methods: {
    fetchData() {
      this.loading = true;
      axios.get('/api/sentimentAnalysis/')
          .then(response => {
            this.keywordsSentimentData = response.data.keywords_sentiment || { positive: 0, neutral: 0, negative: 0 };
            this.articleSentimentData = response.data.article_sentiment || { positive: 0, neutral: 0, negative: 0 };
            this.commentSentimentData = response.data.comment_sentiment || { positive: 0, neutral: 0, negative: 0 };
            this.topKeywordsData = response.data.top_keywords || [];

            this.initKeywordsSentimentChart();
            this.initTreeMapChart();
            this.initNestedPieChart();
            this.initKeywordsBarChart();
          })
          .catch(error => {
            this.$message.error('数据加载失败: ' + error.message);
            console.error('Error fetching data:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },
    initKeywordsSentimentChart() {
      const chartDom = this.$refs.keywordsSentimentChart;
      this.charts.keywordsSentimentChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: params => {
            const data = params[0];
            return `
              <div style="font-weight:bold;margin-bottom:5px">${data.name}</div>
              <div>数量: ${data.value}</div>
              <div>占比: ${this.calculatePercentage(data.name.toLowerCase())}%</div>
            `;
          }
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['正面', '中性', '负面'],
          axisLabel: {
            color: '#666',
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#666',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [{
          data: [
            this.keywordsSentimentData.positive,
            this.keywordsSentimentData.neutral,
            this.keywordsSentimentData.negative,
          ],
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: params => {
              if (params.dataIndex === 0) return '#4CAF50';
              if (params.dataIndex === 1) return '#FFC107';
              return '#F44336';
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#333'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };

      this.charts.keywordsSentimentChart.setOption(option);
    },
    initTreeMapChart() {
      const chartDom = this.$refs.treeMapChart;
      this.charts.treeMapChart = echarts.init(chartDom);

      const total = this.getSentimentTotal();
      const option = {
        tooltip: {
          formatter: info => {
            const value = info.value;
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `
              <div style="font-weight:bold">${info.name}</div>
              <div>数量: ${value}</div>
              <div>占比: ${percent}%</div>
            `;
          }
        },
        series: [{
          name: '情感分布',
          type: 'treemap',
          visibleMin: 1,
          data: [
            {
              name: '正面',
              value: this.keywordsSentimentData.positive,
              itemStyle: { color: '#4CAF50' }
            },
            {
              name: '中性',
              value: this.keywordsSentimentData.neutral,
              itemStyle: { color: '#FFC107' }
            },
            {
              name: '负面',
              value: this.keywordsSentimentData.negative,
              itemStyle: { color: '#F44336' }
            }
          ],
          breadcrumb: { show: false },
          label: {
            show: true,
            formatter: params => `${params.name}\n${params.value}`
          },
          levels: [
            { itemStyle: { borderColor: '#fff', borderWidth: 1 } }
          ]
        }]
      };

      this.charts.treeMapChart.setOption(option);
    },
    initNestedPieChart() {
      const chartDom = this.$refs.nestedPieChart;
      this.charts.nestedPieChart = echarts.init(chartDom);
      this.updatePieChart();
    },
    updatePieChart() {
      const data = this.pieType === 'article' ? this.articleSentimentData : this.commentSentimentData;
      const title = this.pieType === 'article' ? '文章情感分布' : '评论情感分布';

      const option = {
        title: {
          text: title,
          left: 'center',
          top: '10',
          textStyle: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: params => {
            const percent = (params.percent || 0).toFixed(1);
            return `
              <div style="font-weight:bold">${params.name}</div>
              <div>数量: ${params.value}</div>
              <div>占比: ${percent}%</div>
            `;
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['正面', '中性', '负面']
        },
        series: [{
          name: title,
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {value: data.positive, name: '正面', itemStyle: {color: '#4CAF50'}},
            {value: data.neutral, name: '中性', itemStyle: {color: '#FFC107'}},
            {value: data.negative, name: '负面', itemStyle: {color: '#F44336'}}
          ]
        }]
      };

      this.charts.nestedPieChart.setOption(option);
    },
    initKeywordsBarChart() {
      const chartDom = this.$refs.keywordsBarChart;
      this.charts.keywordsBarChart = echarts.init(chartDom);

      this.updateKeywordsBarChart();
    },
    updateKeywordsBarChart() {
      const sortedData = [...this.topKeywordsData].sort((a, b) => {
        return this.sortDesc ? b[1] - a[1] : a[1] - b[1];
      });

      const keywords = sortedData.map(item => item[0]);
      const frequency = sortedData.map(item => item[1]);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'shadow'},
          formatter: params => {
            const data = params[0];
            return `
              <div style="font-weight:bold">${data.name}</div>
              <div>出现次数: ${data.value}</div>
            `;
          }
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '3%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            color: '#666',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: keywords,
          axisLabel: {
            color: '#666',
            fontSize: 12
          }
        },
        series: [{
          name: '出现次数',
          type: 'bar',
          data: frequency,
          barWidth: '60%',
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: params => {
              const max = Math.max(...frequency);
              const ratio = params.value / max;
              if (ratio > 0.7) return '#FF5722';
              if (ratio > 0.4) return '#FF9800';
              return '#FFC107';
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            color: '#333'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };

      this.charts.keywordsBarChart.setOption(option);
    },
    refreshChart(chartName) {
      if (this.charts[chartName]) {
        this.charts[chartName].dispose();
        this.charts[chartName] = null;
      }

      switch (chartName) {
        case 'keywordsSentimentChart':
          this.initKeywordsSentimentChart();
          break;
        case 'treeMapChart':
          this.initTreeMapChart();
          break;
        case 'nestedPieChart':
          this.initNestedPieChart();
          break;
        case 'keywordsBarChart':
          this.initKeywordsBarChart();
          break;
      }

      this.$message.success('图表已刷新');
    },
    toggleSort() {
      this.sortDesc = !this.sortDesc;
      this.updateKeywordsBarChart();
      this.$message.success(`已切换为${this.sortDesc ? '降序' : '升序'}排列`);
    },
    calculatePercentage(type) {
      const total = this.getSentimentTotal();
      if (total === 0) return 0;

      const value = this.keywordsSentimentData[type] || 0;
      return Math.round((value / total) * 100);
    },
    getSentimentTotal() {
      return this.keywordsSentimentData.positive +
          this.keywordsSentimentData.neutral +
          this.keywordsSentimentData.negative;
    },
    getMaxFrequency() {
      if (this.topKeywordsData.length === 0) return 0;
      return Math.max(...this.topKeywordsData.map(item => item[1]));
    },
    handleResize() {
      Object.values(this.charts).forEach(chart => {
        chart && chart.resize();
      });
    }
  }
};
</script>

<style scoped>
.chart-card {
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s;
}

.chart-card:hover {
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.chart-container {
  width: 100%;
  height: 350px;
}

.chart-footer {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }

  .chart-footer {
    flex-direction: column;
    gap: 10px;
  }

  .el-col {
    margin-left: 0 !important;
    margin-bottom: 15px;
  }
}
</style>
