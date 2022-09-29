<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名" prop="filename">
        <el-input v-model="queryParams.filename" placeholder="请输入文件名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="上传时间">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['basic:upload:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basic:upload:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="uploadList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="55" />
      <el-table-column label="文件" align="left" header-align="center" prop="filename" />
      <el-table-column label="来源" align="center" prop="status" width="60">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pony_upload_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="大小" align="center" prop="filesize" width="100">
        <template slot-scope="scope">
          <span>{{ (scope.row.filesize/1024).toFixed(2)  }} Kb</span>
        </template>
      </el-table-column>

      <el-table-column label="上传时间" align="center" prop="uploadTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.uploadTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-document" @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:upload:edit']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['basic:upload:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改上传文件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文件" prop="filename">
          {{form.filename}}
        </el-form-item>
        <el-form-item label="url" prop="url">
          {{form.url}}
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.pony_upload_type" :value="form.type" />
          </template>
        </el-form-item>
        <el-form-item label="文件大小" prop="filesize">
          {{(form.filesize/1024).toFixed(2)}} Kb
        </el-form-item>
        <el-form-item label="原文件名" prop="originFilename">
          {{form.originFilename}}
        </el-form-item>
        <el-form-item label="上传时间" prop="uploadTime">
          {{ parseTime(form.uploadTime) }}
        </el-form-item>
        <el-form-item label="上传IP" prop="ip">
          {{ form.ip}}
        </el-form-item>
        <el-form-item label="上传者" prop="operator">
          {{ form.operator }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listUpload,
    getUpload,
    delUpload,
    addUpload,
    updateUpload
  } from "@/api/system/upload";

  export default {
    name: "Upload",
    dicts: ['pony_upload_type'],

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
        // 日期范围
        dateRange: [],
        // 总条数
        total: 0,
        // 上传文件表格数据
        uploadList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          filename: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询上传文件列表 */
      getList() {
        this.loading = true;
        listUpload(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.uploadList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          userId: null,
          url: null,
          filetype: null,
          filesize: null,
          mimetype: null,
          extparam: null,
          storage: null,
          sha1: null,
          newFilename: null,
          filename: null,
          originFilename: null,
          status: 0,
          uploadTime: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getUpload(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "上传文件详情";
        });
      },
     
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除编号为"' + ids + '"的文件？').then(function() {
          return delUpload(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('basic/upload/export', {
          ...this.queryParams
        }, `upload_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
