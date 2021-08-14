<template>
  <div style="float: right;">
    <el-button type="success" @click="addUser">New</el-button>
  </div>
  <el-table
  highlight-current-row
  border
  stripe
    :data="tableData"
    style="width: 100%">
    <el-table-column
    type="selection"
    width="55">
  </el-table-column>
    <el-table-column
    sortable
    resizable
      label="ID"
      prop="id">
    </el-table-column>
    <el-table-column
    sortable
    resizable
      label="UserName"
      prop="user_name">
    </el-table-column>
    <el-table-column
    sortable
    resizable
    label="CreateAt"
    prop="create_at">
  </el-table-column>
    <el-table-column
      align="right">
      <template #header>
        <el-input
          v-model="search"
          size="large"
          clearable
          placeholder="输入关键字搜索"/>
      </template>
      <template #default="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
  background
  :page-size="10"
  :pager-count="11"
  layout="prev, pager, next"
  :total="total"
  @current-change="pageChange"
  style="float: right;">
</el-pagination>

<el-dialog title="用户信息" v-model="dialogFormVisible" width="40%">
  <el-form :model="form">
    <el-form-item label="名字" :label-width="formLabelWidth">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitChange">确 定</el-button>
    </span>
  </template>
</el-dialog>


<el-dialog title="新建用户" v-model="dialogFormAddVisible" width="40%">
  <el-form :model="addForm">
    <el-form-item label="名字" :label-width="formLabelWidth">
      <el-input v-model="addForm.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="addForm.password" autocomplete="off" type="password"></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormAddVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitAdd">确 定</el-button>
    </span>
  </template>
</el-dialog>
</template>

<script>
  import { usersList, delUser, patchUser, usersAdd } from '@/request/api'
  export default {
    data() {
      return {
        tableData: [],
        total:1,
        search: '',
        index: null,
        rowId:null,
        dialogFormVisible: false,
        dialogFormAddVisible: false,
        formLabelWidth: '90px',
        form: {
          username: '',
          password: '',
        },
        addForm: {
          username: '',
          password: '',
        },
      }
    },
    created () {
      this.ininData(1)
    },
    watch: {
      search(newVal){
        this.ininData(1, newVal)
      }
    },
    methods: {
      ininData(num, info=''){
      let params = {
        Info: info,
        PageSize:10,
        PageNo: num
      }
      usersList(params).then(
        res=>{
          this.tableData = res.data.list
          if (num == 1){
            this.total = res.data.total
          }

        }
      )
      },
      addUser(){
        this.dialogFormAddVisible = true
      },
      submitAdd(){
        usersAdd(this.addForm).then(
          res=>{
            if (this.tableData.length < 10){
              this.tableData.push(res.data)
            }
            this.dialogFormAddVisible = false
          }
        )
      },
      handleEdit(index, row) {
        this.index = index
        this.dialogFormVisible = true
        this.rowId = row.id
        this.form.username = row.user_name
        this.form.password = row.password
      },
      submitChange(){
        patchUser(this.rowId, this.form).then(
          res =>{
            this.tableData.splice(this.index, 1, res.data)
            this.dialogFormVisible = false

          }
        )
      },
      handleDelete(index, row) {
        let params = {
          id:row.id
      }
      delUser(params).then(
          delete this.tableData[index]
        )
      },
      pageChange(num){
        this.ininData(num)
      }
    },
  }
</script>
<style>
</style>