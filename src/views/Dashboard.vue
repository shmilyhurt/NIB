<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover"
                 class="mgb20"
                 style="height:100px;padding: 0">
          <div class="user-info">
            <img src="../assets/img/img.jpg"
                 class="user-avator"
                 alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20"
                class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover"
                     :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <i class="el-icon-user-solid grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    <count-to :startVal='0'
                              :endVal='userCount'
                              :duration=4000></count-to>
                  </div>
                  <div>注册人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover"
                     :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <i class="el-icon-postcard grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    <count-to :startVal='0'
                              :endVal='proCount'
                              :duration=4000></count-to>
                  </div>
                  <div>所有项目</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover"
                     :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <i class="el-icon-tickets grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">
                    <count-to :startVal='0'
                              :endVal='planCount'
                              :duration=4000></count-to>
                  </div>
                  <div>所有计划</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="11">
        <v-chart class="chart"
                 :option="option" />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="11">
        <v-chart class="chart"
                 :option="option2" />
      </el-col>
    </el-row>
    <MyCallendar></MyCallendar>
  </div>
</template>

<script>
import { CountTo } from 'vue3-count-to';
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { defineComponent } from "vue";
import MyCallendar from '@/components/dashboard/Calendar'
import {
  dashProStatus,
  dashProType,
  dashAll
} from '../request/api'


use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent
]);

export default defineComponent({
  components: {
    CountTo,
    VChart,
    MyCallendar
  },
  provide: {
    [THEME_KEY]: "dark"
  },
  data () {
    return {
      userCount: 0,
      proCount: 0,
      planCount: 0,
      option: {},
      option2: {},
      name: localStorage.getItem("ms_username"),
      role: "系统管理员",
    }
  },
  mounted () {
    dashProStatus().then(res => {
      this.option = {
        title: {
          text: "Project Status For Day",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["New", "Process", "Stop", "End", "Complete"]
        },
        series: [
          {
            name: "Project Status For Day",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: res.data.OneStatus, name: "New" },
              { value: res.data.TwoStatus, name: "Process" },
              { value: res.data.ThrStatus, name: "Stop" },
              { value: res.data.FouStatus, name: "End" },
              { value: res.data.FivStatus, name: "Complete" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    })

    dashProType().then(res => {
      this.option2 = {
        title: {
          text: 'Type For Day'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['Small', 'Large', 'Median', 'Danger']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Small',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: res.data[0]
          },
          {
            name: 'Large',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: res.data[1]
          },
          {
            name: 'Median',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: res.data[2]
          },
          {
            name: 'Danger',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: res.data[3]
          },
        ]
      }

    })

    dashAll().then(res => {
      this.userCount = res.data.UserCount
      this.proCount = res.data.ProCount
      this.planCount = res.data.PlanCount
    })
  },
  methods: {

  }
});

</script>

<style lang="postcss" scoped>
.chart {
  height: 400px;
}
.el-row {
  margin-bottom: 20px;
}
.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}
.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}
.grid-num {
  font-size: 30px;
  font-weight: bold;
}
.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}
.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}
.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}
.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}
.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}
.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}
.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}
.user-info {
  display: flex;
  align-items: center;
  /* padding-bottom: 20px; */
  /* border-bottom: 2px solid #ccc; */
  /* margin-bottom: 20px; */
}
.user-avator {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}
.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}
.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}
.user-info-list span {
  margin-left: 70px;
}
</style>