<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入考场名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="isenable">
        <el-select v-model="queryParams.isenable" placeholder="启用状态" clearable>
          <el-option v-for="dict in dict.type.pony_exam_enable_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="dateRange" value-format="yyyy-MM-dd" style="width: 260px" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="queryParams.courseId" placeholder="请选择课程" clearable>
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.status == 1"></el-option>
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
          v-hasPermi="['examination:exam:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['examination:exam:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['examination:exam:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['examination:exam:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="examList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="60" />
      <el-table-column label="考场名称" align=" left" header-align="center" prop="name" />
      <el-table-column label="状态" align="center" prop="isenable" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pony_exam_enable_status" :value="scope.row.isenable" />
        </template>
      </el-table-column>
      <el-table-column label="开考时间" align="center" prop="startTime" width="160" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width " width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-job" @click="handleEnable(scope.row)"
            v-hasPermi="['examination:exam:edit']" v-if="scope.row.isenable==0">启用</el-button>
          <el-button size="mini" type="text" icon="el-icon-job" @click="handleCancel(scope.row)"
            v-hasPermi="['examination:exam:edit']" v-if="scope.row.isenable==1">取消</el-button>
          <el-button size="mini" type="text" icon="el-icon-job" @click="handleFinish(scope.row)"
            v-hasPermi="['examination:exam:edit']" v-if="scope.row.isenable==1">结束</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['examination:exam:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['examination:exam:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改考试对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="考场名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入考场名称" />
            </el-form-item>
            <el-form-item label="课程" prop="courseId">
              <el-select v-model="form.courseId" @change="selectCourseChanged" placeholder="请选择课程" clearable
                style="width:100%">
                <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
                  :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="试卷" prop="paperId">
              <el-select v-model="form.paperId" @change="selectPaperChanged" placeholder="请选择试卷" clearable
                style="width:100%">
                <el-option v-for="item in paperOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级">
              <el-select v-model="form.teamIds" placeholder="请选择班级" multiple clearable style="width:100%">
                <el-option v-for="item in teamOptions" :key="item.id" :label="item.name" :value="item.id"
                  :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开考时间" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开考时间" style="width:100%"
                @change="timesChanged" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试时长" prop="times">
              <el-input type="number" v-model="form.times" @change="timesChanged" :min="1" :max="1000" label="考试时长">
                <i slot="suffix" style="font-style:normal;margin-right: 10px;">分钟</i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="stopTime">
              <el-date-picker v-model="form.stopTime" type="datetime" placeholder="考试结束时间" disabled style="width:100%"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失效时间" prop="expireTime">
              <el-date-picker v-model="form.expireTime" type="datetime" placeholder="请选择失效时间" style="width:100%"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="form.memo" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listExam,
    getExam,
    getPapers,
    delExam,
    addExam,
    updateExam,
    enableExam,
    cancelExam,
    finishExam
  } from "@/api/examination/exam";
  import {
    formatDate
  } from "@/utils/index.js";
  export default {
    name: "Exam",
    dicts: ['pony_exam_enable_status'],
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
        // 考试表格数据
        examList: [],
        // 课程列表
        courseOptions: [],
        // 班级列表
        teamOptions: [],
        // 试卷列表
        paperOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 日期范围
        dateRange: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          courseId: null,
          startTime: null,
          isenable: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [{
            required: true,
            message: "考试名称不能为空",
          }],
          courseId: [{
            required: true,
            message: "请选择课程",
          }],
          paperId: [{
            required: true,
            message: "请选择试卷",
          }],
          startTime: [{
            required: true,
            message: "开考时间不能为空",
          }],
          times: [{
            required: true,
            message: "考试时长不能为空",
          }],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询考试列表 */
      getList() {
        this.loading = true;
        listExam(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.courseOptions = response.courses;
          this.examList = response.rows;
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
          name: null,
          paperId: null,
          courseId: null,
          operatorId: null,
          operator: null,
          questions: null,
          teams: null,
          teamIds: null,
          students: null,
          startTime: null,
          stopTime: null,
          totalScore: null,
          passScore: null,
          times: null,
          createTime: null,
          updateTime: null,
          isenable: null,
          memo: null,
          expireTime: null
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
      //选课程导致试卷列表变化
      selectCourseChanged(value) {
        if (value == "") {
          value = 0;
        }
        getPapers(value).then(response => {
          this.form.paperId = null;
          this.paperOptions = response.papers;
        });
      },

      //选试卷导致试卷列表变化
      selectPaperChanged(value) {
        if (value == "") {
          value = 0;
        }
        let paper = this.getPaper(value);
        if (paper != null) {
          this.form.times = paper.times;
        }
      },

      //开考时间与结束时间的变化
      timesChanged(value) {
        this.form.stopTime = formatDate(Date.parse(this.form.startTime) + (60000 * this.form.times));
        this.form.expireTime = this.form.stopTime;
      },

      getPaper(value) {
        let paper = {}
        this.paperOptions.forEach(function(item) {
          if (item.id == value) {
            paper = item;
          }
        });
        return paper;
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        getExam(0).then(response => {
          this.courseOptions = response.courses;
          this.teamOptions = response.teams;
          this.paperOptions = response.papers;

          this.open = true;
          this.title = "新增考场";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getExam(id).then(response => {
          this.courseOptions = response.courses;
          this.teamOptions = response.teams;
          this.paperOptions = response.papers;
          this.form = response.data;
          this.open = true;
          this.title = "修改考场";
        });
      },

      /** 启用考场操作 */
      handleEnable(row) {
        const id = row.id || this.ids
        this.$modal.confirm('确认启用Id编号为"' + id + '"考场？').then(function() {
          return enableExam(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("启用考场成功");
        }).catch(() => {});
      },


      /** 取消考场操作 */
      handleCancel(row) {
        const id = row.id || this.ids
        this.$modal.confirm('确认取消Id编号为"' + id + '"考场？').then(function() {
          return cancelExam(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("取消考场成功");
        }).catch(() => {});
      },

      /** 结束考场操作 */
      handleFinish(row) {
        const id = row.id || this.ids
        this.$modal.confirm('确认完成Id号为"' + id + '"考场考试？').then(function() {
          return finishExam(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("结束考场成功");
        }).catch(() => {});
      },

      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateExam(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addExam(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除考试编号为"' + ids + '"的数据项？').then(function() {
          return delExam(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('examination/exam/export', {
          ...this.queryParams
        }, `exam_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
