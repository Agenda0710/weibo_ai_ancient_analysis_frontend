<template>
  <div class="graph-container">
    <el-card class="graph-card" shadow="hover">
      <div slot="header" class="card-header">
        <i class="el-icon-connection"></i>
        <span>文化焦点关系图谱</span>
      </div>
      <div ref="network" class="network-container"></div>
      <div class="graph-footer">
        <el-tag type="info">节点数: {{ nodes.length }}</el-tag>
        <el-tag type="info">关系数: {{ edges.length }}</el-tag>
      </div>
    </el-card>
  </div>
</template>

<script>
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";
import axios from 'axios';

export default {
  name: "TechHotspotGraph",
  data() {
    return {
      nodes: [],
      edges: [],
      loading: false
    };
  },
  mounted() {
    this.fetchGraphData();
  },
  methods: {
    async fetchGraphData() {
      this.loading = true;
      try {
        const response = await axios.get("/api/techHotspotGraph/");
        const data = response.data;

        if (data?.nodes && data?.edges) {
          this.nodes = data.nodes;
          this.edges = data.edges;
          this.$nextTick(() => {
            this.renderGraph();
          });
        } else {
          this.$message.warning('图谱数据格式有误');
        }
      } catch (error) {
        this.$message.error('图谱数据加载失败');
        console.error("Failed to fetch graph data:", error);
      } finally {
        this.loading = false;
      }
    },
    renderGraph() {
      const container = this.$refs.network;
      const data = {nodes: this.nodes, edges: this.edges};

      const options = {
        nodes: {
          shape: "dot",
          size: 25,
          font: {
            size: 14,
            color: "#333",
            strokeWidth: 5,
            strokeColor: "#ffffff"
          },
          borderWidth: 2,
          color: {
            border: "#2B7CE9",
            background: "#97C2FC",
            highlight: {
              border: "#2B7CE9",
              background: "#D2E5FF"
            },
            hover: {
              border: "#2B7CE9",
              background: "#D2E5FF"
            }
          }
        },
        edges: {
          width: 2,
          color: {
            color: "#A0A0A0",
            highlight: "#2B7CE9",
            hover: "#2B7CE9"
          },
          smooth: {
            type: "continuous",
            roundness: 0.5
          },
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 0.5
            }
          }
        },
        physics: {
          solver: "forceAtlas2Based",
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 150,
            springConstant: 0.08,
            damping: 0.4
          },
          stabilization: {
            enabled: true,
            iterations: 1000
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          hideEdgesOnDrag: true,
          multiselect: true,
          keyboard: true
        },
        layout: {
          improvedLayout: true
        }
      };

      new Network(container, data, options);
    }
  }
};
</script>

<style scoped>
/* 与顶部大标题协调的样式 */
.graph-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px); /* 减去header高度 */
}

/* 卡片样式与整体风格统一 */
.graph-card {
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
}

.graph-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-header i {
  margin-right: 10px;
  color: #409EFF;
  font-size: 20px;
}

/* 图谱容器样式 */
.network-container {
  width: 100%;
  height: 450px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 底部统计信息 */
.graph-footer {
  padding: 15px 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .network-container {
    height: 400px;
  }

  .card-header {
    font-size: 16px;
    padding: 10px 15px;
  }
}

/* 与大标题协调的全局样式 */
.el-header {
  background-color: #409EFF;
  color: white;
  font-size: 22px;
  font-weight: bold;
  line-height: 60px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  position: relative;
  z-index: 1;
}

.el-main {
  padding: 0;
  background-color: #f5f7fa;
}
</style>
