<template>
  <div>
    <el-col :span="24">
      <el-card>
        <div style="width:100%;height:400px;margin: 0 auto" ref="wordCloudChart"></div>
      </el-card>
    </el-col>
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
      wordCloudData: []
    }
  },
  mounted() {
    this.fetchWordCloudData();
  },
  methods: {
    fetchWordCloudData() {
      axios.get('/api/articleContentWordCloud/').then(response => {
        this.wordCloudData = response.data.word_cloud;
        this.initWordCloudChart();
      })
    },
    initWordCloudChart() {
      const chartDom = this.$refs.wordCloudChart;
      const myChart = echarts.init(chartDom);

      // 格式化词云数据
      const formattedData = this.wordCloudData.map(item => ({
        name: item[0],  // 词语
        value: item[1]  // 词频
      }));

      const option = {
        tooltip: {
          // 设置tooltip显示内容，展示词语名称和对应的词频（value值）
          formatter: function (params) {
            return `${params.name} : ${params.value}`;
          }
        },
        series: [{
          type: 'wordCloud',
          gridSize: 30,
          sizeRange: [12, 50],
          rotationRange: [-90, 90],
          shape: 'circle',
          textStyle: {
            color: () => `rgb(${Math.random() * 160}, ${Math.random() * 160}, ${Math.random() * 160})`,
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: formattedData  // 词云数据
        }]
      };
      myChart.setOption(option);
    }
  }
}
</script>

<style scoped>

</style>
