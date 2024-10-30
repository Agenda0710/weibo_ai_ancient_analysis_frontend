<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-table
              :data="allArticleData"
              style="width: 100%;"
              v-loading="loading"
          >
            <el-table-column
                prop="articleId"
                label="文章 ID"
                sortable
            >
              <template slot-scope="scope">
                <el-button type="text" @click="viewArticle(scope.row.detailUrl)">
                  {{ scope.row.articleId }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
                prop="region"
                label="文章 IP"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="reposts_count"
                sortable
                label="转发"
            >
            </el-table-column>
            <el-table-column
                prop="like_count"
                sortable
                label="点赞量"
            >
            </el-table-column>
            <el-table-column
                prop="comment_count"
                sortable
                label="评论量"
            >
            </el-table-column>
            <el-table-column
                prop="type"
                sortable
                label="文章类型"
            >
            </el-table-column>
            <el-table-column
                prop="content"
                sortable
                label="文章内容"
                :width="300"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.content">{{ scope.row.content.substring(0, 100) }}...</div>
              </template>
            </el-table-column>
            <el-table-column
                prop="create_at"
                sortable
                label="发布时间"
            >
            </el-table-column>
            <el-table-column
                prop="judge"
                sortable
                label="情感分类"
            >
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
                @current-change="handlePageChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total"
            >
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PublicSentimentStatics",
  data() {
    return {
      allArticleData: [], // 存放文章数据
      total: 0,
      currentPage: 1,
      pageSize: 6,
      loading: true,
    };
  },
  methods: {
    fetchPublicSentimentData() {
      axios.get("/api/articles/", {
        params: {
          page: this.currentPage,
          page_size: this.pageSize,
        },
      }).then((response) => {
        this.loading = false
        this.allArticleData = response.data.data;
        this.total = response.data.total;
      });
    },
    viewArticle(url) {
      window.open(url, "_blank"); // 跳转到文章详情页
    },
    handlePageChange(page) {
      this.loading = true
      this.currentPage = page;
      this.fetchPublicSentimentData();
    },
  },
  created() {
    this.fetchPublicSentimentData();
  },
};
</script>

<style scoped>

</style>
