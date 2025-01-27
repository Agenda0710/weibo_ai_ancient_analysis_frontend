<template>
  <div class="knowledge-page">


    <el-row :gutter="20" class="content-section equal-height">
      <!-- 什么是人工智能 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>什么是人工智能？</h2>
          <p>
            人工智能（Artificial Intelligence, AI）是一门研究如何让计算机模拟人类智能的学科。
            它包括自然语言处理、计算机视觉、机器学习等领域，旨在实现机器的自主学习和推理能力。
          </p>
          <img src="@/assets/ai.png" alt="人工智能简介" class="content-image"/>
        </div>
      </el-col>
      <!-- 什么是大模型 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>什么是大模型？</h2>
          <p>
            大模型（Large Language Model, LLM）是基于深度学习技术训练的大规模语言模型，
            它拥有庞大的参数量和丰富的知识，可以用于自然语言生成、对话、翻译等任务。
          </p>
          <img src="@/assets/llm.png" alt="大模型简介" class="content-image"/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-section equal-height">
      <!-- 人工智能的应用 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>人工智能的应用场景</h2>
          <p>
            人工智能技术已经在多个领域展现了巨大的潜力：
          </p>
          <div class="application-item">
            <el-icon><Medicine /></el-icon>
            <p>医疗：AI技术在医疗领域的应用包括智能诊断系统和个性化药物开发。</p>
          </div>
          <div class="application-item">
            <el-icon><Van /></el-icon>
            <p>交通：自动驾驶技术和智能交通管理系统的创新应用。</p>
          </div>
          <div class="application-item">
            <el-icon><Money /></el-icon>
            <p>金融：AI用于风险管理、智能投资顾问和欺诈检测。</p>
          </div>
          <div class="application-item">
            <el-icon><Reading /></el-icon>
            <p>教育：个性化学习平台和智能评估系统的开发。</p>
          </div>
          <img src="@/assets/ai_application.png" alt="人工智能应用场景" class="content-image"/>
        </div>
      </el-col>
      <!-- 大模型的未来 -->
      <el-col :span="12" class="flex-column">
        <div class="content-block">
          <h2>大模型的未来发展</h2>
          <p>
            随着计算能力的提升和数据的积累，大模型正逐步改变我们的生活。未来，大模型可能在以下领域取得重要突破：
          </p>
          <div class="application-item">
            <el-icon><FirstAidKit /></el-icon>
            <p>精准医疗：大模型辅助医生进行精准诊断和个性化治疗方案设计。</p>
          </div>
          <div class="application-item">
            <el-icon><Search /></el-icon>
            <p>学术研究：通过快速分析海量数据，加速科学发现的进程。</p>
          </div>
          <div class="application-item">
            <el-icon><ChatDotRound /></el-icon>
            <p>人机交互：打造更自然、更智能的对话助手。</p>
          </div>
          <div class="application-item">
            <el-icon><School /></el-icon>
            <p>教育支持：为学生提供全方位的学习辅助和实时反馈。</p>
          </div>
          <img src="@/assets/llm_future.png" alt="大模型的未来" class="content-image"/>
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

.content-image {
  width: 100%;
  height: auto;
  margin-top: 15px;
  border-radius: 5px;
}

.application-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.application-item p {
  margin: 0 0 0 8px;
}

</style>
