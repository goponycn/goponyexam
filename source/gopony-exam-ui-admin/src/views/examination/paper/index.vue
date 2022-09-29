<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入试卷名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="queryParams.courseId" placeholder="请选择课程" clearable>
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.status == 1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['examination:paper:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['examination:paper:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['examination:paper:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="60" />

      <el-table-column label="试卷名称" align=" left" header-align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/examination/paper-edit/index/' + scope.row.id" class="link-type">
            <span>{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="完成组卷" align="center" prop="ismade" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.ismade" />
        </template>
      </el-table-column>
      <el-table-column label="总分" align="center" prop="totalScore" width="80" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view"
            @click="$router.push({path:'/examination/paper-preview/index/'+scope.row.id})"
            v-hasPermi="['examination:paper:edit']">预览</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit"
            @click="$router.push({path:'/examination/paper-edit/index/'+scope.row.id})"
            v-hasPermi="['examination:paper:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['examination:paper:remove']">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />


  </div>
</template>

<script>
  import {
    listPaper,
    getPaper,
    delPaper,
    addPaper,
    updatePaper
  } from "@/api/examination/paper";

  export default {
    name: "Paper",
    dicts: ['sys_normal_disable', 'pony_manual_auto', 'sys_yes_no'],
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 试卷表格数据
        paperList: [],
        // 课程列表
        courseOptions: [],
        // 知识单元列表
        sectionOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          courseId: null,
          name: null,
          status: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {

        }
      };
    },
    created() {
      this.getList();

    },

    methods: {
      /** 查询试卷列表 */
      getList() {
        this.loading = true;
        listPaper(this.queryParams).then(response => {
          this.courseOptions = response.courses;
          this.sectionOptions = response.sections;
          this.paperList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.$router.push({
          path: '/examination/paper-edit/index/0'
        });
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除试卷编号为"' + ids + '"的数据项？').then(function() {
          return delPaper(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('examination/paper/export', {
          ...this.queryParams
        }, `paper_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
