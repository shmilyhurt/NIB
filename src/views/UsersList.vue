<template>
  <vxe-toolbar ref="xToolbar1" custom>
  </vxe-toolbar>
<vxe-table
border
stripe
resizable
highlight-hover-row
id="toolbar_demo5"
ref="xTable1"
height="400"
:loading="loading"
:checkbox-config="{labelField: 'id', highlight: true, range: true}"
:custom-config="{storage: true, checkMethod: checkColumnMethod}"
:data="tableData">
<vxe-table-column type="seq" width="60"></vxe-table-column>
<vxe-table-column type="checkbox" title="ID" width="140" sortable></vxe-table-column>
<vxe-table-column field="user_name" title="Name" sortable></vxe-table-column>
<vxe-table-column field="create_at" title="Created" sortable></vxe-table-column>
</vxe-table>
</template>
<script>
import { usersList } from '../request/api'
export default {
          data () {
            return {
              loading: false,
              tableData: [],
            }
          },
          created () {
            this.loading = true
            setTimeout(() => {
              usersList().then(res=>{
                console.log(res)
                this.tableData = res.data
              })
              this.loading = false
            }, 500),
            this.$nextTick(() => {
              // 手动将表格和工具栏进行关联
              this.$refs.xTable1.connect(this.$refs.xToolbar1)
            })
            
          },
          methods: {
            checkColumnMethod ({ column }) {
              if (column.property === 'role') {
                return false
              }
              return true
            },
            resizableChangeEvent () {
              const columns = this.$refs.xTable1.getColumns()
              const customData = columns.map(column => {
                return {
                  width: column.renderWidth
                }
              })
              console.log(customData)
            }
          }
        }
</script>