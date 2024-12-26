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
        name: "人工智能相关文件",
        "children": [
          {
            "name": "2017",
            "children": [
              {
                "name": "国务院关于印发新一代人工智能发展规划的通知", "value": 1
              },
              {
                "name": "为人工智能铺就发展快轨", "value": 1
              },
              {
                "name": "人工智能“添翼”中国经济", "value": 1
              },
              {
                "name": "构筑人工智能先发优势 把握新一轮科技革命战略主动", "value": 1
              },
              {
                "name": "国务院关于印发新一代人工智能发展规划的通知", "value": 1
              }
            ]
          },
          {
            "name": "2018",
            "children": [
              {
                "name": "教育部相关负责人解读 《高等学校人工智能创新行动计划》", "value": 1
              },
              {
                "name": "人工智能热潮：莫跟风 防虚火", "value": 1
              },
              {
                "name": "教育部关于印发《高等学校人工智能创新行动计划》的通知", "value": 1
              },
              {
                "name": "教育部办公厅关于成立教育部人工智能科技创新专家组的函", "value": 1
              },
              {
                "name": "教育部办公厅关于开展人工智能助推教师队伍建设行动试点工作的通知", "value": 1
              },
              {
                "name": "科技部关于发布科技创新2030—“新一代人工智能”重大项目2018年度项目申报指南的通知", "value": 1
              },
              {
                "name": "习近平致信祝贺2018世界人工智能大会开幕", "value": 1
              }
            ]
          },
          {
            "name": "2019",
            "children": [
              {
                "name": "科技部关于印发《国家新一代人工智能创新发展试验区建设工作指引》的通知", "value": 1
              },
              {
                "name": "科技部关于支持德清县建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "科技部关于印发《国家新一代人工智能开放创新平台建设工作指引》的通知", "value": 1
              },
              {
                "name": "科技部关于支持合肥建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "科技部关于支持杭州建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "科技部关于支持深圳建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "科技部关于支持天津建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "人力资源社会保障部 中华全国总工会 中国机械工业联合会关于举办2019年中国技能大赛——第三届全国智能制造应用技术技能大赛的通知",
                "value": 1
              },
              {
                "name": "国家林业和草原局关于促进林业和草原人工智能发展的指导意见", "value": 1
              },
              {
                "name": "科技部关于支持北京建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "科技部关于支持上海建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "人力资源社会保障部办公厅 市场监管总局办公厅 统计局办公室关于发布人工智能工程技术人员等职业信息的通知",
                "value": 1
              }
            ]
          },
          {
            "name": "2020",
            "children": [
              {
                "name": "促进学科融合 加快人工智能领域研究生培养", "value": 1
              },
              {
                "name": "五部门关于印发《国家新一代人工智能标准体系建设指南》的通知", "value": 1
              },
              {
                "name": "教育部 国家发展改革委 财政部印发《关于“双一流”建设高校促进学科融合 加快人工智能领域研究生培养的若干意见》的通知",
                "value": 1
              },
              {
                "name": "人力资源社会保障部办公厅 市场监管总局办公厅 统计局办公室关于发布智能制造工程技术人员等职业信息的通知",
                "value": 1
              }
            ]
          },
          {
            "name": "2021",
            "children": [
              {
                "name": "工业和信息化部：四方面重点工作切实解决老年人运用智能技术困难", "value": 1
              },
              {
                "name": "教育部关于实施第二批人工智能助推教师队伍建设行动试点工作的通知", "value": 1
              },
              {
                "name": "科技部关于支持长沙市建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "科技部关于支持苏州市建设国家新一代人工智能创新发展试验区的函", "value": 1
              },
              {
                "name": "人力资源社会保障部办公厅 工业和信息化部办公厅关于颁布智能制造工程技术人员等3个国家职业技术技能标准的通知",
                "value": 1
              },
              {
                "name": "工业和信息化部关于切实解决老年人运用智能技术困难便利老年人使用智能化产品和服务的通知",
                "value": 1
              }
            ]
          },
          {
            "name": "2022",
            "children": [
              {
                "name": "科技部等六部门发文统筹推进场景创新 让人工智能充分赋能经济社会发展", "value": 1
              },
              {
                "name": "六部门发文以场景创新推动人工智能发展看点解析", "value": 1
              },
              {
                "name": "国家发布重磅科技伦理治理文件：基因编辑、人工智能等技术研发将得到规范", "value": 1
              },
              {
                "name": "科技部关于支持建设新一代人工智能示范应用场景的通知", "value": 1
              },
              {
                "name": "科技部等六部门关于印发《关于加快场景创新以人工智能高水平应用促进经济高质量发展的指导意见》的通知",
                "value": 1
              }
            ]
          },
          {
            "name": "2023",
            "children": [
              {
                "name": "国家互联网信息办公室有关负责人就《生成式人工智能服务管理暂行办法》答记者问", "value": 1
              },
              {
                "name": "七部门联合发文——促进生成式人工智能健康发展和规范应用", "value": 1
              },
              {
                "name": "生成式人工智能服务管理暂行办法", "value": 1
              },
              {
                "name": "国家药监局综合司关于印发药品监管人工智能典型应用场景清单的通知", "value": 1
              }
            ]
          },
          {
            "name": "2024",
            "children": [
              {
                "name": "学习《决定》每日问答 | 为什么要建立人工智能安全监管制度", "value": 1
              },
              {
                "name": "四部门关于印发国家人工智能产业综合标准化体系建设指南（2024版）的通知", "value": 1
              },
              {
                "name": "教育部办公厅关于公布中小学人工智能教育基地名单的通知", "value": 1
              }
            ]
          }
        ]
      };
      const option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
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
              fontSize: 9,
            },
            leaves: {
              label: {
                position: "bottom",
                rotate: -90,
                verticalAlign: "middle",
                align: "left",
              },
            },
            animationDurationUpdate: 750,
          },
        ],
      };

      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
#tree-chart {
  width: 100%;
  height: 600px;
}
</style>
