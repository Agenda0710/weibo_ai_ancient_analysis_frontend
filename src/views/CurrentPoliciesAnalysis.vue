<template>
  <div class="policy-analysis-container">
    <!-- 政策表格部分 -->
    <el-row :gutter="20" class="policy-row">
      <el-col :span="24">
        <el-card class="policy-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-document"></i> 政策文件列表</h3>
          </div>
          <el-skeleton :loading="loading" animated>
            <el-table :data="policies" style="width: 100%" stripe border>
              <el-table-column
                  prop="time"
                  label="发布时间"
                  width="180"
                  align="center"
                  header-align="center"
              />
              <el-table-column
                  prop="title"
                  label="政策文件"
                  width="750"
                  header-align="center"
              />
              <el-table-column
                  prop="category"
                  label="分类"
                  align="center"
                  header-align="center"
              >
                <template slot-scope="scope">
                  <el-tag :type="getTagType(scope.row.category)" effect="plain">
                    {{ scope.row.category }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI解读部分 -->
    <el-row :gutter="20" class="analysis-row">
      <el-col :span="24">
        <el-card class="analysis-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-connection"></i> AI政策解读</h3>
          </div>
          <el-skeleton :loading="loading" animated>
            <div v-if="aiAnalysis" class="analysis-content">
              <div class="analysis-section" v-for="(section, index) in parsedAnalysis" :key="index">
                <h4 class="section-title">{{ section.title }}</h4>
                <ul class="section-points">
                  <li v-for="(point, pIndex) in section.points" :key="pIndex" class="point-item">
                    <i class="el-icon-caret-right"></i> {{ point }}
                  </li>
                </ul>
              </div>
              <div class="action-buttons">
                <el-button
                    type="primary"
                    icon="el-icon-data-line"
                    @click="showTreeChart"
                    class="tree-button"
                >
                  国务院文件展示
                </el-button>
              </div>
            </div>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>

    <!-- 树形图弹出框 -->
    <el-dialog
        title="国务院文件展示"
        :visible.sync="showDialog"
        width="80%"
        top="5vh"
        @close="resetDialog"
        class="tree-dialog"
    >
      <TreeChart/>
    </el-dialog>

    <!-- 图表部分 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-pie-chart"></i> 政策分类分布</h3>
          </div>
          <div id="categoryChart" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-cloudy"></i> 政策关键词云</h3>
          </div>
          <div id="wordCloudChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from "echarts";
import TreeChart from "@/components/TreeChart.vue";

export default {
  components: {TreeChart},
  data() {
    return {
      policies: [],
      aiAnalysis: null,
      categoryChart: null,
      showDialog: false,
      wordCloudData: [],
      wordCloudInstance: null,
      loading: true,
    };
  },
  computed: {
    // 解析AI分析结果，转换为结构化数据
    parsedAnalysis() {
      if (!this.aiAnalysis) return [];

      // 示例解析逻辑，根据实际返回格式调整
      const sections = this.aiAnalysis.split(/\d+\.\s/).filter(s => s.trim());

      return sections.map(section => {
        const [titlePart, ...points] = section.split('-');
        const title = titlePart.split(':')[0].trim();

        return {
          title: title,
          points: points
              .map(p => p.trim())
              .filter(p => p)
              .map(p => p.replace(/^\s*-\s*/, '').trim())
        };
      });
    }
  },
  methods: {
    showTreeChart() {
      this.showDialog = true;
    },
    resetDialog() {
      this.showDialog = false;
    },
    fetchPolicies() {
      this.loading = true;
      axios.get("/api/analyzeAiPolicies/").then((response) => {
        const data = response.data;
        this.policies = data.policies;
        this.aiAnalysis = data.ai_analysis;
        this.wordCloudData = data.word_cloud_data;

        this.renderCategoryChart(data.category_chart_data);
        this.renderWordCloudChart();

        this.loading = false;
      }).catch((error) => {
        console.error("获取政策数据失败", error);
        this.loading = false;
      });
    },
    renderCategoryChart(data) {
      const chartDom = document.getElementById("categoryChart");
      this.categoryChart = echarts.init(chartDom);

      const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#9c27b0', '#ff9800'];

      const option = {
        title: {
          text: "政策分类占比",
          left: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
          data: data.map(item => item.name)
        },
        series: [{
          name: "分类分布",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 5,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: "{b}: {d}%",
            fontSize: 12
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "14",
              fontWeight: "bold"
            }
          },
          data: data.map((item, index) => ({
            ...item,
            itemStyle: {
              color: colors[index % colors.length]
            }
          }))
        }]
      };
      this.categoryChart.setOption(option);

      // 响应式调整
      window.addEventListener('resize', () => {
        this.categoryChart.resize();
      });
    },
    renderWordCloudChart() {
      const chartDom = document.getElementById("wordCloudChart");
      this.wordCloudInstance = echarts.init(chartDom);

      const option = {
        title: {
          text: "政策关键词云",
          left: "center",
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
          data: this.wordCloudData
        }]
      };

      this.wordCloudInstance.setOption(option);

      // 响应式调整
      window.addEventListener('resize', () => {
        this.wordCloudInstance.resize();
      });
    },
    getTagType(category) {
      const categoryColors = {
        '文化': 'success',
        '教育': 'info',
        '科技': 'warning',
        '旅游': 'danger',
        '经济': 'primary',
        '法律': 'success',
        '国际': 'info'
      };
      return categoryColors[category] || 'default';
    }
  },
  mounted() {
    this.fetchPolicies();
  },
  beforeDestroy() {
    // 移除事件监听
    window.removeEventListener('resize', this.categoryChart?.resize);
    window.removeEventListener('resize', this.wordCloudInstance?.resize);
  }
};
</script>

<style scoped>
.policy-analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
}

/* 卡片通用样式 */
.policy-card,
.analysis-card,
.chart-card {
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
.el-table {
  border-radius: 8px;
}

.el-table::v-deep .el-table__header-wrapper th {
  background-color: #f8f8f9;
  font-weight: bold;
  color: #333;
}

.el-table::v-deep .el-table__body tr:hover td {
  background-color: #f5f7fa !important;
}

/* AI分析内容样式 */
.analysis-content {
  padding: 0 20px 20px;
}

.analysis-section {
  margin-bottom: 20px;
}

.section-title {
  color: #409EFF;
  font-size: 16px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px dashed #ebeef5;
}

.section-points {
  padding-left: 20px;
  margin: 0;
}

.point-item {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #606266;
  list-style-type: none;
  position: relative;
}

.point-item i {
  color: #67C23A;
  margin-right: 8px;
  position: absolute;
  left: -20px;
  top: 5px;
}

.action-buttons {
  margin-top: 25px;
  text-align: center;
}

.tree-button {
  padding: 10px 25px;
  font-size: 14px;
}

/* 图表容器 */
.chart-container {
  height: 400px;
  width: 100%;
}

/* 树形图对话框 */
.tree-dialog {
  border-radius: 8px;
}

.tree-dialog::v-deep .el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}

.tree-dialog::v-deep .el-dialog__body {
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .policy-analysis-container {
    padding: 15px;
  }

  .card-header h3 {
    font-size: 16px;
  }

  .section-title {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .policy-analysis-container {
    padding: 10px;
  }

  .chart-row .el-col {
    margin-bottom: 15px;
  }

  .analysis-content {
    padding: 0 15px 15px;
  }
}
</style>
