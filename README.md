---

# 项目名称  
## 智汇古今——面向中华自然科学与优秀文化可视化分析平台（前端）  

---

### **分支说明**  
1. **`master` 分支**  
   - **项目名称**：面向人工智能行业的数据洞察与可视化分析  
   - **状态**：已完结，功能稳定，可直接部署。  
   - **内容**：  
     - 基于 Vue2 的前端界面。  
     - AI 行业数据可视化看板。  
     - 完整的接口对接与规范代码。  

2. **`new_project` 分支**  
   - **项目名称**：智汇古今——面向中华自然科学与优秀文化可视化分析平台  
   - **状态**：开发中，功能迭代中。  
   - **内容**：  
     - 基于 `master` 分支的界面扩展。  
     - 新增中华自然科学与文化数据可视化模块。  
     - **注意**：部分接口名称、路径尚未规范化（后续逐步优化）。  

---

### **功能特性**  
#### **`master` 分支**  
- 数据看板：动态展示 AI 行业数据（趋势、分布、关联分析）。  
- 可视化组件：集成 ECharts/Element UI，支持图表交互。  
- 响应式布局：适配 PC 和移动端。  

#### **`new_project` 分支**  
- 文化数据展示：新增古籍、历史事件、传统工艺等专题页面。  
- 可视化优化：适配文化数据的特殊展示需求（如时间轴、地图）。  
- 交互增强：新增用户数据筛选、导出功能。  

---

### **环境要求**  
- Node.js 14+  
- Vue 2.x  
- 依赖库：`package.json`（分支独立配置）  

---

### **快速开始**  
#### **1. 克隆项目**  
```bash  
git clone https://github.com/Agenda0710/weibo_ai_ancient_analysis_frontend.git  
cd weibo_ai_ancient_analysis_frontend  
```  

#### **2. 切换分支**  
- **旧版（`master`） 此分支千万千万不要动**：  
  ```bash  
  git checkout master  
  ```  
- **新版（`new_project`）**：  
  ```bash  
  git checkout new_project  
  ```  

#### **3. 安装依赖**  
```bash  
npm install  
```  

#### **4. 配置后端接口**  
- 修改 `src/api/config.js` 中的接口路径：  
  ```javascript  
  // 默认请求后端地址（示例）  
  const API_BASE_URL = "http://localhost:8000/api";  
  export default API_BASE_URL;  
  ```  

#### **5. 启动开发服务器**  
```bash  
npm run serve  
```  
访问 `http://localhost:8080` 查看界面（需后端服务同时运行）。  

---

### **注意事项**  
1. **依赖后端服务**  
   - 前端需配合后端（Django）运行，否则接口请求会失败。  
   - 后端仓库地址：[后端 GitHub 仓库](https://github.com/Agenda0710/weibo_ai_ancient_analysis_backend)  

2. **路径与接口规范**  
   - `new_project` 分支的接口路径、函数名称正在优化中，部分代码可能与 `master` 分支存在差异。  

3. **静态资源**  
   - 大型静态文件（如文化数据 JSON 文件）未提交到 Git，请联系作者获取。  

---

### **默认分支设置（重要）**  
当前默认分支为 `master`，若需切换为 `new_project`，请按以下步骤操作：  

#### **1. 本地切换默认分支**  
```bash  
git checkout new_project  
git branch -u origin/new_project  
```  

#### **2. 在 GitHub 上设置默认分支**  
1. 进入项目 GitHub 页面。  
2. 点击 **Settings** → **Branches**。  
3. 在 **Default branch** 下拉菜单中选择 `new_project`。  
4. 确认切换。  





## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
