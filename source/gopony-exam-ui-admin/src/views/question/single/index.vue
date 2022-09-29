<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="题目" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入题目" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="queryParams.courseId" placeholder="请选择课程" clearable>
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.status == 1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单元" prop="sectionId">
        <el-select v-model="queryParams.sectionId" placeholder="请选择单元" clearable>
          <el-option v-for="item in sectionOptions" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.status == 1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="难度" prop="difficulty">
        <el-select v-model="queryParams.difficulty" placeholder="请选择难度" clearable>
          <el-option v-for="dict in dict.type.pony_question_difficulty" :key="dict.value" :label="dict.label"
            :value="dict.value" />
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
          v-hasPermi="['question:single:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['question:single:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['question:single:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['question:single:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Id" align="center" prop="id" width="60" />
      <el-table-column label="题目" align="left" header-align="center" prop="title" />
      <el-table-column label="排序" align="center" prop="weigh" width="60" />
      <el-table-column label="难度" align="center" prop="difficulty" width="60">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pony_question_difficulty" :value="scope.row.difficulty" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="60">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['question:single:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['question:single:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改习题对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础内容" name="first">
            <el-row>
              <el-col :span="12">
                <el-form-item label="课程" prop="courseId">
                  <el-select v-model="form.courseId" placeholder="请选择课程" clearable style="width:100%">
                    <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
                      :disabled="item.status == 1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单元" prop="sectionId">
                  <el-select v-model="form.sectionId" placeholder="请选择单元" clearable style="width:100%">
                    <el-option v-for="item in sectionOptions" :key="item.id" :label="item.name" :value="item.id"
                      :disabled="item.status == 1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="题目" prop="content">
                  <question-editor v-model="form.content" :min-height="180"  :height="280" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="选项数" prop="quantity">
                  <el-input-number v-model="form.quantity" :min="1" :max="10" label="选项数" style="width:100%">
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="批阅方式" prop="isauto">
                  <el-radio-group v-model="form.isauto">
                    <el-radio v-for="dict in dict.type.pony_manual_auto" :key="dict.value"
                      :label="parseInt(dict.value)">
                      {{dict.label}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="难度" prop="difficulty">
                  <el-select v-model="form.difficulty" placeholder="请选择难度">
                    <el-option v-for="dict in dict.type.pony_question_difficulty" :key="dict.value" :label="dict.label"
                      :value="parseInt(dict.value)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="答案" prop="answer">
                  <el-input v-model="form.answer" placeholder="请输入答案" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="解析说明" name="second">
            <el-row>
              <el-col :span="24">
                <el-form-item label="解析" prop="analysis">
                  <question-editor v-model="form.analysis" :min-height="180" :height="280" placeholder="请输入解析" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="显示排序" prop="weigh">
                  <el-input-number v-model="form.weigh" :min="0" :max="1000000" label="显示排序" style="width:100%">
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.status">
                    <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value"
                      :label="parseInt(dict.value)">
                      {{dict.label}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注" prop="attachment">
                  <el-input v-model="form.attachment" placeholder="请输入备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
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
    listQuestion,
    getQuestion,
    delQuestion,
    addQuestion,
    updateQuestion
  } from "@/api/question/single";
  // 习题编辑组件
  import QuestionEditor from "@/components/QuestionEditor"
  export default {
    name: "Question",
    dicts: ['sys_normal_disable', 'pony_question_difficulty', 'pony_manual_auto'],
    components: {
      QuestionEditor
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        //tab
        activeName: "first",
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
        // 课程列表
        courseOptions: [],
        // 知识单元列表
        sectionOptions: [],
        // 习题表格数据
        questionList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          courseId: null,
          sectionId: null,
          type: null,
          isauto: null,
          title: null,
          difficulty: null,
          status: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          courseId: [{
            required: true,
            message: "课程不能为空",
            trigger: "blur"
          }],

          content: [{
            required: true,
            message: "题目不能为空",
            trigger: "blur"
          }],
          quantity: [{
            required: true,
            message: "可选数量不能为空",
            trigger: "blur"
          }],
          answer: [{
            required: true,
            message: "答案不能为空",
            trigger: "blur"
          }],
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询习题列表 */
      getList() {
        this.loading = true;
        listQuestion(this.queryParams).then(response => {
          this.courseOptions = response.courses;
          this.sectionOptions = response.sections;

          this.questionList = response.rows;
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
          courseId: null,
          pid: null,
          sectionId: null,
          type: null,
          isauto: 1,
          title: null,
          content: null,
          quantity: 4,
          answer: null,
          analysis: null,
          operatorId: null,
          operator: null,
          weigh: null,
          difficulty: null,
          status: 0,
          attachment: null,
          createTime: null,
          updateTime: null
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        getQuestion(0).then(response => {
          this.courseOptions = response.courses;
          this.sectionOptions = response.sections;
          this.open = true;
          this.title = "新增单选题";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getQuestion(id).then(response => {
          this.courseOptions = response.courses;
          this.sectionOptions = response.sections;
          this.form = response.data;
          this.open = true;
          this.title = "修改单选题";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateQuestion(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addQuestion(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除习题编号为"' + ids + '"的数据项？').then(function() {
          return delQuestion(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('question/single/export', {
          ...this.queryParams
        }, `question_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
