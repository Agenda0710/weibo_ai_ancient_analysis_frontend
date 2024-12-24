<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246); position: fixed; height: 100vh;">
        <el-menu :default-openeds="['1', '2', '3','4','5','6','7']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>首页</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="1-1" @click="$router.push('/dashBoard')">首页</el-menu-item>
              <el-menu-item index="1-2" @click="$router.push('/hotWords')">热词统计</el-menu-item>
              <el-menu-item index="1-3" @click="$router.push('/publicSentimentStatics')">微博文章数据统计</el-menu-item>
              <el-menu-item index="1-4" @click="$router.push('/getWeiboSearch')">特定词分析</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>可视化</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="2-1" @click="$router.push('/articleAnalysis')">文章分析</el-menu-item>
              <el-menu-item index="2-2" @click="$router.push('/regionAnalysis')">IP分析</el-menu-item>
              <el-menu-item index="2-3" @click="$router.push('/commentAnalysis')">评论分析</el-menu-item>
              <el-menu-item index="2-4" @click="$router.push('/sentimentAnalysis')">舆情分析</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>词云图</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="3-1" @click="$router.push('/articleContentWordCloud')">文章内容词云图</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-collection"></i>实时资讯</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="4-1" @click="$router.push('/hotSearchAnalysis')">热搜分析</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="4-2" @click="$router.push('/currentNewsAnalysis')">新闻分析</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="4-2" @click="$router.push('/currentPoliciesAnalysis')">政策分析</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-edit"></i>内容检测</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="5-1" @click="$router.push('/weiboContentFakeOrTruePredictor')">谣言检测
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="5-2" @click="$router.push('/predictJunkInformation')">欺诈信息检测</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index=6>
            <template slot="title"><i class="el-icon-folder-add"></i>数据采集</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="6-1" @click="$router.push('/collectData')">爬虫自动化</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title"><i class="el-icon-s-grid"></i>数据大屏</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="7-1" @click="$router.push('/dataViews')">大屏展示</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container style="margin-left: 200px;">
        <el-header>
          面向人工智能行业的数据洞察与可视化分析平台
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

</script>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}


</style>
