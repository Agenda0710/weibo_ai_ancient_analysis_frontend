<template>
  <div class="region-analysis-container">
    <!-- 文章地区分布图 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="map-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-map-location"></i>
            <span>文章IP发布分析图</span>
            <el-button
                type="text"
                icon="el-icon-refresh"
                @click="refreshData"
                style="float: right; padding: 3px 0"
            ></el-button>
          </div>
          <div ref="articleChart" class="map-container"></div>
          <div class="map-footer">
            地图来源：阿里云DataV高德地图&nbsp;&nbsp;&nbsp;审图号：2022 高德软件 GS京(2022)1061号
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评论地区分布图 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card class="map-card" shadow="hover">
          <div slot="header" class="card-header">
            <i class="el-icon-chat-line-square"></i>
            <span>评论IP发布分析图</span>
            <el-button
                type="text"
                icon="el-icon-refresh"
                @click="refreshData"
                style="float: right; padding: 3px 0"
            ></el-button>
          </div>
          <div ref="commentChart" class="map-container"></div>
          <div class="map-footer">
            地图来源：阿里云DataV高德地图&nbsp;&nbsp;&nbsp;审图号：2022 高德软件 GS京(2022)1061号
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import getChineseMap from "@/api/getChineseMap";
import axios from "axios";

export default {
  name: "RegionAnalysis",
  data() {
    return {
      articleDataList: [],
      commentDataList: [],
      charts: [],
      loading: false
    }
  },
  methods: {
    fetchAllRegionData() {
      this.loading = true;
      const articleChart = this.$refs.articleChart;
      const commentChart = this.$refs.commentChart;

      echarts.getInstanceByDom(articleChart)?.showLoading();
      echarts.getInstanceByDom(commentChart)?.showLoading();

      axios.get('/api/regionAnalysis/')
          .then((response) => {
            this.articleDataList = response.data.articleDataList || [];
            this.commentDataList = response.data.commentDataList || [];

            this.$nextTick(() => {
              this.drawArticleMap();
              this.drawCommentMap();
            });
          })
          .catch(error => {
            this.$message.error('数据加载失败: ' + error.message);
          })
          .finally(() => {
            this.loading = false;
            echarts.getInstanceByDom(articleChart)?.hideLoading();
            echarts.getInstanceByDom(commentChart)?.hideLoading();
          });
    },

    initChart(dom) {
      const chart = echarts.getInstanceByDom(dom) || echarts.init(dom);
      this.charts.push(chart);
      return chart;
    },

    drawArticleMap() {
      const chart = this.initChart(this.$refs.articleChart);
      const articleMapData = this.formatMapData(this.articleDataList, 'article_count');
      const maxValue = Math.max(...articleMapData.map(item => item.value), 1);

      const option = {
        title: {
          text: '文章地区分布',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#333'
          },
          subtext: `总计 ${this.articleDataList.reduce((sum, item) => sum + item.article_count, 0)} 篇文章`,
          subtextStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: params => {
            return `${params.name}<br/>文章数: ${params.value || 0}篇<br/>占比: ${((params.value || 0) / maxValue * 100).toFixed(1)}%`;
          }
        },
        visualMap: {
          min: 0,
          max: maxValue,
          left: 'right',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0f7fa', '#006064']
          },
          textStyle: {
            color: '#666'
          }
        },
        series: [{
          name: '文章数',
          type: 'map',
          map: 'China',
          roam: true,
          label: {
            show: true,
            color: '#333',
            fontSize: 10
          },
          emphasis: {
            label: {
              color: '#fff',
              fontSize: 12
            },
            itemStyle: {
              areaColor: '#006064'
            }
          },
          data: articleMapData
        }]
      };

      chart.setOption(option);
    },

    drawCommentMap() {
      const chart = this.initChart(this.$refs.commentChart);
      const commentMapData = this.formatMapData(this.commentDataList, 'comment_count');
      const maxValue = Math.max(...commentMapData.map(item => item.value), 1);

      const option = {
        title: {
          text: '评论地区分布',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#333'
          },
          subtext: `总计 ${this.commentDataList.reduce((sum, item) => sum + item.comment_count, 0)} 条评论`,
          subtextStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: params => {
            return `${params.name}<br/>评论数: ${params.value || 0}条<br/>占比: ${((params.value || 0) / maxValue * 100).toFixed(1)}%`;
          }
        },
        visualMap: {
          min: 0,
          max: maxValue,
          left: 'right',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#ffebee', '#c62828']
          },
          textStyle: {
            color: '#666'
          }
        },
        series: [{
          name: '评论数',
          type: 'map',
          map: 'China',
          roam: true,
          label: {
            show: true,
            color: '#333',
            fontSize: 10
          },
          emphasis: {
            label: {
              color: '#fff',
              fontSize: 12
            },
            itemStyle: {
              areaColor: '#c62828'
            }
          },
          data: commentMapData
        }]
      };

      chart.setOption(option);
    },

    formatMapData(dataList, valueKey) {
      return dataList.map(item => ({
        name: item.region ? item.region.trim() : '未知',
        value: item[valueKey] || 0
      }));
    },

    refreshData() {
      this.fetchAllRegionData();
    },

    handleResize() {
      this.charts.forEach(chart => chart.resize());
    }
  },
  mounted() {
    const loading = this.$loading({
      target: '.region-analysis-container',
      text: '地图数据加载中...'
    });

    getChineseMap.then(res => {
      echarts.registerMap('China', res.data);
      this.fetchAllRegionData();
      loading.close();
    }).catch(error => {
      loading.close();
      this.$message.error('地图数据加载失败: ' + error.message);
    });

    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.charts.forEach(chart => chart.dispose());
  }
}
</script>

<style scoped>
.region-analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.map-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
}

.map-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  padding: 15px 20px;
}

.card-header i {
  margin-right: 8px;
  color: #409EFF;
}

.map-container {
  width: 100%;
  height: 600px;
}

.map-footer {
  text-align: center;
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  padding: 10px 0;
}

@media (max-width: 992px) {
  .map-container {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .region-analysis-container {
    padding: 10px;
  }

  .map-container {
    height: 400px;
  }

  .card-header {
    font-size: 14px;
    padding: 10px 15px;
  }
}
</style>
