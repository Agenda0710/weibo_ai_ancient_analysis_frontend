<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div style="width:100%;height:400px" ref="likesChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12" style="margin-right: 10px">
        <el-card>
          <div>
            <div style="width:100%; height: 400px;" ref="genderPieChart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="11">
        <el-card>
          <div>
            <div style="width: 100%; height: 400px;" ref="wordCloudChart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from "axios";

export default {
  name: "LikesAnalysis",
  data() {
    return {
      likeData: [],  // 点赞区间的评论数数据
      genderData: [],
      wordData: []
    }
  },
  methods: {
    // 获取点赞区间数据
    fetchLikesData() {
      axios.get('/api/commentsAnalysis/').then((response) => {
        this.likeData = response.data.data;
        this.genderData = response.data.gender_data;
        this.wordData = response.data.word_data;
        this.drawChart();  // 数据加载完成后绘制图表
        this.renderGenderPieChart();
        this.renderWordCloudChart();
      });
    },
    // 绘制点赞折线图
    drawChart() {
      var likesChart = echarts.init(this.$refs["likesChart"]);

      // 提取横轴数据（点赞区间）和纵轴数据（评论数）
      const likeRanges = this.likeData.map(item => item.like_range);
      const commentCounts = this.likeData.map(item => item.comment_count);

      var option = {
        title: {
          text: '点赞区间的评论数折线图',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            return params[0].axisValue + ': ' + params[0].data + ' 条评论';
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: likeRanges,  // 横轴为点赞区间
          axisLabel: {
            rotate: 45  // 旋转以适应长标签
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,  // 保证Y轴最小间隔为1
          name: '评论数'
        },
        dataZoom: [
          {
            type: 'slider',  // 使横轴可以拖动
            xAxisIndex: 0
          },
          {
            type: 'inside',
            xAxisIndex: 0
          }
        ],
        series: [{
          name: '评论数',
          type: 'line',
          smooth: true,
          data: commentCounts  // 纵轴为评论数
        }]
      };
      likesChart.setOption(option);
    },
    // 绘制性别分布饼状图
    renderGenderPieChart() {
      const myChart = echarts.init(this.$refs.genderPieChart);
      const option = {
        title: {
          text: '评论区性别比例',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Gender',
            type: 'pie',
            radius: '50%',
            data: this.genderData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option);
    },

    // 绘制词云图
    renderWordCloudChart() {
      const myChart = echarts.init(this.$refs.wordCloudChart);
      const option = {
        title: {
          text: '评论内容词云图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'wordCloud',
          gridSize: 30,
          sizeRange: [12, 60],
          rotationRange: [-90, 90],
          shape: 'circle',
          width: 600,
          height: 400,
          drawOutOfBound: true,
          textStyle: {
            color: () => `rgb(${Math.random() * 160}, ${Math.random() * 160}, ${Math.random() * 160})`,
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: this.wordData
        }]
      };
      myChart.setOption(option);
    }
  },
  mounted() {
    // 组件加载时获取数据并绘制图表
    this.fetchLikesData();
  }
}
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>

