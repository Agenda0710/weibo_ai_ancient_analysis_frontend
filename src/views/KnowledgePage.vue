<template>
  <div class="knowledge-page">
    <!-- 标题部分 -->
    <div class="title-section">
      <h1>中华自然科学及优秀文化瑰宝</h1>
      <p>弘扬中华优秀自然科学成就与文化传承</p>
    </div>

    <!-- 第一排内容：中国古代自然科学成就 -->
    <el-row :gutter="20" class="content-section equal-height">
      <!-- 中国古代自然科学成就 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>中国古代自然科学成就</h2>
          <p>
            中国古代在天文学、数学、医学、农学等领域取得了辉煌成就：
          </p>
          <ul>
            <li><strong>天文学：</strong>发明了浑天仪、地动仪等天文仪器。</li>
            <li><strong>数学：</strong>《九章算术》奠定了古代数学的基础。</li>
            <li><strong>医学：</strong>《黄帝内经》奠定了中医理论体系。</li>
            <li><strong>农学：</strong>《齐民要术》总结了古代农业技术。</li>
          </ul>
          <img src="@/assets/science_achievements.png" alt="中国古代自然科学成就" class="content-image"/>
        </div>
      </el-col>
      <!-- 中国古代杰出科学家 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>中国古代杰出科学家</h2>
          <p>
            中国古代涌现了许多伟大的科学家，他们的贡献影响深远：
          </p>
          <ul>
            <li><strong>张衡：</strong>发明地动仪，研究天文历法。</li>
            <li><strong>祖冲之：</strong>精确计算圆周率，推动数学发展。</li>
            <li><strong>李时珍：</strong>编撰《本草纲目》，奠定中医药学基础。</li>
            <li><strong>沈括：</strong>著有《梦溪笔谈》，涉及多学科领域。</li>
          </ul>
          <img src="@/assets/scientists.png" alt="中国古代杰出科学家" class="content-image"/>
        </div>
      </el-col>
    </el-row>

    <!-- 第二排内容：中国古代自然科学著作与优秀文化传承 -->
    <el-row :gutter="20" class="content-section equal-height">
      <!-- 中国古代自然科学著作 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>中国古代自然科学著作</h2>
          <p>
            中国古代留下了许多重要的自然科学专著，记录了丰富的知识：
          </p>
          <ul>
            <li><strong>《九章算术》：</strong>古代数学经典，解决实际问题。</li>
            <li><strong>《黄帝内经》：</strong>中医理论奠基之作。</li>
            <li><strong>《梦溪笔谈》：</strong>涵盖天文、地理、物理等领域的综合性著作。</li>
            <li><strong>《天工开物》：</strong>详细记录了古代手工业和农业技术。</li>
          </ul>
          <img src="@/assets/science_books.png" alt="中国古代自然科学著作" class="content-image"/>
        </div>
      </el-col>
      <!-- 中国古代优秀文化传承 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>中国古代优秀文化传承</h2>
          <p>
            中华优秀文化不仅体现在自然科学成就上，还涵盖了哲学、艺术、教育等领域：
          </p>
          <ul>
            <li><strong>哲学：</strong>儒家、道家思想对后世影响深远。</li>
            <li><strong>艺术：</strong>书法、绘画、陶瓷等艺术形式独具特色。</li>
            <li><strong>教育：</strong>科举制度推动了古代学术发展。</li>
            <li><strong>科技：</strong>四大发明（造纸术、印刷术、火药、指南针）改变世界。</li>
          </ul>
          <img src="@/assets/culture_heritage.png" alt="中国古代优秀文化传承" class="content-image"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "KnowledgePage",
};
</script>

<style scoped>
.knowledge-page {
  padding: 20px;
  background-color: #f9f9f9;
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
}

.title-section h1 {
  font-size: 28px;
  color: #333;
}

.title-section p {
  font-size: 16px;
  color: #666;
}

.content-section {
  margin-bottom: 30px;
}

.equal-height {
  display: flex;
}

.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-block {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  text-align: left;
}

.content-block h2 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #409eff;
}

.content-block p {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.content-block ul {
  margin: 10px 0 0;
  padding-left: 20px;
  list-style-type: disc;
  line-height: 2;
}

.content-block ul li {
  font-size: 14px;
  color: #666;
}

/* 图片样式优化 */
.content-image {
  width: 100%;
  height: 300px; /* 增加图片高度 */
  object-fit: contain; /* 确保图片完整显示 */
  margin-top: 15px;
  border-radius: 5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-image {
    height: 200px; /* 在小屏幕下缩小图片高度 */
  }
}
</style>
