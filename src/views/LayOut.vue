<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246); position: fixed; height: 100vh;">
        <el-menu :default-openeds="['1', '2', '3','4','5','6']">
          <!-- 数据总览 -->
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-s-data"></i>数据总览</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="$router.push('/dashBoard')">平台首页</el-menu-item>
              <el-menu-item index="1-2" @click="$router.push('/publicSentimentStatics')">文章数据集</el-menu-item>
              <el-menu-item index="1-3" @click="$router.push('/knowledgePage')">文化百科</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 智慧分析 -->
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-magic-stick"></i>智慧分析</template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="$router.push('/articleAnalysis')">文章解析</el-menu-item>
              <el-menu-item index="2-2" @click="$router.push('/commentAnalysis')">评论洞察</el-menu-item>
              <el-menu-item index="2-3" @click="$router.push('/regionAnalysis')">地域分布</el-menu-item>
              <el-menu-item index="2-4" @click="$router.push('/hotWords')">热词云图</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 可视化引擎 -->
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-pie-chart"></i>可视化引擎</template>
            <el-menu-item-group>
              <el-menu-item index="3-1" @click="$router.push('/tech-hotspot-graph')">文化焦点图谱</el-menu-item>
              <el-menu-item index="3-2" @click="$router.push('/articleContentWordCloud')">内容词云</el-menu-item>
              <el-menu-item index="3-3" @click="$router.push('/sentimentAnalysis')">舆情研判</el-menu-item>
              <el-menu-item index="3-4" @click="$router.push('/getWeiboSearch')">专题聚焦</el-menu-item>
              <!-- 新增时空穿越菜单项 -->
              <el-menu-item index="3-5" @click="$router.push('/time-travel')">时空穿越对比</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 政文观测 -->
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-news"></i>政文观测</template>
            <el-menu-item-group>
              <el-menu-item index="4-1" @click="$router.push('/currentNewsAnalysis')">新闻快报</el-menu-item>
              <el-menu-item index="4-2" @click="$router.push('/currentPoliciesAnalysis')">政策要闻</el-menu-item>
              <!--              <el-menu-item index="4-3" @click="$router.push('/hotSearchAnalysis')">热搜追踪</el-menu-item>-->
            </el-menu-item-group>
          </el-submenu>

          <!-- 内容安检 -->
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-lock"></i>内容安检</template>
            <el-menu-item-group>
              <el-menu-item index="5-1" @click="$router.push('/weiboContentFakeOrTruePredictor')">谣言防火墙</el-menu-item>
              <el-menu-item index="5-2" @click="$router.push('/predictJunkInformation')">欺诈过滤器</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 全景视图 -->
          <el-submenu index="6">
            <template slot="title"><i class="el-icon-monitor"></i>全景视图</template>
            <el-menu-item-group>
              <!--              <el-menu-item index="6-1" @click="$router.push('/collectData')">智能采集器</el-menu-item>-->
              <el-menu-item index="6-2" @click="$router.push('/dataViews')">数据大屏</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container style="margin-left: 200px;">
        <el-header>
          智汇古今——面向中华自然科学与优秀文化可视化分析平台
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  // 保留原有脚本逻辑
}
</script>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-aside {
  color: #333;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  font-size: 14px;
  padding: 0 45px !important;
}
</style>
