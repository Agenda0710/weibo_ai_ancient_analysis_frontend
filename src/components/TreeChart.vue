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
            name: "2022",
            children: [
              { name: "国务院关于同意将江西省九江市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院办公厅关于同意调整完善非物质文化遗产保护工作部际联席会议制度的函", value: 1 }
            ]
          },
          {
            name: "2021",
            children: [
              { name: "国务院关于同意将安徽省桐城市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于同意在全面深化服务贸易创新发展试点地区暂时调整实施有关行政法规和国务院文件规定的批复", value: 1 },
              { name: "国务院办公厅关于文化市场综合行政执法有关事项的通知", value: 1 },
              { name: "国务院关于同意将安徽省黟县列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于公布第五批国家级非物质文化遗产代表性项目名录的通知", value: 1 },
              { name: "国务院关于同意将云南省通海县列为国家历史文化名城的批复", value: 1 }
            ]
          },
          {
            name: "2020",
            children: [
              { name: "国务院关于同意将辽宁省辽阳市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院办公厅关于印发公共文化领域中央与地方财政事权和支出责任划分改革方案的通知", value: 1 }
            ]
          },
          {
            name: "2019",
            children: [
              { name: "国务院办公厅关于进一步激发文化和旅游消费潜力的意见", value: 1 },
              { name: "国务院办公厅关于同意建立大运河文化保护传承利用工作省部际联席会议制度的函", value: 1 }
            ]
          },
          {
            name: "2016",
            children: [
              { name: "国务院办公厅关于印发文化体制改革试点中支持文化产业发展和经营性文化事业单位转制为企业的两个规定的通知", value: 1 },
              { name: "国务院关于同意将浙江省温州市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于同意设立“文化和自然遗产日”的批复", value: 1 }
            ]
          },
          {
            name: "2015",
            children: [
              { name: "国务院关于同意将江苏省常州市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院办公厅关于推进基层综合性文化服务中心建设的指导意见", value: 1 }
            ]
          },
          {
            name: "2014",
            children: [
              { name: "国务院关于同意将黑龙江省齐齐哈尔市列为国家历史文化名城的批复", value: 1 }
            ]
          },
          {
            name: "2013",
            children: [
              { name: "国务院关于同意将山东省青州市列为国家历史文化名城的批复", value: 1 }
            ]
          },
          {
            name: "2012",
            children: [
              { name: "国务院关于同意将新疆维吾尔自治区伊宁市列为国家历史文化名城的批复", value: 1 }
            ]
          },
          {
            name: "2011",
            children: [
              { name: "国务院关于同意将广东省中山市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于同意将山西省太原市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于公布第三批国家级非物质文化遗产名录的通知", value: 1 },
              { name: "国务院关于同意将山东省蓬莱市列为国家历史文化名城的批复", value: 1 }
            ]
          },
          {
            name: "2010",
            children: [
              { name: "国务院办公厅关于印发文化部职能配置内设机构和人员编制规定的通知", value: 1 }
            ]
          },
          {
            name: "2009",
            children: [
              { name: "国务院关于同意将江苏省南通市列为国家历史文化名城的批复", value: 1 }
            ]
          },
          {
            name: "2008",
            children: [
              { name: "国务院办公厅转发文化部等部门关于开展网吧等互联网上网服务营业场所专项整治意见的通知", value: 1 },
              { name: "国务院关于同意将新疆维吾尔自治区特克斯县列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于同意将安徽省绩溪县列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于同意将山东省泰安市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院关于同意将江苏省无锡市列为国家历史文化名城的批复", value: 1 },
              { name: "国务院办公厅转发文化部、建设部、文物局等部门关于加强我国世界文化遗产保护管理工作意见的通知", value: 1 }
            ]
          },
          {
            name: "2006",
            children: [
              { name: "国务院办公厅关于成立国家文化遗产保护领导小组的通知", value: 1 }
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
