<template>
  <div class="knowledge-container">
    <div class="header-section">
      <h1 class="main-title">中华自然科学及优秀文化瑰宝</h1>
      <p class="sub-title">弘扬中华优秀自然科学成就与文化传承</p>
      <el-divider></el-divider>
    </div>

    <!-- 内容区块 -->
    <div class="content-grid">
      <!-- 第一行 -->
      <el-row :gutter="24" class="content-row">
        <!-- 中国古代自然科学成就 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" class="content-col">
          <el-card shadow="hover" class="content-card">
            <div slot="header" class="card-header">
              <h2><i class="el-icon-star-on"></i> 中国古代自然科学成就</h2>
            </div>
            <div class="card-content">
              <p class="card-desc">
                中国古代在天文学、数学、医学、农学等领域取得了辉煌成就：
              </p>
              <ul class="feature-list">
                <li><i class="el-icon-astronomy"></i> <strong>天文学：</strong>发明了浑天仪、地动仪等天文仪器</li>
                <li><i class="el-icon-calculator"></i> <strong>数学：</strong>《九章算术》奠定了古代数学的基础</li>
                <li><i class="el-icon-first-aid-kit"></i> <strong>医学：</strong>《黄帝内经》奠定了中医理论体系</li>
                <li><i class="el-icon-grape"></i> <strong>农学：</strong>《齐民要术》总结了古代农业技术</li>
              </ul>
              <div class="image-container">
                <img
                    src="@/assets/science_achievements.png"
                    alt="中国古代自然科学成就"
                    class="content-image"
                >
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 中国古代杰出科学家 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" class="content-col">
          <el-card shadow="hover" class="content-card">
            <div slot="header" class="card-header">
              <h2><i class="el-icon-user-solid"></i> 中国古代杰出科学家</h2>
            </div>
            <div class="card-content">
              <p class="card-desc">
                中国古代涌现了许多伟大的科学家，他们的贡献影响深远：
              </p>
              <ul class="feature-list">
                <li><i class="el-icon-odometer"></i> <strong>张衡：</strong>发明地动仪，研究天文历法</li>
                <li><i class="el-icon-c-scale-to-original"></i> <strong>祖冲之：</strong>精确计算圆周率，推动数学发展</li>
                <li><i class="el-icon-first-aid-kit"></i> <strong>李时珍：</strong>编撰《本草纲目》，奠定中医药学基础</li>
                <li><i class="el-icon-notebook-2"></i> <strong>沈括：</strong>著有《梦溪笔谈》，涉及多学科领域</li>
              </ul>

              <div class="image-container">
                <img
                    src="@/assets/scientists.png"
                    alt="中国古代杰出科学家"
                    class="content-image"
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="24" class="content-row">
        <!-- 中国古代自然科学著作 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" class="content-col">
          <el-card shadow="hover" class="content-card">
            <div slot="header" class="card-header">
              <h2><i class="el-icon-notebook-1"></i> 中国古代自然科学著作</h2>
            </div>
            <div class="card-content">
              <p class="card-desc">
                中国古代留下了许多重要的自然科学专著，记录了丰富的知识：
              </p>
              <ul class="feature-list">
                <li><i class="el-icon-c-scale-to-original"></i> <strong>《九章算术》：</strong>古代数学经典，解决实际问题</li>
                <li><i class="el-icon-first-aid-kit"></i> <strong>《黄帝内经》：</strong>中医理论奠基之作</li>
                <li><i class="el-icon-collection"></i> <strong>《梦溪笔谈》：</strong>涵盖天文、地理、物理等领域的综合性著作</li>
                <li><i class="el-icon-fork-spoon"></i> <strong>《天工开物》：</strong>详细记录了古代手工业和农业技术</li>
              </ul>
              <div class="image-container">
                <img
                    src="@/assets/science_books.png"
                    alt="中国古代自然科学著作"
                    class="content-image"
                >
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 中国古代优秀文化传承 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="12" class="content-col">
          <el-card shadow="hover" class="content-card">
            <div slot="header" class="card-header">
              <h2><i class="el-icon-orange"></i> 中国古代优秀文化传承</h2>
            </div>
            <div class="card-content">
              <p class="card-desc">
                中华优秀文化不仅体现在自然科学成就上，还涵盖了哲学、艺术、教育等领域：
              </p>
              <ul class="feature-list">
                <li><i class="el-icon-reading"></i> <strong>哲学：</strong>儒家、道家思想对后世影响深远</li>
                <li><i class="el-icon-brush"></i> <strong>艺术：</strong>书法、绘画、陶瓷等艺术形式独具特色</li>
                <li><i class="el-icon-school"></i> <strong>教育：</strong>科举制度推动了古代学术发展</li>
                <li><i class="el-icon-lightning"></i> <strong>科技：</strong>四大发明（造纸术、印刷术、火药、指南针）改变世界</li>
              </ul>
              <div class="image-container">
                <img
                    src="@/assets/culture_heritage.png"
                    alt="中国古代优秀文化传承"
                    class="content-image"
                >
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "KnowledgePage",
};
</script>

<style scoped>
.knowledge-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  font-size: 28px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.sub-title {
  font-size: 16px;
  color: #909399;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.content-grid {
  margin-top: 20px;
}

.content-row {
  margin-bottom: 24px;
}

.content-col {
  margin-bottom: 24px;
}

.content-card {
  height: 100%;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  border-bottom: none;
  padding-bottom: 0;
}

.card-header h2 {
  font-size: 20px;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  padding: 15px 20px;
}

.card-header i {
  margin-right: 10px;
  color: #409EFF;
}

.card-content {
  padding: 0 20px 20px;
}

.card-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 15px;
  text-align: justify;
}

.feature-list {
  margin: 15px 0;
  padding-left: 0;
  list-style: none;
}

.feature-list li {
  padding: 10px 0;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #ebeef5;
  line-height: 1.6;
}

.feature-list li:last-child {
  border-bottom: none;
}

.feature-list i {
  margin-right: 8px;
  color: #67C23A;
  font-size: 16px;
  flex-shrink: 0;
}

.feature-list strong {
  color: #303133;
  margin-right: 5px;
}

.image-container {
  margin-top: 20px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
  border-radius: 4px;
}

.content-image:hover {
  transform: scale(1.02);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-title {
    font-size: 24px;
  }

  .card-header h2 {
    font-size: 18px;
  }

  .image-container {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 22px;
  }

  .sub-title {
    font-size: 14px;
  }

  .card-header h2 {
    padding: 12px 15px;
  }

  .card-content {
    padding: 0 15px 15px;
  }

  .image-container {
    height: 180px;
  }
}

@media (max-width: 576px) {
  .knowledge-container {
    padding: 15px;
  }

  .main-title {
    font-size: 20px;
  }

  .content-row {
    margin-bottom: 15px;
  }

  .content-col {
    margin-bottom: 15px;
  }

  .image-container {
    height: 160px;
  }

  .feature-list li {
    font-size: 13px;
    padding: 8px 0;
  }
}
</style>
