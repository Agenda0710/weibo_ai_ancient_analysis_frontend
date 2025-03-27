<template>
  <div class="weibo-analysis-container">
    <!-- 关键词选择部分 -->
    <el-row>
      <el-col :span="24">
        <el-card class="keyword-card" shadow="hover">
          <el-form :model="form" label-position="top">
            <el-form-item label="选择文化主题关键词">
              <el-select
                  v-model="selectedWord"
                  placeholder="请选择关键词"
                  @change="fetchArticleTypeData"
                  size="large"
                  style="width: 100%"
              >
                <el-option
                    v-for="type in articleTypeList"
                    :key="type"
                    :label="type"
                    :value="type"
                >
                  <span style="float: left">{{ type }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    <i class="el-icon-collection"></i>
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据展示部分 -->
    <el-row :gutter="20" v-if="selectedWord" class="data-row">
      <!-- 左侧热点话题 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="data-col">
        <el-card v-loading="loading" class="data-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-news"></i> 热点话题排行</h3>
          </div>
          <el-table
              :data="hotQueries"
              style="width: 100%"
              border
              stripe
              highlight-current-row
              class="hot-topic-table"
          >
            <el-table-column
                prop="index"
                label="排名"
                width="80"
                align="center"
                header-align="center"
            >
              <template #default="scope">
                <el-tag :type="getRankType(scope.row.index)" size="medium">
                  {{ scope.row.index }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="热门话题"
                header-align="center"
            >
              <template #default="scope">
                <div class="hot-topic">
                  <i class="el-icon-star-on topic-icon"></i>
                  <span class="topic-content">{{ scope.row.content }}</span>
                  <el-button
                      type="text"
                      size="mini"
                      @click="searchTopic(scope.row.content)"
                      class="search-btn"
                  >
                    <i class="el-icon-search"></i> 查看
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧微博文章 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" class="data-col">
        <el-card v-loading="loading" class="data-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-chat-dot-round"></i> 相关微博精选</h3>
          </div>
          <el-table
              :data="weiboArticles"
              style="width: 100%"
              border
              stripe
              class="weibo-table"
          >
            <el-table-column
                prop="index"
                label="序号"
                width="80"
                align="center"
                header-align="center"
            >
              <template #default="scope">
                {{ scope.row.index }}
              </template>
            </el-table-column>
            <el-table-column
                prop="content"
                label="微博内容"
                header-align="center"
            >
              <template #default="scope">
                <div class="weibo-content">
                  {{ scope.row.content.slice(0, 80) }}
                  <span v-if="scope.row.content.length > 80">...</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sentiment"
                label="情感分析"
                width="120"
                align="center"
                header-align="center"
            >
              <template #default="scope">
                <el-tag
                    :type="getSentimentType(scope.row.sentiment)"
                    effect="dark"
                    size="medium"
                >
                  {{ scope.row.sentiment }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="view-more">
            <el-button
                type="primary"
                @click="viewMore"
                icon="el-icon-more"
                size="medium"
            >
              查看更多微博
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI解读部分 - 简化版 -->
    <el-row v-if="selectedWord && aiInterpretations" class="analysis-row">
      <el-col :span="24">
        <el-card v-loading="loading" class="analysis-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-data-analysis"></i> AI深度解读分析</h3>
          </div>
          <div class="analysis-content">
            <div class="ai-text-content">
              {{ aiInterpretations }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表部分 -->
    <el-row :gutter="20" v-if="selectedWord" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card v-loading="loading" class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-pie-chart"></i> 情感分析统计</h3>
          </div>
          <div id="sentiment-chart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card v-loading="loading" class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-cloudy"></i> 关键词云</h3>
          </div>
          <div id="wordcloud-chart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";

export default {
  name: "GetWeiboSearch",
  data() {
    return {
      form: {},
      articleTypeList: ['非遗', '中华传统', '古代发明', '传统节日', '文化遗产', '民间艺术'],
      selectedWord: '',
      hotQueries: [],
      weiboArticles: [],
      aiInterpretations: '',
      sentimentStats: {},
      loading: true,
    };
  },
  methods: {
    cleanText(text) {
      return text.replace(/^[，。、\s]+/, '');
    },

    async fetchArticleTypeData() {
      this.loading = true;
      if (!this.selectedWord) return;
      try {
        const response = await axios.post("/api/weiboSearchAnalysis/", {keyword: this.selectedWord});
        this.hotQueries = response.data.hot_queries.map((item, index) => ({
          ...item,
          index: index + 1
        }));
        this.weiboArticles = response.data.articles.map((item, index) => ({
          ...item,
          index: index + 1
        }));
        this.aiInterpretations = response.data.ai_interpretation;
        this.sentimentStats = response.data.sentiment_stats;

        this.renderSentimentChart();
        this.renderWordCloud(response.data.word_frequencies);
        this.loading = false;

        this.$nextTick(() => {
          this.adjustTableHeights();
        });
      } catch (error) {
        console.error("数据加载失败:", error);
        this.loading = false;
      }
    },

    adjustTableHeights() {
      const leftTable = document.querySelector('.hot-topic-table .el-table__body-wrapper');
      const rightTable = document.querySelector('.weibo-table .el-table__body-wrapper');

      if (leftTable && rightTable) {
        const leftHeight = leftTable.clientHeight;
        const rightHeight = rightTable.clientHeight;
        const maxHeight = Math.max(leftHeight, rightHeight);

        leftTable.style.height = `${maxHeight}px`;
        rightTable.style.height = `${maxHeight}px`;
      }
    },

    viewMore() {
      const url = `https://s.weibo.com/weibo?q=${encodeURIComponent(this.selectedWord)}&nodup=1`;
      window.open(url, "_blank");
    },

    searchTopic(topic) {
      const url = `https://s.weibo.com/weibo?q=${encodeURIComponent(topic)}&nodup=1`;
      window.open(url, "_blank");
    },

    renderSentimentChart() {
      const chartDom = document.getElementById("sentiment-chart");
      const chart = echarts.init(chartDom);

      const option = {
        title: {
          text: '情感分布比例',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['正面', '中性', '负面']
        },
        series: [
          {
            name: '情感分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {d}%',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold'
              }
            },
            data: [
              {value: this.sentimentStats.positive, name: '正面', itemStyle: {color: '#67C23A'}},
              {value: this.sentimentStats.neutral, name: '中性', itemStyle: {color: '#E6A23C'}},
              {value: this.sentimentStats.negative, name: '负面', itemStyle: {color: '#F56C6C'}}
            ]
          }
        ]
      };

      chart.setOption(option);
      window.addEventListener('resize', function () {
        chart.resize();
      });
    },

    renderWordCloud(wordFrequencies) {
      const chartDom = document.getElementById("wordcloud-chart");
      const chart = echarts.init(chartDom);

      const option = {
        title: {
          text: '关键词热度',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          show: true,
          formatter: params => {
            return `${params.name}: ${params.value}`;
          }
        },
        series: [{
          type: "wordCloud",
          shape: "circle",
          left: "center",
          top: "center",
          width: "90%",
          height: "90%",
          right: null,
          bottom: null,
          sizeRange: [12, 60],
          rotationRange: [-45, 45],
          rotationStep: 15,
          gridSize: 8,
          drawOutOfBound: false,
          textStyle: {
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: () => {
              return `rgb(${[
                Math.round(Math.random() * 160 + 50),
                Math.round(Math.random() * 160 + 50),
                Math.round(Math.random() * 160 + 50)
              ].join(",")})`;
            }
          },
          emphasis: {
            focus: "self",
            textStyle: {
              shadowBlur: 10,
              shadowColor: "#333"
            }
          },
          data: wordFrequencies.map(([word, count]) => ({
            name: word,
            value: count
          }))
        }]
      };

      chart.setOption(option);
      window.addEventListener('resize', function () {
        chart.resize();
      });
    },

    getSentimentType(sentiment) {
      const map = {
        '正面': 'success',
        '中性': 'warning',
        '负面': 'danger'
      };
      return map[sentiment] || 'info';
    },

    getRankType(rank) {
      if (rank <= 3) return 'danger';
      if (rank <= 6) return 'warning';
      return 'info';
    }
  }
};
</script>

<style scoped>
.weibo-analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.keyword-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f6f7f9 0%, #e9ebee 100%);
  border: none;
}

.data-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.data-col {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}

.data-card,
.analysis-card,
.chart-card {
  border-radius: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.data-card:hover,
.analysis-card:hover,
.chart-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f9fafc;
  border-radius: 12px 12px 0 0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.card-header i {
  margin-right: 10px;
  color: #409EFF;
  font-size: 20px;
}

.hot-topic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.topic-content {
  flex: 1;
  font-size: 14px;
  margin-left: 10px;
}

.topic-icon {
  color: #F56C6C;
  font-size: 16px;
}

.search-btn {
  margin-left: 10px;
  color: #409EFF;
  font-weight: 500;
}

.weibo-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  padding: 8px 0;
}

.view-more {
  text-align: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #ebeef5;
}

.analysis-content {
  padding: 20px;
}

.ai-text-content {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  text-align: justify;
  white-space: pre-line;
}

.chart-container {
  height: 400px;
  width: 100%;
  padding: 10px;
}

.hot-topic-table .el-table__body-wrapper,
.weibo-table .el-table__body-wrapper {
  min-height: 300px;
}

.analysis-row {
  margin-bottom: 30px;
}

.chart-row {
  margin-top: 10px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .weibo-analysis-container {
    padding: 15px;
  }

  .chart-container {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .weibo-analysis-container {
    padding: 10px;
  }

  .data-col {
    margin-bottom: 15px;
    padding: 0;
  }

  .analysis-content {
    padding: 15px;
  }

  .chart-container {
    height: 300px;
  }
}
</style>
