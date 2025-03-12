<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-form :model="form">
            <el-form-item label="特定词选择">
              <el-select v-model="selectedWord" placeholder="特定词选择" @change="fetchArticleTypeData">
                <el-option
                    v-for="type in articleTypeList"
                    :key="type"
                    :label="type"
                    :value="type"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="selectedWord" class="equal-height-row">
      <!-- 左侧热点话题 -->
      <el-col :span="12" class="flex-column">
        <el-card v-loading="loading" class="card">
          <h3>热点话题</h3>
          <el-table :data="hotQueries" style="width: 100%" border>
            <el-table-column prop="index" label="序号" width="60">
              <template #default="scope">
                {{ scope.row.index }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="话题">
              <template #default="scope">
                {{ scope.row.content }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧微博文章 -->
      <el-col :span="12" class="flex-column">
        <el-card v-loading="loading" class="card">
          <h3>微博文章</h3>
          <el-table :data="weiboArticles" style="width: 100%" border>
            <el-table-column prop="index" label="序号" width="60">
              <template #default="scope">
                {{ scope.row.index }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="文章内容">
              <template #default="scope">
                {{ scope.row.content.slice(0, 30) + (scope.row.content.length > 80 ? '...' : '') }}
              </template>
            </el-table-column>
            <el-table-column prop="sentiment" label="情感分析" width="100">
              <template #default="scope">
                {{ scope.row.sentiment }}
              </template>
            </el-table-column>
          </el-table>
          <el-button
              type="primary"
              @click="viewMore"
              style="margin-top: 10px;"
          >
            查看更多
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="selectedWord">
      <el-col :span="24">
        <el-card v-loading="loading">
          <h3>AI模型解读</h3>
          <div style="font-size: 14px; line-height: 1.8; color: #333;">
            {{ aiInterpretations }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="selectedWord">
      <el-col :span="12">
        <el-card v-loading="loading">
          <h3>情感分析统计</h3>
          <div id="sentiment-chart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-loading="loading">
          <h3>词云图</h3>
          <div id="wordcloud-chart" style="width: 100%; height: 400px;"></div>
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
      articleTypeList: ['非遗', '中华传统', '古代发明'],
      selectedWord: '',
      hotQueries: [],
      weiboArticles: [], // 包含 content 和 sentiment 的文章数据
      aiInterpretations: [],
      sentimentStats: {}, // 情感统计数据
      loading: true,
    };
  },
  methods: {
    async fetchArticleTypeData() {
      this.loading = true
      if (!this.selectedWord) return;
      try {
        const response = await axios.post("/api/weiboSearchAnalysis/", {keyword: this.selectedWord});
        this.hotQueries = response.data.hot_queries;
        this.weiboArticles = response.data.articles; // [{index, content, sentiment}]
        this.aiInterpretations = response.data.ai_interpretation;
        this.sentimentStats = response.data.sentiment_stats;

        // 更新情感分析统计图
        this.renderSentimentChart();

        // 绘制词云图
        this.renderWordCloud(response.data.word_frequencies);
        this.loading = false
      } catch (error) {
        console.error("数据加载失败:", error);
      }
    },
    viewMore() {
      const url = `https://s.weibo.com/weibo?q=${encodeURIComponent(this.selectedWord)}&nodup=1`;
      window.open(url, "_blank");
    },
    renderSentimentChart() {
      const chartDom = document.getElementById("sentiment-chart");
      const chart = echarts.init(chartDom);

      const option = {
        tooltip: {trigger: "item"},
        legend: {bottom: "10%"},
        series: [
          {
            name: "情感分布",
            type: "pie",
            radius: "50%",
            data: [
              {value: this.sentimentStats.positive, name: "正面"},
              {value: this.sentimentStats.neutral, name: "中性"},
              {value: this.sentimentStats.negative, name: "负面"},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      chart.setOption(option);
    },
    renderWordCloud(wordFrequencies) {
      const chartDom = document.getElementById("wordcloud-chart");
      const chart = echarts.init(chartDom);

      const option = {
        tooltip: {},
        series: [
          {
            type: "wordCloud",
            gridSize: 2,
            sizeRange: [12, 50],
            rotationRange: [-90, 90],
            shape: "circle",
            width: "100%",
            height: "100%",
            drawOutOfBound: true,
            textStyle: {
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: () => {
                return `rgb(${Math.round(Math.random() * 255)},${Math.round(
                    Math.random() * 255
                )},${Math.round(Math.random() * 255)})`;
              },
            },
            data: wordFrequencies.map(([word, count]) => ({
              name: word,
              value: count,
            })),
          },
        ],
      };

      chart.setOption(option);
    },
  },
};
</script>


<style scoped>
.equal-height-row {
  display: flex; /* 使用 Flexbox 布局 */
}

.flex-column {
  display: flex; /* 子元素也采用 Flexbox 布局 */
  flex-direction: column; /* 垂直排列 */
}

.card {
  flex: 1; /* 子元素填充可用空间 */
  display: flex;
  flex-direction: column; /* 确保内容竖直排列 */
}
</style>

