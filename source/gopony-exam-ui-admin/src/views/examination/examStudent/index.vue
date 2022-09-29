<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="考试ID" prop="examId">
        <el-input
          v-model="queryParams.examId"
          placeholder="请输入考试ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考试名称" prop="examName">
        <el-input
          v-model="queryParams.examName"
          placeholder="请输入考试名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学员ID" prop="studentId">
        <el-input
          v-model="queryParams.studentId"
          placeholder="请输入学员ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考试名称" prop="studentName">
        <el-input
          v-model="queryParams.studentName"
          placeholder="请输入考试名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试卷ID" prop="paperId">
        <el-input
          v-model="queryParams.paperId"
          placeholder="请输入试卷ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="交卷标志:(0-自动1-手动)" prop="ismanual">
        <el-input
          v-model="queryParams.ismanual"
          placeholder="请输入交卷标志:(0-自动1-手动)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="IP" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入IP"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in dict.type.pony_question_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总得分" prop="score">
        <el-input
          v-model="queryParams.score"
          placeholder="请输入总得分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开卷时间" prop="beginTime">
        <el-date-picker clearable
          v-model="queryParams.beginTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开卷时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交卷时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择交卷时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考试状态:(0-未开考1-已开考2-已交卷9-已取消)" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入考试状态:(0-未开考1-已开考2-已交卷9-已取消)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评阅标志:(0-未批阅1-已批阅)" prop="isdecide">
        <el-input
          v-model="queryParams.isdecide"
          placeholder="请输入评阅标志:(0-未批阅1-已批阅)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合格标志:(0-不合格1-合格)" prop="ispass">
        <el-input
          v-model="queryParams.ispass"
          placeholder="请输入合格标志:(0-不合格1-合格)"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批阅人id" prop="operatorId">
        <el-input
          v-model="queryParams.operatorId"
          placeholder="请输入批阅人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批阅人" prop="operator">
        <el-input
          v-model="queryParams.operator"
          placeholder="请输入批阅人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批阅时间" prop="operatorTime">
        <el-date-picker clearable
          v-model="queryParams.operatorTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择批阅时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['examination:examStudent:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['examination:examStudent:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['examination:examStudent:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['examination:examStudent:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="examStudentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Id" align="center" prop="id" />
      <el-table-column label="考试ID" align="center" prop="examId" />
      <el-table-column label="考试名称" align="center" prop="examName" />
      <el-table-column label="学员ID" align="center" prop="studentId" />
      <el-table-column label="考试名称" align="center" prop="studentName" />
      <el-table-column label="课程ID" align="center" prop="courseId" />
      <el-table-column label="试卷ID" align="center" prop="paperId" />
      <el-table-column label="交卷标志:(0-自动1-手动)" align="center" prop="ismanual" />
      <el-table-column label="IP" align="center" prop="ip" />
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pony_question_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="答题列表" align="center" prop="answerList" />
      <el-table-column label="得分列表" align="center" prop="scoreList" />
      <el-table-column label="总得分" align="center" prop="score" />
      <el-table-column label="开卷时间" align="center" prop="beginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交卷时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试状态:(0-未开考1-已开考2-已交卷9-已取消)" align="center" prop="state" />
      <el-table-column label="评阅标志:(0-未批阅1-已批阅)" align="center" prop="isdecide" />
      <el-table-column label="合格标志:(0-不合格1-合格)" align="center" prop="ispass" />
      <el-table-column label="批阅人id" align="center" prop="operatorId" />
      <el-table-column label="批阅人" align="center" prop="operator" />
      <el-table-column label="批阅时间" align="center" prop="operatorTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operatorTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['examination:examStudent:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['examination:examStudent:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改考试学员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="考试ID" prop="examId">
          <el-input v-model="form.examId" placeholder="请输入考试ID" />
        </el-form-item>
        <el-form-item label="考试名称" prop="examName">
          <el-input v-model="form.examName" placeholder="请输入考试名称" />
        </el-form-item>
        <el-form-item label="学员ID" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学员ID" />
        </el-form-item>
        <el-form-item label="考试名称" prop="studentName">
          <el-input v-model="form.studentName" placeholder="请输入考试名称" />
        </el-form-item>
        <el-form-item label="试卷ID" prop="paperId">
          <el-input v-model="form.paperId" placeholder="请输入试卷ID" />
        </el-form-item>
        <el-form-item label="交卷标志:(0-自动1-手动)" prop="ismanual">
          <el-input v-model="form.ismanual" placeholder="请输入交卷标志:(0-自动1-手动)" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in dict.type.pony_question_type"
              :key="dict.value"
              :label="dict.label"
:value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="答题列表" prop="answerList">
          <el-input v-model="form.answerList" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="得分列表" prop="scoreList">
          <el-input v-model="form.scoreList" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="总得分" prop="score">
          <el-input v-model="form.score" placeholder="请输入总得分" />
        </el-form-item>
        <el-form-item label="开卷时间" prop="beginTime">
          <el-date-picker clearable
            v-model="form.beginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开卷时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交卷时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择交卷时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考试状态:(0-未开考1-已开考2-已交卷9-已取消)" prop="state">
          <el-input v-model="form.state" placeholder="请输入考试状态:(0-未开考1-已开考2-已交卷9-已取消)" />
        </el-form-item>
        <el-form-item label="评阅标志:(0-未批阅1-已批阅)" prop="isdecide">
          <el-input v-model="form.isdecide" placeholder="请输入评阅标志:(0-未批阅1-已批阅)" />
        </el-form-item>
        <el-form-item label="合格标志:(0-不合格1-合格)" prop="ispass">
          <el-input v-model="form.ispass" placeholder="请输入合格标志:(0-不合格1-合格)" />
        </el-form-item>
        <el-form-item label="批阅人id" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入批阅人id" />
        </el-form-item>
        <el-form-item label="批阅人" prop="operator">
          <el-input v-model="form.operator" placeholder="请输入批阅人" />
        </el-form-item>
        <el-form-item label="批阅时间" prop="operatorTime">
          <el-date-picker clearable
            v-model="form.operatorTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择批阅时间">
          </el-date-picker>
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
import { listExamStudent, getExamStudent, delExamStudent, addExamStudent, updateExamStudent } from "@/api/examination/examStudent";

export default {
  name: "ExamStudent",
  dicts: ['pony_question_type'],
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
      // 考试学员表格数据
      examStudentList: [],
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
        operatorId: null,
        operator: null,
        operatorTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        examId: [
          { required: true, message: "考试ID不能为空", trigger: "blur" }
        ],
        studentId: [
          { required: true, message: "学员ID不能为空", trigger: "blur" }
        ],
        courseId: [
          { required: true, message: "课程ID不能为空", trigger: "change" }
        ],
        paperId: [
          { required: true, message: "试卷ID不能为空", trigger: "blur" }
        ],
        ismanual: [
          { required: true, message: "交卷标志:(0-自动1-手动)不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        score: [
          { required: true, message: "总得分不能为空", trigger: "blur" }
        ],
        beginTime: [
          { required: true, message: "开卷时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "交卷时间不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "考试状态:(0-未开考1-已开考2-已交卷9-已取消)不能为空", trigger: "blur" }
        ],
        isdecide: [
          { required: true, message: "评阅标志:(0-未批阅1-已批阅)不能为空", trigger: "blur" }
        ],
        ispass: [
          { required: true, message: "合格标志:(0-不合格1-合格)不能为空", trigger: "blur" }
        ],
        operatorId: [
          { required: true, message: "批阅人id不能为空", trigger: "blur" }
        ],
        operator: [
          { required: true, message: "批阅人不能为空", trigger: "blur" }
        ],
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
      listExamStudent(this.queryParams).then(response => {
        this.examStudentList = response.rows;
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
        operatorId: null,
        operator: null,
        operatorTime: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增考试学员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExamStudent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考试学员";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateExamStudent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addExamStudent(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除考试学员编号为"' + ids + '"的数据项？').then(function() {
        return delExamStudent(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('examination/examStudent/export', {
        ...this.queryParams
      }, `examStudent_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
