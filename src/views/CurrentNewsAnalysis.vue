<template>
  <div class="news-analysis-container">
    <el-row>
      <el-col :span="24">
        <el-card class="news-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-news"></i> 新闻数据分析</h3>
            <el-tag type="info" size="small">共 {{newsDataList.length}} 条新闻</el-tag>
          </div>
          <el-table
              ref="filterTable"
              :data="newsDataList"
              style="width: 100%"
              v-loading="loading"
              stripe
              border
              class="news-table"
          >
            <el-table-column
                prop="time"
                label="发布时间"
                width="150"
                align="center"
                header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                    type="text"
                    @click="viewArticle(scope.row.detailUrl)"
                    class="time-btn"
                >
                  <i class="el-icon-time"></i> {{ scope.row.time }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
                label="新闻内容"
                header-align="center"
            >
              <template slot-scope="scope">
                <div class="news-content" v-html="highlightKeywords(scope.row.content)"></div>
              </template>
            </el-table-column>

            <el-table-column
                prop="category"
                label="新闻分类"
                width="180"
                align="center"
                header-align="center"
                :filters="categoryFilters"
                :filter-method="filterCategory"
                filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                    :type="getTagType(scope.row.category)"
                    effect="dark"
                    class="category-tag"
                >
                  {{ scope.row.category }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="chart-row">
      <el-col :xs="24" :sm="24" :md="16" :lg="12" :offset="6">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="chart-header">
            <h3><i class="el-icon-pie-chart"></i> 新闻分类分布</h3>
          </div>
          <div ref="pieChart" class="pie-chart"></div>
        </el-card>
      </el-col>
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
      keywords: ["古代", "非遗", "古人", "考古", "文物"] // 需要高亮的关键词
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

      // 准备颜色数组
      const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399',
        '#9c27b0', '#ff9800', '#4caf50', '#2196f3', '#607d8b'];

      const option = {
        title: {
          text: '新闻分类占比',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: Object.keys(this.categoryCounts)
        },
        series: [
          {
            name: '分类分布',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
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
            labelLine: {
              show: true
            },
            data: Object.entries(this.categoryCounts).map(([key, value], index) => ({
              name: key,
              value,
              itemStyle: {
                color: colors[index % colors.length]
              }
            }))
          }
        ]
      };
      myChart.setOption(option);

      // 响应式调整
      window.addEventListener('resize', function () {
        myChart.resize();
      });
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
.news-analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

/* 卡片样式 */
.news-card {
  border-radius: 8px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
}

.card-header i {
  margin-right: 10px;
  color: #409EFF;
}

/* 表格样式 */
.news-table {
  border-radius: 8px;
}

.news-table::v-deep .el-table__header-wrapper th {
  background-color: #f8f8f9;
  font-weight: bold;
  color: #333;
}

.news-table::v-deep .el-table__body tr:hover td {
  background-color: #f5f7fa !important;
}

.time-btn {
  color: #606266;
  font-size: 13px;
}

.time-btn:hover {
  color: #409EFF;
}

.time-btn i {
  margin-right: 5px;
}

.news-content {
  font-size: 14px;
  line-height: 1.6;
  padding: 5px 0;
}

.highlight-keyword {
  color: #f56c6c;
  font-weight: bold;
  padding: 0 2px;
  background-color: #fff2f2;
  border-radius: 2px;
}

.category-tag {
  font-size: 12px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
}

/* 图表区域样式 */
.chart-row {
  margin-top: 30px;
}

.chart-card {
  border-radius: 8px;
}

.chart-header {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  display: flex;
  align-items: center;
}

.chart-header i {
  margin-right: 10px;
  color: #67C23A;
}

.pie-chart {
  height: 400px;
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-analysis-container {
    padding: 10px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-header h3 {
    margin-bottom: 10px;
  }

  .pie-chart {
    height: 300px;
  }
}
</style>
