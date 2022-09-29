<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="studentName">
        <el-input v-model="queryParams.studentName" placeholder="请输入学员姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="isdecide">
        <el-select v-model="queryParams.isdecide" placeholder="批阅状态" clearable>
          <el-option v-for="dict in dict.type.pony_exam_decide_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="日期">
        <el-date-picker v-model="dateRange" value-format="yyyy-MM-dd" style="width: 260px" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>

      <el-form-item label="课程" prop="courseId">
        <el-select v-model="queryParams.courseId" @change="selectCourseChanged" placeholder="请选择课程" clearable>
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.status == 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试卷" prop="paperId">
        <el-select v-model="queryParams.paperId" placeholder="请选择试卷" clearable style="width:100%">
          <el-option v-for="item in paperOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>




      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="examStudentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="60" />
      <el-table-column label="学员姓名" align="center" prop="studentName" width="80" />
      <el-table-column label="考场名称" align=" left" header-align="center" prop="examName" />

      <el-table-column label="分数" align="center" prop="score" width="60" />
      <el-table-column label="合格" align="center" prop="ispass" width="60">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pony_exam_pass_status" :value="scope.row.ispass" />
        </template>
      </el-table-column>
      <el-table-column label="批阅日期" align="center" prop="operatorTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operatorTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批阅状态" align="center" prop="isdecide" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pony_exam_decide_status" :value="scope.row.isdecide" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit"
          @click="$router.push({path:'/examination/decide-edit/index/'+scope.row.id})"
            v-hasPermi="['examination:decide:edit']">批阅</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改考试学员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            {{form.examName}}
            考生：{{form.studentName}}


            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>


        </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listDecide,
    getDecide,
    updateDecide,
    getPapers
  } from "@/api/examination/decide";

  export default {
    name: "Decide",
    dicts: ['pony_question_type', 'pony_exam_decide_status', 'pony_exam_pass_status'],
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
        // 日期范围
        dateRange: [],
        // 考试学员表格数据
        examStudentList: [],
        //课程下来列表
        courseOptions: [],
        // 试卷下拉列表
        paperOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          examId: null,
          examName: null,
          studentName: null,
          courseId: null,
          paperId: null,
          ismanual: null,
          ip: null,
          type: null,
          answerList: null,
          scoreList: null,
          score: null,
          beginTime: null,
          endTime: null,
          state: null,
          isdecide: null,

        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          courseId: [{
            required: true,
            message: "课程ID不能为空",
            trigger: "change"
          }],
          paperId: [{
            required: true,
            message: "试卷ID不能为空",
            trigger: "blur"
          }],
          ismanual: [{
            required: true,
            message: "交卷标志:(0-自动1-手动)不能为空",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "类型不能为空",
            trigger: "change"
          }],
          score: [{
            required: true,
            message: "总得分不能为空",
            trigger: "blur"
          }],
          beginTime: [{
            required: true,
            message: "开卷时间不能为空",
            trigger: "blur"
          }],
          endTime: [{
            required: true,
            message: "交卷时间不能为空",
            trigger: "blur"
          }],


        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询考试学员列表 */
      getList() {
        this.loading = true;
        listDecide(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.examStudentList = response.rows;
          this.courseOptions = response.courses;
          this.examStudentList.forEach((self, index) => {
            if (self.isdecide == null || self.isdecide == 0) {
              self.ispass = null;
              self.operator_time = null;
              self.score = null;
            }
          });
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
          examId: null,
          examName: null,
          studentId: null,
          studentName: null,
          courseId: null,
          paperId: null,
          ismanual: null,
          ip: null,
          type: null,
          answerList: null,
          scoreList: null,
          score: null,
          beginTime: null,
          endTime: null,
          state: null,
          isdecide: null,
          ispass: null,
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
      handleDecide(row) {
        this.reset();
        const id = row.id || this.ids
        getDecide(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "批阅试卷";
        });
      },

      //选课程导致试卷列表变化
      selectCourseChanged(value) {
        if (value == "") {
          value = 0;
        }
        this.queryParams.paperId = null;
        getPapers(value).then(response => {
          this.paperOptions = response.papers;
        });
      },

      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              decide(this.form).then(response => {

                this.$modal.msgSuccess("批阅成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },


    }
  };
</script>
