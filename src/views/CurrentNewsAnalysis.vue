<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-table
              ref="filterTable"
              :data="newsDataList"
              style="width: 100%"
              v-loading="loading"
          >

            <el-table-column prop="time" label="时间" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="viewArticle(scope.row.detailUrl)">
                  {{ scope.row.time }}
                </el-button>
              </template>
            </el-table-column>

            <!-- 修改新闻内容列 -->
            <el-table-column label="新闻内容" width="820">
              <template slot-scope="scope">
                <span v-html="highlightKeywords(scope.row.content)"></span>
              </template>
            </el-table-column>

            <el-table-column
                prop="category"
                label="新闻分类"
                width="180"
                :filters="categoryFilters"
                :filter-method="filterCategory"
                filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag :type="getTagType(scope.row.category)">{{ scope.row.category }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="7"></el-col>
      <el-col :span="10">
        <!-- ECharts 饼状图 -->
        <div ref="pieChart" style="height: 400px; margin-top: 20px;width: 100%"></div>
      </el-col>
      <el-col :span="7"></el-col>
    </el-row>
  </div>
</template>


<script>
import axios from "axios";
import * as echarts from 'echarts';

export default {
  name: "CurrentNewsAnalysis",
  data() {
    return {
      newsDataList: [], // 新闻数据列表
      categoryFilters: [], // 分类筛选项
      categoryCounts: {}, // 分类统计
      loading: true, // 加载状态
      keywords: ["智能", "大模型", "AI"] // 需要高亮的关键词
    };
  },
  created() {
    this.fetchCurrentNews(); // 组件创建时获取数据
  },
  methods: {
    // 获取当前新闻数据
    fetchCurrentNews() {
      axios.get('/api/getCurrentNews/').then((response) => {
        this.loading = false;
        this.newsDataList = response.data.news_data_analysis.map(item => {
          return {
            content: item.news_data,          // 新闻内容
            time: item.news_create_time,     // 新闻时间
            detailUrl: item.news_detail_url,      // 新闻链接
            category: item.label             // 新闻分类
          };
        });

        // 获取分类统计数据
        this.categoryCounts = response.data.category_counts;
        this.renderPieChart();

        // 获取所有分类，用于筛选
        this.categoryFilters = Array.from(new Set(this.newsDataList.map(item => item.category)))
            .map(category => ({text: category, value: category}));
      });
    },
    // 看新闻详情
    viewArticle(url) {
      window.open(url, "_blank"); // 跳转到文章详情页
    },
    // 高亮关键词
    highlightKeywords(content) {
      if (!content) return "";
      const regex = new RegExp(`(${this.keywords.join("|")})`, "gi");
      return content.replace(regex, '<span style="color: red; font-weight: bold;">$1</span>');
    },
    // 渲染饼状图
    renderPieChart() {
      const chartDom = this.$refs.pieChart;
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: '新闻分类分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '分类',
            type: 'pie',
            radius: '50%',
            data: Object.entries(this.categoryCounts).map(([key, value]) => ({name: key, value})),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        label: {
          formatter: '{b}: {c} ({d}%)'
        }
      };
      myChart.setOption(option);
    },
    // 分类筛选方法
    filterCategory(value, row) {
      return row.category === value;
    },
    // 获取分类标签颜色
    getTagType(category) {
      const categoryColors = {
        '民生': 'success',
        '文化': 'info',
        '娱乐': 'warning',
        '体育': 'danger',
        '财经': 'primary',
        '家具': 'info',
        '汽车': 'success',
        '教育': 'warning',
        '科技': 'primary',
        '军事': 'danger',
        '旅游': 'success',
        '时政': 'info',
        '股票': 'warning',
        '农业': 'primary',
        '电竞': 'danger'
      };
      return categoryColors[category] || 'default';
    }
  }
};
</script>


<style scoped>
.el-col {
  min-height: 1px
}
</style>
