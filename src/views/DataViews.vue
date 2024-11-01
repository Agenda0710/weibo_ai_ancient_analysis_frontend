<template>
  <div class="bg">
    <dv-border-box-11 title="数据中心" @click="$router.push('/dashBoard')" style="width: 100%;height: 45rem">
      <dv-full-screen-container>
        <div class="naca">
          <div class="left">
            <div class="left-1">
              <dv-border-box-8>
                <!-- 左下 编号6 词云图 -->
                <h5>央视新闻词云图</h5>
                <div ref="wordCloud" style="width:350px;height:180px;"/>
              </dv-border-box-8>
            </div>
            <div class="left-1">
              <dv-border-box-10>
                <dv-digital-flop class="dv-dig-flop ml-1 mt-2 pl-3" :config="commentCount"/>
                <dv-decoration-1 style="width:350px;height:10px;"/>
              </dv-border-box-10>
            </div>
            <div class="left-1">
              <!-- 左上 -->
              <dv-decoration-9 style="width:350px;height:200px">
                <dv-decoration-11 style="width:200px;height:60px;">数据信息</dv-decoration-11>
              </dv-decoration-9>
            </div>
          </div>
          <div class="cents">
            <div class="cent">
              <dv-border-box-1>
                <!-- 评论情感分析表格 编号3 中上 -->
                <dv-scroll-board :config="tableData" style="width:100%;height:100%"/>
                <dv-decoration-5 style="width:700px;height:10px;"/>
              </dv-border-box-1>
            </div>
            <div class="cent-1">
              <dv-border-box-1>
                <!-- 新闻类别排名 编号4 中下 -->
                <dv-scroll-ranking-board :config="newsCategoryCounts"
                                         style="width:650px;height:180px; margin-left:20px; margin-top: 20px;"/>
              </dv-border-box-1>
            </div>
          </div>
          <div class="left">
            <div class="left-1">
              <dv-border-box-1>
                <!-- 小飞机（新闻分类） 编号4  右下 -->
                <dv-conical-column-chart :config="newsCategoryCountsPlane" style="width:350px;height:200px;"/>
                <dv-decoration-8 :reverse="true" style="width:350px;height:20px;"/>
              </dv-border-box-1>
            </div>
            <div class="left-1">
              <!-- 右中 新闻饼图 -->
              <dv-decoration-12 style="width:350px;height:200px">
                <dv-active-ring-chart :config="weiboArticleType"
                                      style="width:350px;height:200px"/>
              </dv-decoration-12>
            </div>
            <div class="left-1">
              <dv-border-box-1>
                <!-- 新闻情感胶囊图 编号5 右上 -->
                <dv-capsule-chart :config="newsSentiment" style="width:300px;height:200px"/>
                <dv-decoration-9 style="width:350px;height:10px;"></dv-decoration-9>
              </dv-border-box-1>
            </div>
          </div>
        </div>
      </dv-full-screen-container>
    </dv-border-box-11>
  </div>
</template>

<script>
import axios from "axios";
import * as echarts from 'echarts';
import 'echarts-wordcloud'
import {Loading} from 'element-ui';

export default {
  name: 'DataViews',
  data() {
    return {
      weiboArticleType: {
        data: [],
      },
      newsCategoryCounts: {
        data: []
      },
      newsSentiment: {
        data: [],
        colors: ['#628ae0', '#b4fb72', '#e690d1'],
        showValue: true
      },
      newsCategoryCountsPlane: {
        data: [],
        img: [
          'http://datav.jiaminghi.com/img/conicalColumnChart/1st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/2st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/3st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/4st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/5st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/6st.png',
          'http://datav.jiaminghi.com/img/conicalColumnChart/7st.png'
        ]
      },
      tableData: {
        header: ['评论内容', '地区', '情感分析'],
        data: [],
        index: true,
        columnWidth: [50],
        align: ['center']
      },
      newsWordCloudData: [],
      commentCount: {
        number: [100],
        content: '微博评论{nt}条'
      },
    }
  },
  methods: {
    // 获取表格数据
    fetchTableData() {
      axios.get('/api/getDataViews/').then(response => {
        let loadingInstance = Loading.service({fullscreen: true});
        // 渲染表格数据（评论数据）
        const commentList = response.data.comment_list;
        const newTableData = commentList.map(item => [item.comments_content, item.comments_region, item.sentiments_analysis]);
        this.tableData = {...this.tableData, data: newTableData}

        // 渲染环图数据（微博文章分类）
        const newWeiboArticleType = response.data.article_type_list.map(item => ({
          'name': item.type,
          'value': item.value
        }));
        this.weiboArticleType = {...this.weiboArticleType, data: newWeiboArticleType}

        // 排名图数据（新闻类别）
        const newNewsCategoryCounts = [];
        for (const type in response.data.news_category_counts) {
          newNewsCategoryCounts.push({
            name: type,
            value: response.data.news_category_counts[type]
          });
        }
        this.newsCategoryCounts = {
          ...this.newsCategoryCounts, data: newNewsCategoryCounts
        };
        this.newsCategoryCountsPlane = {
          ...this.newsCategoryCounts, data: newNewsCategoryCounts.slice(0, 7)
        };

        // 词云图数据（新闻词频）
        this.newsWordCloudData = response.data.news_wordcloud_data.map(item => ({
          'name': item.name,
          'value': item.value,
        }));
        this.initWordCloud();

        // 胶囊图数据（新闻情感）
        const newNewsSentiments = [];
        for (const sentiment in response.data.news_sentiments_statistic) {
          newNewsSentiments.push({
            name: sentiment,
            value: response.data.news_sentiments_statistic[sentiment]
          })
        }
        this.newsSentiment = {...this.newsSentiment, data: newNewsSentiments};

        // 翻拍器数据（评论和文章数量）
        this.commentCount = {...this.commentCount, number: [response.data.comment_count]}

        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    },
    initWordCloud() {
      // 初始化 ECharts 词云图
      const chart = echarts.init(this.$refs.wordCloud);
      const option = {
        series: [{
          type: 'wordCloud',
          title: '新闻词云图',
          shape: 'circle',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: () => `rgb(${Math.random() * 160}, ${Math.random() * 160}, ${Math.random() * 160})`
          },
          data: this.newsWordCloudData
        }]
      };
      chart.setOption(option);
    }
  },
  created() {
    this.fetchTableData();
  }
}
</script>
<style>
.cent {
  margin: 10px;
  width: 700px;
  height: 412px;
  /* background-color: blueviolet; */
}

.cent-1 {
  margin: 10px;
  color: aliceblue;
  width: 700px;
  height: 200px;
  /* background-color: rgb(26, 26, 133); */
}

.left {
  display: flex;
  flex-direction: column-reverse;
}

.left-1 {
  margin: 15px;
  color: aliceblue;
  width: 350px;
  height: 200px;
  /* background-color: rgb(26, 26, 133); */
}

.naca {
  width: 100%;
  height: 40rem;
  /* padding: 120px; */
  margin: 80px 24px;
  /* background-color: aquamarine; */
  display: flex;
}

.bg {
  width: 100%;
  height: 45rem;
  background-color: black;
  position: relative;
}
</style>
