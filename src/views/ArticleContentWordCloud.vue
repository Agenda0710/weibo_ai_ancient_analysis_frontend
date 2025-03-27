<template>
  <div class="word-cloud-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="word-cloud-card">
          <div slot="header" class="clearfix">
            <span class="card-title">文章内容词云分析</span>
            <div class="card-actions">
              <el-tooltip content="刷新数据" placement="top">
                <el-button
                    icon="el-icon-refresh"
                    circle
                    size="mini"
                    @click="refreshData"
                    :loading="loading"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="下载图片" placement="top">
                <el-button
                    icon="el-icon-download"
                    circle
                    size="mini"
                    @click="downloadImage"
                ></el-button>
              </el-tooltip>
            </div>
          </div>

          <div class="controls">
            <el-slider
                v-model="sizeRange[0]"
                :min="8"
                :max="30"
                :step="1"
                label="最小字号"
                style="width: 200px; margin-right: 20px;"
            ></el-slider>
            <el-slider
                v-model="sizeRange[1]"
                :min="30"
                :max="80"
                :step="1"
                label="最大字号"
                style="width: 200px;"
            ></el-slider>

            <el-select
                v-model="shape"
                placeholder="选择形状"
                size="mini"
                style="width: 120px; margin-left: 20px;"
            >
              <el-option label="圆形" value="circle"></el-option>
              <el-option label="心形" value="cardioid"></el-option>
              <el-option label="菱形" value="diamond"></el-option>
              <el-option label="三角形" value="triangle"></el-option>
              <el-option label="五角星" value="star"></el-option>
            </el-select>

            <el-button
                type="primary"
                size="mini"
                @click="applySettings"
                style="margin-left: 20px;"
            >
              应用设置
            </el-button>
          </div>

          <div
              v-loading="loading"
              element-loading-text="加载词云数据..."
              element-loading-background="rgba(255, 255, 255, 0.8)"
              class="chart-container"
              ref="wordCloudChart"
          ></div>

          <div class="word-info" v-if="selectedWord">
            <el-tag type="info">当前选中: {{ selectedWord.name }} (出现 {{ selectedWord.value }} 次)</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts'
import 'echarts-wordcloud'

export default {
  name: 'ArticleContentWordCloud',
  data() {
    return {
      wordCloudData: [],
      loading: false,
      selectedWord: null,
      sizeRange: [12, 50],
      shape: 'circle',
      chartInstance: null,
      colorThemes: [
        () => `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`,
        () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
        () => {
          const colors = ['#c23531','#2f4554','#61a0a8','#d48265','#91c7ae','#749f83','#ca8622'];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      ],
      currentColorTheme: 0
    }
  },
  mounted() {
    this.fetchWordCloudData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  methods: {
    fetchWordCloudData() {
      this.loading = true;
      axios.get('/api/articleContentWordCloud/').then(response => {
        this.wordCloudData = response.data.word_cloud;
        this.initWordCloudChart();
      }).catch(error => {
        this.$message.error('获取词云数据失败: ' + error.message);
      }).finally(() => {
        this.loading = false;
      });
    },
    initWordCloudChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      const chartDom = this.$refs.wordCloudChart;
      this.chartInstance = echarts.init(chartDom);

      // 格式化词云数据
      const formattedData = this.wordCloudData.map(item => ({
        name: item[0],  // 词语
        value: item[1]  // 词频
      }));

      const option = {
        backgroundColor: '#f9f9f9',
        tooltip: {
          trigger: 'item',
          formatter: params => {
            this.selectedWord = params.data;
            return `<div style="font-weight:bold">${params.name}</div>出现次数: ${params.value}`;
          }
        },
        series: [{
          type: 'wordCloud',
          gridSize: 20,
          sizeRange: this.sizeRange,
          rotationRange: [-45, 45],
          rotationStep: 15,
          shape: this.shape,
          drawOutOfBound: false,
          textStyle: {
            fontFamily: 'Microsoft YaHei',
            fontWeight: 'bold',
            color: this.colorThemes[this.currentColorTheme],
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: formattedData,
          // 添加鼠标悬停效果
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          }
        }]
      };

      this.chartInstance.setOption(option);

      // 窗口大小变化时重新调整图表大小
      this.chartInstance.on('click', params => {
        this.selectedWord = params.data;
        this.$message({
          message: `您点击了: ${params.data.name} (出现 ${params.data.value} 次)`,
          type: 'info',
          duration: 1500
        });
      });

      this.handleResize();
    },
    refreshData() {
      this.fetchWordCloudData();
    },
    downloadImage() {
      if (!this.chartInstance) return;

      this.$message({
        message: '正在生成图片...',
        type: 'info',
        duration: 1000
      });

      setTimeout(() => {
        const imgUrl = this.chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#fff'
        });

        const link = document.createElement('a');
        link.download = '词云图_' + new Date().toLocaleDateString() + '.png';
        link.href = imgUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.$message({
          message: '图片下载开始',
          type: 'success',
          duration: 1500
        });
      }, 500);
    },
    applySettings() {
      this.initWordCloudChart();
    },
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    },
    changeColorTheme() {
      this.currentColorTheme = (this.currentColorTheme + 1) % this.colorThemes.length;
      this.initWordCloudChart();
    }
  }
}
</script>

<style scoped>
.word-cloud-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.word-cloud-card {
  border-radius: 8px;
  border: 1px solid #ebeef5;
  transition: all 0.3s;
}

.word-cloud-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.card-actions {
  float: right;
}

.controls {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 15px;
}

.chart-container {
  width: 100%;
  height: 500px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.word-info {
  margin-top: 15px;
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .chart-container {
    height: 350px;
  }
}
</style>
