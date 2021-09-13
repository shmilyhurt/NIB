<template>
  <draggable v-model="myArray"
             group="people"
             @start="drag=true"
             @end="drag=false"
             item-key="id">
    <template #item="{element}">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{element.name}}</span>
            <div style="float:right">
              <el-button class="button"
                         type="success"
                         icon="el-icon-d-arrow-right"
                         size="small"></el-button>
              <el-button class="button"
                         type="primary"
                         icon="el-icon-edit"
                         size="small"></el-button>
              <el-button class="button"
                         type="danger"
                         icon="el-icon-delete"
                         @click="delProject(element.id)"
                         size="small"></el-button>
            </div>

          </div>
        </template>
        <v-chart class="chart"
                 style="height:70px"
                 :option="element.option" />
      </el-card>
    </template>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
import { BarChart } from "echarts/charts";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, defineComponent } from "vue";
import { projects, delPro } from '@/request/api'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent
]);

const percent = {
  "S": 20,
  "P": 50,
  "E": 100,
}
const colors = {
  "S": "rgb(218, 47, 25)",
  "P": "rgb(41, 142, 189)",
  "E": "rgb(41, 189, 66)",
}

export default defineComponent({
  components: {
    draggable,
    VChart
  },
  provide: {
    [THEME_KEY]: "dark"
  },
  created () {
    this.initData(1)
  },
  mounted () {
    console.log(this.myArray)
  },
  data () {
    return {
      drag: false,
      myArray: []
    }
  },
  methods: {
    initData (num, info = '') {
      let params = {
        Info: info,
        PageSize: 10,
        PageNo: num
      }
      projects(params).then(
        res => {
          this.myArray = res.data.list
          for (let i = 0; i < this.myArray.length; i++) {
            this.myArray[i]["index"] = i
            const option = ref(
              {
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                backgroundColor: "white",
                grid: {
                  left: '0%',
                  right: '2%',
                  height: 60,
                  bottom: '5%',
                  containLabel: true
                },
                xAxis: {
                  show: false
                },
                yAxis: [
                  {
                    type: 'category',
                    // data: ['html5'],
                    max: 1,
                    axisTick: { show: false }, //不显示刻度线
                    axisLabel: {
                      color: "#000"
                    },
                    axisLine: {
                      show: false
                    },
                    inverse: true

                  },
                  {
                    type: 'category',
                    // data: [200],
                    max: 1,
                    axisTick: { show: false }, //不显示刻度线
                    axisLabel: {
                      color: "#000"
                    },
                    axisLine: {
                      show: false
                    },
                    inverse: true
                  },

                ],
                series: [
                  {
                    name: '条',
                    yAxisIndex: 0,
                    type: 'bar',
                    data: [percent[this.myArray[i].status]],
                    // 修改第一条柱子的圆角
                    itemStyle: {
                      borderRadius: 20,
                      color: colors[this.myArray[i].status]
                      // color 可以修改柱子的颜色
                      // color:"orange"
                    },
                    // 柱子之间的间距
                    barCategoryGap: 5,
                    // 柱子之间的宽度
                    barWidth: 30,
                    // 显示柱子内的文字
                    label: {
                      show: true,
                      position: "inside",
                      formatter: "{c}%"
                      // {c} 会自动解析为data中的数据
                    }
                  },
                  {
                    name: '框',
                    yAxisIndex: 1,
                    type: 'bar',
                    data: [100],
                    // 柱子之间的间距
                    barCategoryGap: 5,
                    // 柱子之间的宽度
                    barWidth: 30,
                    itemStyle: {
                      color: "none", //填充色
                      borderColor: "#00f",
                      borderWidth: 2,
                      borderRadius: 15
                    }
                  }
                ],
              }
            );
            this.myArray[i]["option"] = option
          }
        }
      )
    },
    delProject (proId) {
      let index = getIndex(this.myArray, proId)
      console.log(this.myArray, index)
      let params = {
        id: proId
      }
      delPro(params).then(
        this.myArray.splice(index, 1),
      )
    }
  }
})
function getIndex (arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == id) {
      return i
    }
  }
}
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  float: left;
  margin: 1%;
}
.chart {
  height: 100px;
  color: rgb(218, 47, 25);
}
</style>