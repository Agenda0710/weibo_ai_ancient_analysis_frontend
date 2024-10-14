<template>
  <div>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '2', '3']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>首页</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="1-1" @click="$router.push('/dashBoard')">首页</el-menu-item>
              <el-menu-item index="1-2" @click="$router.push('/hotWords')">热词统计</el-menu-item>
              <el-menu-item index="1-3" @click="$router.push('/publicSentimentStatics')">微博舆情统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>数据可视化</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="2-1" @click="$router.push('/articleAnalysis')">文章分析</el-menu-item>
              <el-menu-item index="2-2" @click="$router.push('/regionAnalysis')">IP分析</el-menu-item>
              <el-menu-item index="2-3">评论分析</el-menu-item>
              <el-menu-item index="2-4">舆情分析</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>词云图</template>
            <el-menu-item-group v-show='true'>
              <el-menu-item index="3-1">文章内容词云图</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          微博舆情分析
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
  text-align: center;
  line-height: 60px;
}
</style>
