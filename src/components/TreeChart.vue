<template>
  <div id="tree-chart" style="width: 100%; height: 600px;"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "TreeChart",
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById("tree-chart");
      const myChart = echarts.init(chartDom);

      const data = {
        name: "文化相关文件",
        children: [
          {
            name: "2023",
            children: [
              {name: "文化和旅游部关于发布《非物质文化遗产数字化保护 数字资源采集和著录》系列行业标准的公告", value: 1},
              {name: "文化和旅游部关于推动非物质文化遗产与旅游深度融合发展的通知", value: 1}
            ]
          },
          {
            name: "2022",
            children: [
              {
                name: "文化和旅游部办公厅关于开展国家级非物质文化遗产代表性项目保护单位履职尽责情况评估和调整工作的通知",
                value: 1
              },
              {name: "关于下达2022年非物质文化遗产保护资金预算的通知", value: 1},
              {name: "国务院办公厅关于同意调整完善非物质文化遗产保护工作部际联席会议制度的函", value: 1},
              {name: "关于印发《国家非物质文化遗产保护资金管理办法》的通知", value: 1}
            ]
          },
          {
            name: "2021",
            children: [
              {name: "文化和旅游部办公厅关于公布第五批国家级非物质文化遗产代表性项目保护单位的通知", value: 1},
              {
                name: "为全面建设社会主义现代化国家提供精神力量——文化和旅游部负责同志就《关于进一步加强非物质文化遗产保护工作的意见》答记者问",
                value: 1
              },
              {name: "第五批国家级非物质文化遗产代表性项目名录185项 扩展项目名录140项", value: 1},
              {name: "国务院关于公布第五批国家级非物质文化遗产代表性项目名录的通知", value: 1},
              {name: "文化和旅游部关于印发《“十四五”非物质文化遗产保护规划》的通知", value: 1},
              {name: "关于下达2021年非物质文化遗产保护资金预算的通知", value: 1}
            ]
          },
          {
            name: "2020",
            children: [
              {name: "关于提前下达2021年非物质文化遗产保护资金预算的通知", value: 1}
            ]
          },
          {
            name: "2019",
            children: [
              {name: "国家级非物质文化遗产代表性传承人认定与管理办法", value: 1}
            ]
          },
          {
            name: "2018",
            children: [
              {
                name: "文化和旅游部 教育部 人力资源社会保障部关于印发《中国非物质文化遗产传承人群研修研习培训计划实施方案（2018-2020）》的通知",
                value: 1
              }
            ]
          },
          {
            name: "2014",
            children: [
              {name: "国务院关于公布第四批国家级非物质文化遗产代表性项目名录的通知", value: 1}
            ]
          },
          {
            name: "2011",
            children: [
              {name: "国务院关于公布第三批国家级非物质文化遗产名录的通知", value: 1}
            ]
          },
          {
            name: "2008",
            children: [
              {
                name: "国务院关于公布第二批国家级非物质文化遗产名录和第一批国家级非物质文化遗产扩展项目名录的通知",
                value: 1
              },
              {name: "国务院办公厅关于加强我国非物质文化遗产保护工作的意见", value: 1}
            ]
          }
        ]
      };

      const option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove"
        },
        series: [
          {
            type: "tree",
            data: [data],
            left: "2%",
            right: "2%",
            top: "8%",
            bottom: "20%",
            symbol: "emptyCircle",
            orient: "vertical",
            expandAndCollapse: true,
            label: {
              position: "top",
              rotate: -90,
              verticalAlign: "middle",
              align: "right",
              fontSize: 9
            },
            leaves: {
              label: {
                position: "bottom",
                rotate: -90,
                verticalAlign: "middle",
                align: "left"
              }
            },
            animationDurationUpdate: 750
          }
        ]
      };

      myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
#tree-chart {
  width: 100%;
  height: 600px;
}
</style>
