<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>总文章个数</span>
          </div>
          <div class="text-center">
            <h5>{{ totalArticles }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最高点赞量——作者</span>
          </div>
          <div class="text-center">
            <h5>{{ topLikedAuthor }}</h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最多城市</span>
          </div>
          <div class="text-center">
            <h5>{{ topCity }}</h5>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-card style="margin-right: 10px">
          <div slot="header" class="clearfix">
            <span>评论点赞量 Top Four</span>
          </div>
          <el-table :data="topCommentsList" border style="width: 100%;height: 340px">
            <el-table-column label="昵称" prop="authorname" width="180">
            </el-table-column>
            <el-table-column label="评论" prop="content">
            </el-table-column>
            <el-table-column label="点赞数" prop="like_counts" align="center" width="120">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="articleCountChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-card style="margin-right: 10px">
          <div>
            <div id="articleTypePieChart" style="width: 600px; height: 400px;"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="word-cloud" style="width: 600px; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import {Loading} from "element-ui";

export default {
  name: "DashBoard",
  data() {
    return {
      totalArticles: 0,
      topLikedAuthor: '',
      topCity: '',
      topCommentsList: [],
      data: [],
      articleCountOfDate: [],
      articleTypeData: [],
      wordCloudData: []
    };
  },
  methods: {
    fetchArticleStatistics() {
      let loadingInstance = Loading.service({fullscreen: true});
      axios.get('/api/article_statistics/')
          .then(response => {
            this.totalArticles = response.data.total_articles;
            this.topLikedAuthor = response.data.top_liked_author;
            this.topCity = response.data.top_city;
            this.topCommentsList = response.data.top_comments_list; // 获取点赞量Top Four的评论数据
            this.dates = response.data.dates;
            this.counts = response.data.counts;
            this.renderLineChart();
            this.articleTypeData = response.data.article_type_data;
            this.renderPieChart();
            this.wordCloudData = response.data.wordcloud_data;
            this.renderWordCloud();
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
            });
          })
          .catch(error => {
            console.error("Error fetching article statistics:", error);
          });
    },
    renderLineChart() {
      var chartDom = document.getElementById('articleCountChart');
      var myChart = echarts.init(chartDom);
      var option = {
        title: {
          text: '文章发布时间的个数'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dates,  // 从后端获取的日期
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.counts,  // 从后端获取的文章数
            type: 'line',
            areaStyle: {},
          },
        ],
      };
      option && myChart.setOption(option);
    },
    renderPieChart() {
      var chartDom = document.getElementById('articleTypePieChart');
      var myChart = echarts.init(chartDom);
      var option = {
        title: {
          text: '微博文章分类图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '微博文章分类图',
            type: 'pie',
            radius: '50%',
            data: this.articleTypeData,
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
      option && myChart.setOption(option);
    },
    renderWordCloud() {
      var chartDom = document.getElementById('word-cloud');
      var myChart = echarts.init(chartDom);
      var option = {
        title: {
          text: '评论区用户名词云图'
        },
        series: [
          {
            type: 'wordCloud',
            sizeRange: [20, 500],
            rotationRange: [-90, 90],
            gridSize: 8,
            shape: 'circle',
            textStyle: {
              color: () => `rgb(${Math.random() * 160}, ${Math.random() * 160}, ${Math.random() * 160})`,
            },
            data: this.wordCloudData
          }
        ]
      };
      option && myChart.setOption(option);
    }
  },
  created() {
    this.fetchArticleStatistics();
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}


.text-center {
  text-align: left;
  padding: 5px 0;
}

.box-card {
  margin: 10px;
  text-align: left;
  height: 150px;
}
</style>

