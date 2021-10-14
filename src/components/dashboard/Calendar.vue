<template>
  <div style="width: 96%">
    <p style="text-align: center;margin-bottom: 10px;">最近的日程表</p>
    <div style="border: 1px solid grey;">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>

  <el-dialog title="计划"
             v-model="dialogFormVisible"
             destroy-on-close>
    <el-form :model="form">
      <el-form-item label="名称"
                    :label-width="formLabelWidth">
        <el-input v-model="form.name"
                  autocomplete="off"
                  style="width:350px"></el-input>
      </el-form-item>
      <el-form-item label="日期"
                    :label-width="formLabelWidth">
        <el-date-picker v-model="form.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-value="defaultDate">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="delButtonVisible"
                   type="danger"
                   @click="delEvent">删除</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateEvent"
                   v-if="updateButtonVisible">更新</el-button>
        <el-button type="primary"
                   @click="addEvent"
                   v-else>确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import '@fullcalendar/core/vdom' // solves problem with Vite
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { plansList, addPlan, delPlan, patchPlan } from '@/request/api'
let colors = ['#FF0000', "FF34B3", '#DAA520', '#7CFC00', "#9400D3", "ff99ff", "#FFD700"]
export default {
  components: {
    FullCalendar
  },
  data () {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        selectMirror: true,
        // nextDayThreshold: '00:00:00',
        dateClick: this.handleDateClick,
        eventClick: this.eventClick,
        events: [],
        eventColor: '#378006',
        dayMaxEventRows: true,
        displayEventTime: false,
        eventDidMount: this.eventMount
      },
      form: {
        name: '',
        date: [],
      },
      eventInfo: '',
      dialogFormVisible: false,
      delButtonVisible: false,
      updateButtonVisible: false,
      formLabelWidth: '140px',
      defaultDate: [],
    }
  },
  mounted () {
    let params = {
      user: localStorage.getItem("user_id"),
    }
    plansList(params).then(res => {
      let data = res.data.list
      for (let i = 0; i < data.length; i++) {
        this.calendarOptions.events.push({
          id: data[i].id,
          title: data[i].title, start: data[i].start.split("+")[0], end: data[i].end.split("+")[0],
          allDay: true, color: colors[Math.ceil(Math.random() * 7)],   // an option!
          textColor: 'black' // an option!
        })
      }
    })
  },
  methods: {
    handleDateClick (arg) {
      var date = new Date(arg.dateStr);
      this.form.date = [dateFormat("YYYY-mm-dd", date), dateFormat("YYYY-mm-dd", date)]
      this.dialogFormVisible = true

    },
    eventClick: function (info) {
      info.jsEvent.preventDefault(); // don't let the browser navigate
      this.eventInfo = info
      console.log(info);
      this.delButtonVisible = true
      this.updateButtonVisible = true
      this.form.name = info.event.title
      this.form.date[0] = info.event.startStr
      if (info.event.endStr == "") {
        this.form.date[1] = info.event.startStr
      } else {
        this.form.date[1] = info.event.endStr
      }

      this.dialogFormVisible = true
    },
    // eventMount: function (info) {
    //   console.log(info)
    // },
    addEvent () {
      let data = {
        user: Number(localStorage.getItem("user_id")),
        title: this.form.name,
        start: this.form.date[0],
        end: this.form.date[1]
      }
      console.log(data)
      addPlan(data).then(
        res => {
          this.calendarOptions.events.push({
            id: res.data.Id,
            title: this.form.name, start: this.form.date[0], end: this.form.date[1],
            color: colors[Math.ceil(Math.random() * 7)], textColor: 'black'
          })
        }
      )
      this.dialogFormVisible = false
    },
    delEvent () {
      let params = {
        id: this.eventInfo.event.id
      }
      delPlan(params).then(
        res => {
          let index = findEvent(params.id, this.calendarOptions.events)
          this.calendarOptions.events.splice(index, 1)
          this.$message.success("删除成功");
          if (res.code == 200) {
            this.dialogFormVisible = false
          }
        }
      )
    },

    updateEvent () {
      let id = this.eventInfo.event.id
      let title = this.eventInfo.event.title
      let data = {
        start: this.form.date[0],
        end: this.form.date[1]
      }
      if (title != this.form.name) {
        data["title"] = this.form.name
      }
      patchPlan(id, data).then(res => {
        if (res.code == 200) {
          let index = findEvent(id, this.calendarOptions.events)
          this.calendarOptions.events[index].title = res.data.Title
          this.calendarOptions.events[index].start = this.form.date[0]
          this.calendarOptions.events[index].end = this.form.date[1]
          this.$message.success("更新成功");
          this.dialogFormVisible = false
        }
      })
    }

  }
}

function findEvent (id, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (id == arr[i].id) {
      return i
    }
  }
}
function dateFormat (fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
  }
  return fmt;
}
</script>