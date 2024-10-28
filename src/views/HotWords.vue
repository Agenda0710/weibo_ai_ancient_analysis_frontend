<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-form :model="form">
            <el-form-item label="热词选择">
              <el-select v-model="selectedWord" placeholder="热词选择" @change="fetchHotWordsData">
                <el-option
                    v-for="hotWord in hotWordsList"
                    :key="hotWord.word"
                    :label="hotWord.word"
                    :value="hotWord.word"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row v-if="selectedWordDetails">
      <el-col :span="24">
        <el-card>
          <p>词语: {{ selectedWordDetails.word }}</p>
          <p>频率: {{ selectedWordDetails.frequency }}</p>
          <p>情感: {{ selectedWordDetails.sentiment }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row v-if="selectedWordDetails">
      <el-col :span="24">
        <el-card>
          <el-table
              :data="allCommentsData"
              style="width: 100%"
              :default-sort="{prop: 'articleId', order: 'descending'}"
          >
            <el-table-column
                prop="articleId"
                label="文章ID"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="authorName"
                label="评论用户"
                sortable
            >
            </el-table-column>
            <!--f为女性，m为男性-->
            <el-table-column
                prop="authorGender"
                sortable
                label="评论性别"
            >
            </el-table-column>
            <el-table-column
                prop="authorAddress"
                sortable
                label="评论地址"
            >
            </el-table-column>
            <el-table-column
                prop="authorAddress"
                sortable
                label="评论地址"
            >
            </el-table-column>
            <el-table-column
                prop="content"
                sortable
                label="评论内容"
            >
            </el-table-column>
            <el-table-column
                prop="like_counts"
                sortable
                label="点赞量"
            >
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
                @current-change="handlePageChange"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total">
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
  data() {
    return {
      form: {},
      selectedWord: '',
      hotWordsList: [],
      allCommentsData: [],  // 评论数据
      currentPage: 1,  // 当前页码
      pageSize: 10,  // 每页显示数量
      total: 0,  // 总评论数量
    }
  },
  computed: {
    selectedWordDetails() {
      return this.hotWordsList.find(word => word.word === this.selectedWord);
    }

  },
  methods: {
    fetchHotWordsData() {
      axios.get('/api/hotWords/', {
        params: {
          selectedWord: this.selectedWord,
          page: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(response => {
        this.hotWordsList = response.data.hot_words_data;
        this.allCommentsData = response.data.allComments;
        this.total = response.data.total;
      }).catch(error => {
        console.error(error);
      })
    },
    // 页码变化时获取数据
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchHotWordsData();
    }
  },
  created() {
    this.fetchHotWordsData();
  }
}
</script>

<style>
/* 可根据需要添加样式 */
</style>
