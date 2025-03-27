<template>
  <div class="sentiment-container">
    <el-row>
      <el-col :span="24">
        <el-card class="table-card" shadow="hover">
          <div slot="header" class="card-header">
            <h3><i class="el-icon-document"></i> 舆情文章统计</h3>
            <div class="header-actions">
              <el-select
                  v-model="pageSize"
                  @change="handlePageSizeChange"
                  size="small"
                  style="width: 100px; margin-right: 10px;"
              >
                <el-option
                    v-for="size in pageSizeOptions"
                    :key="size"
                    :label="`${size}条/页`"
                    :value="size"
                />
              </el-select>
            </div>
          </div>

          <el-table
              :data="allArticleData"
              style="width: 100%;"
              v-loading="loading"
              border
              stripe
              highlight-current-row
              class="sentiment-table"
              @sort-change="handleSortChange"
          >
            <el-table-column
                prop="articleId"
                label="文章ID"
                sortable="custom"
                width="120"
                align="center"
            >
              <template slot-scope="scope">
                <el-button
                    type="text"
                    @click="viewArticle(scope.row.detailUrl)"
                    style="color: #409EFF;"
                >
                  {{ scope.row.articleId }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column
                prop="region"
                label="IP属地"
                sortable="custom"
                width="120"
                align="center"
            >
              <template slot-scope="scope">
                <el-tag effect="plain">{{ scope.row.region }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
                prop="reposts_count"
                label="转发"
                sortable="custom"
                width="100"
                align="center"
            >
              <template slot-scope="scope">
                <span class="count-text">{{ scope.row.reposts_count }}</span>
              </template>
            </el-table-column>

            <el-table-column
                prop="like_count"
                label="点赞"
                sortable="custom"
                width="100"
                align="center"
            >
              <template slot-scope="scope">
                <span class="count-text" style="color: #F56C6C;">{{ scope.row.like_count }}</span>
              </template>
            </el-table-column>

            <el-table-column
                prop="comment_count"
                label="评论"
                sortable="custom"
                width="100"
                align="center"
            >
              <template slot-scope="scope">
                <span class="count-text" style="color: #67C23A;">{{ scope.row.comment_count }}</span>
              </template>
            </el-table-column>

            <el-table-column
                prop="content_length"
                label="字数"
                sortable="custom"
                width="100"
                align="center"
            >
              <template slot-scope="scope">
                <el-tag type="info">{{ scope.row.content_length }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
                prop="content"
                label="内容摘要"
                :show-overflow-tooltip="true"
                min-width="270"
            >
              <template slot-scope="scope">
                <div class="content-preview" @click="showContentDetail(scope.row.content)">
                  {{ scope.row.content | truncate(100) }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
                prop="create_at"
                label="发布时间"
                sortable="custom"
                width="160"
                align="center"
            >
              <template slot-scope="scope">
                <span class="time-text">{{ scope.row.create_at | formatTime }}</span>
              </template>
            </el-table-column>

            <el-table-column
                prop="judge"
                label="情感分析"
                sortable="custom"
                width="100"
                align="center"
            >
              <template slot-scope="scope">
                <el-tag
                    :type="getSentimentType(scope.row.judge)"
                    effect="dark"
                >
                  {{ scope.row.judge }}
                </el-tag>
              </template>
            </el-table-column>

          </el-table>

          <div class="pagination-container">
            <el-pagination
                @size-change="handlePageSizeChange"
                @current-change="handlePageChange"
                :current-page="currentPage"
                :page-sizes="pageSizeOptions"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 内容详情对话框 -->
    <el-dialog
        title="文章内容详情"
        :visible.sync="contentDialogVisible"
        width="60%"
    >
      <div class="content-detail">{{ currentContent }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contentDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyContent">复制内容</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PublicSentimentStatics",
  filters: {
    truncate(value, length) {
      if (!value) return '';
      if (value.length <= length) return value;
      return value.substring(0, length) + '...';
    },
    formatTime(value) {
      if (!value) return '';
      return new Date(value).toLocaleString();
    }
  },
  data() {
    return {
      allArticleData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizeOptions: [6, 10, 20, 50],
      loading: true,
      sortParams: {},
      contentDialogVisible: false,
      currentContent: '',
    };
  },
  methods: {
    fetchPublicSentimentData() {
      this.loading = true;
      const params = {
        page: this.currentPage,
        page_size: this.pageSize,
        ...this.sortParams
      };

      axios.get("/api/articles/", { params })
          .then((response) => {
            this.allArticleData = response.data.data;
            this.total = response.data.total;
          })
          .catch(error => {
            this.$message.error('数据加载失败: ' + error.message);
          })
          .finally(() => {
            this.loading = false;
          });
    },

    viewArticle(url) {
      if (url) {
        window.open(url, "_blank");
      } else {
        this.$message.warning('该文章暂无详情链接');
      }
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.fetchPublicSentimentData();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1; // 重置为第一页
      this.fetchPublicSentimentData();
    },

    handleSortChange({ prop, order }) {
      if (order) {
        this.sortParams = {
          sort_by: prop,
          sort_order: order === 'ascending' ? 'asc' : 'desc'
        };
      } else {
        this.sortParams = {};
      }
      this.fetchPublicSentimentData();
    },

    refreshData() {
      this.currentPage = 1;
      this.fetchPublicSentimentData();
    },

    showContentDetail(content) {
      this.currentContent = content || '无内容';
      this.contentDialogVisible = true;
    },

    copyContent() {
      const textarea = document.createElement('textarea');
      textarea.value = this.currentContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$message.success('内容已复制到剪贴板');
    },

    handleAnalyze(row) {
      this.$message.info(`开始分析文章: ${row.articleId}`);
      // 这里可以添加实际的分析逻辑
    },

    getSentimentType(judge) {
      const map = {
        '正面': 'success',
        '中性': 'warning',
        '负面': 'danger',
        '积极': 'success',
        '消极': 'danger'
      };
      return map[judge] || 'info';
    }
  },
  created() {
    this.fetchPublicSentimentData();
  }
};
</script>

<style scoped>
.sentiment-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.table-card {
  border-radius: 8px;
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
}

.card-header h3 i {
  margin-right: 10px;
  color: #409EFF;
}

.header-actions {
  display: flex;
  align-items: center;
}

.sentiment-table {
  margin-top: 10px;
}

.count-text {
  font-weight: bold;
  font-size: 14px;
}

.time-text {
  color: #909399;
  font-size: 13px;
}

.content-preview {
  cursor: pointer;
  line-height: 1.5;
  color: #606266;
}

.content-preview:hover {
  color: #409EFF;
}

.content-detail {
  max-height: 60vh;
  overflow-y: auto;
  line-height: 1.8;
  white-space: pre-wrap;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    margin-top: 10px;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
