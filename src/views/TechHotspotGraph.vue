<template>
  <div>
    <el-card>
      <h3>技术热点图谱</h3>
      <div ref="network" style="width: 100%; height: 500px; border: 1px solid #ccc;"></div>
    </el-card>
  </div>
</template>

<script>
import {Network} from "vis-network";
import "vis-network/styles/vis-network.css";
import axios from 'axios';

export default {
  name: "TechHotspotGraph",
  data() {
    return {
      nodes: [],
      edges: [],
    };
  },
  mounted() {
    this.fetchGraphData();
  },
  methods: {
    async fetchGraphData() {
      try {
        const response = await axios.get("/api/tech-hotspot-graph/");
        const data = response.data;

        // 检查数据是否存在
        if (data && data.nodes && data.edges) {
          this.nodes = data.nodes;
          this.edges = data.edges;
          this.renderGraph();
        } else {
          console.error("Invalid graph data format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      }
    },
    renderGraph() {
      const container = this.$refs.network;
      const data = {
        nodes: this.nodes,
        edges: this.edges,
      };
      const options = {
        nodes: {
          shape: "dot",
          size: 20,
          font: {
            size: 16,
            color: "#000",
          },
          borderWidth: 2,
        },
        edges: {
          width: 1,
          color: "#ddd",
          smooth: true, // 平滑边，避免过度交叉
        },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -2000, // 调整吸引力，防止节点拥挤
            centralGravity: 0.3,
            springLength: 200,  // 增加弹簧长度，减少过度重叠
            springConstant: 0.05,
          },
          maxVelocity: 50,  // 限制节点移动速度
          minVelocity: 0.1,
          stabilization: {
            enabled: true,
            iterations: 200,  // 迭代200次后稳定布局
          },
        },
        interaction: {
          hover: true,
          dragNodes: true,
          zoomView: true,
        },
      };

      new Network(container, data, options);
    },
  },
};
</script>
