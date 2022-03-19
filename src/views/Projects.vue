<template>
  <div style="height:100%">
    <div style="height: 97%">
      <div style="margin-bottom: 8px;">
        <el-button type="success"
                   @click="dialogFormVisible = true">新增</el-button>
        <el-button type="danger"
                   v-if="showDeleteButton"
                   @click="delPro">删除</el-button>
      </div>

      <div style="height: 100%; box-sizing: border-box;">
        <ag-grid-vue style="width: 100%; height: 100%;"
                     class="ag-theme-alpine"
                     :context="context"
                     :columnDefs="columnDefs"
                     :rowData="rowData"
                     :rowHeight="rowHeight"
                     :rowClassRules="rowClassRules"
                     :rowSelection="rowSelection"
                     @grid-ready="onGridReady"
                     :defaultColDef="defaultColDef"
                     :columnTypes="columnTypes"
                     :animateRows="true"
                     :paginationAutoPageSize="true"
                     :pagination="true"
                     @cell-value-changed="onCellValueChanged"
                     @selection-changed="onSelectionChanged">
        </ag-grid-vue>
      </div>
    </div>
    <div>
      <el-dialog title="添加项目"
                 v-model="dialogFormVisible"
                 width="800px">
        <el-form :model="form">
          <el-form-item label="名称"
                        :label-width="formLabelWidth">
            <el-input v-model="form.name"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型"
                        :label-width="formLabelWidth">
            <el-select v-model="form.type"
                       aria-checked="S">
              <el-option label="Samll"
                         value="S"></el-option>
              <el-option label="Medium"
                         value="M"></el-option>
              <el-option label="Large"
                         value="L"></el-option>
              <el-option label="Danger"
                         value="D"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态"
                        :label-width="formLabelWidth">
            <el-select v-model="form.status">
              <el-option label="New"
                         value="N"></el-option>
              <el-option label="Process"
                         value="P"></el-option>
              <el-option label="End"
                         value="E"></el-option>
              <el-option label="Stop"
                         value="S"></el-option>
              <el-option label="Com"
                         value="C"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="submitAdd">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  AgGridVue
} from "ag-grid-vue3";
import {
  pros,
  patchPro,
  addPro,
  delPro
} from '../request/api'
import {
  AllCommunityModules
} from 'ag-grid-community';
import statusRender from '../../src/components/project/StatusRender'

export default {
  name: 'App',
  data () {
    return {
      showDeleteButton: false,
      context: null,
      rowHeight: 50,
      sideBar: null,
      rowData: null,
      gridApi: null,
      rowSelection: null,
      columnTypes: null,
      rowClassRules: null,
      dialogFormVisible: false,
      form: {
        name: '',
        type: 'S',
        status: 'N',
      },
      formLabelWidth: '120px',
      modules: AllCommunityModules,
      cellClassRules: {
        'sick-days-blue': (params) => {
          // var proType = params.data.type;
          console.log(params)
          return params.value === 'S';
        },
        'sick-days-green': (params) => {
          var proType = params.data.type;
          return proType == 'M';
        },
        'sick-days-warning': (params) => {
          var proType = params.data.type;
          return proType == 'L';
        },
        'sick-days-danger': (params) => {
          var proType = params.data.type;
          return proType == 'D';
        },
      },
      columnApi: null,
      defaultColDef: {
        sortable: true,
        // filter: 'agTextColumnFilter',
        // floatingFilter: true,
        resizable: true,
      },
      columnDefs: [{
        headerName: 'ID',
        field: 'id',
        pinned: 'left',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 100
      },
      {
        headerName: 'Name',
        field: 'name',
        editable: true,
      },
      {
        headerName: 'Type',
        field: 'type',
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ['Small', 'Medium', 'Large', 'Danger'],
        },
        cellRenderer: ragRenderer,
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRendererFramework: statusRender,
        cellEditor: "agSelectCellEditor",

      },
      {
        headerName: 'User',
        field: 'user',
      },
      {
        headerName: 'Created',
        field: 'created',
        type: ['dateColumn', 'nonEditableColumn'],
        width: 220,
      },
      ],
    }
  },
  components: {
    AgGridVue,
  },
  created () {
    pros().then(res => {
      console.log(res)
      this.rowData = res.data;
    })
  },
  methods: {
    onGridReady (params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      this.sizeToFit()
    },

    onSelectionChanged () {
      var selectedRows = this.gridApi.getSelectedRows()
      if (selectedRows.length > 0) {
        this.showDeleteButton = true
      } else {
        this.showDeleteButton = false
      }
    },

    onCellValueChanged (params) {
      const colId = params.column.getId();
      console.log(params)
      if (colId == "name") {
        patchPro(params.data.id, {
          "name": params.newValue
        }).then(res => {
          if (res.code == 200) {
            this.$message.success("修改成功");
          }
        })
      } else if (colId == "type") {
        const type_dict = {
          "Small": "S",
          "Medium": "M",
          "Large": "L",
          "Danger": "D"
        }
        patchPro(params.data.id, {
          "type": type_dict[params.newValue]
        }).then(res => {
          if (res.code == 200) {
            this.$message.success("修改成功");
          }
        })
      } else if (colId == "status") {
        const status_dict = {
          "20": "N",
          "40": "P",
          "50": "S",
          "90": "E",
          "100": "C"
        }
        patchPro(params.data.id, {
          "status": status_dict[params.newValue]
        }).then(res => {
          if (res.code == 200) {
            console.log(params)
            params.value = status_dict[params.newValue]
            console.log(params)
            params.api.refreshCells()
            this.$message.success("修改成功");
          }
        })
      }

    },
    submitAdd () {
      addPro(this.form).then(res => {
        console.log(res)
        this.rowData.push(res.data)
        this.dialogFormVisible = false
      })
    },

    delPro () {
      var selectedRows = this.gridApi.getSelectedRows()
      this.gridApi.applyTransaction({
        remove: selectedRows
      });
      let id_list = []
      for (let i = 0; i < selectedRows.length; i++) {
        id_list.push(selectedRows[i].id)
      }
      delPro(id_list).then(res => {
        console.log(res)
      })

    },
    sizeToFit () {
      this.gridApi.sizeColumnsToFit();
    },
  },
  beforeMount () {
    this.rowSelection = 'multiple';
    this.columnTypes = {
      numberColumn: {
        width: 130,
        filter: 'agNumberColumnFilter',
      },
      medalColumn: {
        width: 100,
        columnGroupShow: 'open',
        filter: false,
      },
      nonEditableColumn: {
        editable: false
      },
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
          comparator: (filterLocalDateAtMidnight, cellValue) => {
            var dateParts = cellValue.split('/');
            var day = Number(dateParts[0]);
            var month = Number(dateParts[1]) - 1;
            var year = Number(dateParts[2]);
            var cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          },
        },
      },
    };
  }
}

function ragRenderer (params) {
  if (params.value == "Small") {
    return '<span class="for-type-blue">' + params.value + '</span>';
  } else if (params.value == "Medium") {
    return '<span class="for-type-green">' + params.value + '</span>';
  } else if (params.value == "Large") {
    return '<span class="for-type-warning">' + params.value + '</span>';
  } else {
    return '<span class="for-type-danger">' + params.value + '</span>';
  }
}
</script>

<style lang="scss">
@import '../../node_modules/ag-grid-community/dist/styles/ag-grid.css';
@import '../../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css';
@import '../../node_modules/ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

.ag-header-group-cell-with-group {
  background-color: #00e7b1;
}

.rag-red {
  background-color: lightcoral;
}

.rag-green {
  background-color: lightgreen;
}

.rag-amber {
  background-color: lightsalmon;
}

.for-type-blue {
  color: white;
  padding: 0.3rem 0.5rem;
  text-align: center;
  border-radius: 10rem;
  background-color: #1963d3 !important;
}

.for-type-green {
  color: white;
  padding: 0.3rem 0.5rem;
  text-align: center;
  border-radius: 10rem;
  background-color: #14e0b1 !important;
}

.for-type-warning {
  color: white;
  padding: 0.3rem 0.5rem;
  text-align: center;
  border-radius: 10rem;
  background-color: rgba(183, 219, 22, 0.897) !important;
}

.for-type-danger {
  color: white;
  padding: 0.3rem 0.5rem;
  text-align: center;
  border-radius: 10rem;
  background-color: rgba(216, 61, 34, 0.993) !important;
}
</style>
