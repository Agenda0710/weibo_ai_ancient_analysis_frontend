<template>
  <div class="hotword-container">
    <!-- 筛选区域 - 保持原有功能不变 -->
    <el-row>
      <el-col :span="24">
        <el-card class="filter-card">
          <el-form :model="form" class="filter-form">
            <el-form-item label="热词选择" class="filter-item">
              <el-select
                  v-model="selectedWord"
                  placeholder="请选择热词"
                  @change="fetchHotWordsData"
                  style="width: 300px"
              >
                <el-option
                    v-for="hotWord in hotWordsList"
                    :key="hotWord.word"
                    :label="hotWord.word"
                    :value="hotWord.word"
                >
                  <span>{{ hotWord.word }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热词详情展示 - 优化样式 -->
    <el-row v-if="selectedWordDetails">
      <el-col :span="24">
        <el-card class="detail-card">
          <div class="detail-content">
            <div class="detail-item">
              <span class="detail-label">词语:</span>
              <span class="detail-value">{{ selectedWordDetails.word }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">频率:</span>
              <span class="detail-value">{{ selectedWordDetails.frequency }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">情感:</span>
              <el-tag :type="getSentimentTagType(selectedWordDetails.sentiment)">
                {{ selectedWordDetails.sentiment }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评论表格 - 优化样式和交互 -->
    <el-row v-if="selectedWordDetails">
      <el-col :span="24">
        <el-card class="table-card">
          <el-table
              :data="allCommentsData"
              style="width: 100%"
              v-loading="loading"
              border
              stripe
              :default-sort="{prop: 'articleId', order: 'descending'}"
          >
            <el-table-column
                prop="articleId"
                label="文章ID"
                sortable
                width="120"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="authorName"
                label="评论用户"
                sortable
                width="150"
            >
            </el-table-column>
            <el-table-column
                prop="authorGender"
                label="评论性别"
                sortable
                width="120"
                align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.authorGender === 'f'">女</span>
                <span v-else-if="scope.row.authorGender === 'm'">男</span>
                <span v-else>{{ scope.row.authorGender }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="authorAddress"
                label="评论地址"
                sortable
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="content"
                label="评论内容"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="like_counts"
                label="点赞量"
                sortable
                width="120"
                align="center"
            >
              <template slot-scope="scope">
                <span class="like-count">{{ scope.row.like_counts }}</span>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <div class="pagination-wrapper">
            <el-pagination
                @current-change="handlePageChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                layout="total, prev, pager, next"
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
  name: "HotWordAnalysis",
  data() {
    return {
      form: {},
      selectedWord: '',
      hotWordsList: [],
      allCommentsData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false
    }
  },
  computed: {
    selectedWordDetails() {
      return this.hotWordsList.find(word => word.word === this.selectedWord);
    }
  },
  methods: {
    fetchHotWordsData() {
      this.loading = true;
      axios.get('/api/hotWords/', {
        params: {
          selectedWord: this.selectedWord,
          page: this.currentPage,
          pageSize: this.pageSize
        }
      })
          .then(response => {
            this.hotWordsList = response.data.hot_words_data || [];
            this.allCommentsData = response.data.allComments || [];
            this.total = response.data.total || 0;
          })
          .catch(error => {
            console.error('数据加载失败:', error);
          })
          .finally(() => {
            this.loading = false;
          });
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.fetchHotWordsData();
    },

    getSentimentTagType(sentiment) {
      if (!sentiment) return '';
      if (['正面', '积极'].includes(sentiment)) return 'success';
      if (['负面', '消极'].includes(sentiment)) return 'danger';
      if (['中性'].includes(sentiment)) return 'warning';
      return 'info';
    }
  },
  created() {
    this.fetchHotWordsData();
  }
}
</script>

<style scoped>
.hotword-container {
  padding: 20px;
}

/* 筛选区域样式 */
.filter-card {
  margin-bottom: 20px;
  border-radius: 6px;
}

.filter-form {
  display: flex;
  justify-content: center;
}

.filter-item {
  margin-bottom: 0;
}

/* 详情卡片样式 */
.detail-card {
  margin-bottom: 20px;
  border-radius: 6px;
}

.detail-content {
  display: flex;
  padding: 10px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.detail-label {
  font-weight: bold;
  margin-right: 8px;
  color: #606266;
}

.detail-value {
  color: #303133;
}

/* 表格卡片样式 */
.table-card {
  border-radius: 6px;
}

/* 点赞数列样式 */
.like-count {
  font-weight: bold;
  color: #f56c6c;
}

/* 分页器样式 */
.pagination-wrapper {
  margin-top: 20px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .detail-content {
    flex-direction: column;
  }

  .detail-item {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .filter-form {
    flex-direction: column;
    align-items: center;
  }
}
</style>
