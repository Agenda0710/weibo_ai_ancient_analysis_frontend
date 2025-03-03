<template>
  <div>
    <!-- 文章地区分布图 -->
    <el-row>
      <el-card>
        <el-col :span="24">
          <div style="width:800px;height:600px;margin: 0 auto" ref="articleChart"></div>
          <div style="text-align:center; margin-top:10px; font-size:14px; color:#666;">
            地图来源：阿里云DataV高德地图&nbsp;&nbsp;&nbsp;审图号：2022 高德软件 GS京(2022)1061号
          </div>
        </el-col>
      </el-card>
    </el-row>

    <!-- 评论地区分布图 -->
    <el-row>
      <el-card>
        <el-col :span="24">
          <div style="width:800px;height:600px;margin: 0 auto" ref="commentChart"></div>
          <div style="text-align:center; margin-top:10px; font-size:14px; color:#666;">
            地图来源：阿里云DataV高德地图 &nbsp;&nbsp;&nbsp;审图号：2022 高德软件 GS京(2022)1061号
          </div>
        </el-col>
      </el-card>
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
      articleDataList: [],  // 文章地区统计数据
      commentDataList: []   // 评论地区统计数据
    }
  },
  methods: {
    // 获取文章和评论的地区统计数据
    fetchAllRegionData() {
      axios.get('/api/regionAnalysis/').then((response) => {
        this.articleDataList = response.data.articleDataList;
        this.commentDataList = response.data.commentDataList;

        // 在数据加载完成后，绘制两个地图
        this.drawArticleMap();
        this.drawCommentMap();
      });
    },

    // 绘制文章的中国地图
    drawArticleMap() {
      // 销毁已有的 ECharts 实例，避免重复初始化
      if (echarts.getInstanceByDom(this.$refs["articleChart"])) {
        echarts.dispose(this.$refs["articleChart"]);
      }

      var articleChart = echarts.init(this.$refs["articleChart"]);

      // 将 articleDataList 转换为适合 ECharts 地图的格式
      const articleMapData = this.articleDataList.map(item => {
        const region = item.region ? item.region : '';
        return {
          name: region.trim(),
          value: item.article_count
        };
      });

      // 获取文章数的最大值
      const maxArticleCount = Math.max(...articleMapData.map(item => item.value));

      var articleOption = {
        title: {
          text: '文章IP发布分析图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}篇文章'  // 显示地区名称和文章数
        },
        visualMap: {
          min: 0,
          max: maxArticleCount,  // 使用最大文章数作为 visualMap 的最大值
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#e0ffff', '#006edd']  // 颜色渐变
          }
        },
        series: [
          {
            name: '文章数',
            type: 'map',
            map: 'China',  // 确保地图名称与注册的名称一致
            label: {
              show: true
            },
            data: articleMapData  // 使用转换后的 mapData 数据
          }
        ]
      };

      // 设置文章地图的配置
      articleChart.setOption(articleOption);
    },

    // 绘制评论的中国地图
    drawCommentMap() {
      // 销毁已有的 ECharts 实例，避免重复初始化
      if (echarts.getInstanceByDom(this.$refs["commentChart"])) {
        echarts.dispose(this.$refs["commentChart"]);
      }

      var commentChart = echarts.init(this.$refs["commentChart"]);

      // 将 commentDataList 转换为适合 ECharts 地图的格式
      const commentMapData = this.commentDataList.map(item => {
        const region = item.region ? item.region : '';
        return {
          name: region.trim(),
          value: item.comment_count
        };
      });

      // 获取评论数的最大值
      const maxCommentCount = Math.max(...commentMapData.map(item => item.value));

      var commentOption = {
        title: {
          text: '评论IP发布分析图',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}条评论'  // 显示地区名称和评论数
        },
        visualMap: {
          min: 0,
          max: maxCommentCount,  // 使用最大评论数作为 visualMap 的最大值
          left: 'left',
          top: 'bottom',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: ['#ffe0b2', '#ff5722']  // 颜色渐变
          }
        },
        series: [
          {
            name: '评论数',
            type: 'map',
            map: 'China',  // 确保地图名称与注册的名称一致
            label: {
              show: true
            },
            data: commentMapData  // 使用转换后的 commentMapData 数据
          }
        ]
      };

      // 设置评论地图的配置
      commentChart.setOption(commentOption);
    }
  },

  mounted() {
    // 显示加载动画
    const articleChart = echarts.init(this.$refs["articleChart"]);
    const commentChart = echarts.init(this.$refs["commentChart"]);

    articleChart.showLoading();
    commentChart.showLoading();

    // 获取地图数据并注册中国地图
    getChineseMap.then(res => {
      articleChart.hideLoading();
      commentChart.hideLoading();

      echarts.registerMap('China', res.data);  // 注册中国地图

      // 获取统计数据
      this.fetchAllRegionData();  // 在地图加载完成后再获取数据
    });
  }
}
</script>

<style scoped>
/* 可根据需要自定义样式 */
</style>
