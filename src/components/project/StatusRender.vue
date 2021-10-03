<template>
  <el-progress :text-inside="true"
               :stroke-width="24"
               :percentage="percent"
               :status="status"
               style="margin-top: 10px;" />
</template>

<script>
export default {
  data () {
    let progress = { "N": 20, "P": 40, "E": 100, "S": 50 }
    let status_dict = { "N": "warning", "P": "success", "E": "", "S": "exception" }
    return {
      percent: progress[this.params.value],
      status: status_dict[this.params.value]
    };
  },
};
</script>
