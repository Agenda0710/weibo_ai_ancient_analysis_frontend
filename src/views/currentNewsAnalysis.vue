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
            <el-table-column label="序号" width="120">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>

            <el-table-column prop="content" label="新闻内容" width="950"></el-table-column>

            <el-table-column
                prop="category"
                label="新闻分类"
                width="200"
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
  name: "currentNewsAnalysis",
  data() {
    return {
      newsDataList: [],
      categoryFilters: [],
      categoryCounts: {},
      loading: true
    };
  },
  created() {
    this.fetchCurrentNews();
  },
  methods: {
    fetchCurrentNews() {
      axios.get('/api/getCurrentNews/').then((response) => {
        this.loading = false
        this.newsDataList = response.data.news_data_analysis.map(item => {
          return {
            content: Object.keys(item)[0],
            category: item[Object.keys(item)[0]],
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
    filterCategory(value, row) {
      return row.category === value;
    },
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
