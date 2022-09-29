<template>
  <div class="app-container" :title="title">
    <el-form :model="form" ref="form" label-width="100px" v-loading="loading" :rules="rules" size="small">
      <el-row>
        <el-col :span="24">
          <el-form-item label="试卷名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入试卷名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="课程" prop="courseId">
            <el-select v-model="form.courseId" placeholder="请选择课程" clearable style="width:100%">
              <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
                :disabled="item.status == 1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单元" prop="sectionArray">
            <el-select v-model="form.sectionArray" placeholder="请选择单元" multiple clearable style="width:100%">
              <el-option v-for="item in sectionOptions" :key="item.id" :label="item.name" :value="item.id"
                :disabled="item.status == 1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="parseInt(dict.value)">
                {{dict.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="总分" prop="totalScore">
            <el-input type="number" v-model="form.totalScore" :min="1" :max="1000" label="总分">
              <i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合格" prop="passScore">
            <el-input type="number" v-model="form.passScore" :min="1" :max="1000" label="合格分数" style="width:100%">
              <i slot="suffix" style="font-style:normal;margin-right: 10px;">分</i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="考试时长" prop="times">
            <el-input type="number" v-model="form.times" :min="1" :max="1000" label="考试时长" style="width:100%">
              <i slot="suffix" style="font-style:normal;margin-right: 10px;">分钟</i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-form-item :key="index" :label="'第'+arabicToChinese((index+1))+'题'" required
        v-for="(item,index) in form.questionList">

        <el-row>
          <el-col :span="11">
            <el-input v-model="item.title" style="width: 98%" />
          </el-col>
          <el-col :span="8">
            <el-select v-model="item.type" placeholder="请选择题型" clearable style="width:40%">
              <el-option v-for="dict in dict.type.pony_question_type" :key="parseInt(dict.value)" :label="dict.label"
                :value="parseInt(dict.value)"></el-option>
            </el-select>

            <el-input type="number" v-model="item.quantity" :min="1" :max="1000" label="题数" @change="sumTotalScore()"
              style="width:30%">
              <i slot="suffix" style="font-style:normal;margin-right: 10px;">题</i>
            </el-input>
            <el-input type="number" v-model="item.score" :min="1" :max="1000" label="分值" @change="sumTotalScore()"
              style="width:30%">
              <i slot="suffix" style="font-style:normal;margin-right: 10px;">分/题</i>
            </el-input>
          </el-col>

          <el-col :span="5">
            <el-button type="text" class="link-left" style="margin-left: 10px" size="mini"
              @click=" handleCollapseQuestionGroup(item)">折叠
            </el-button>

            <el-button type="text" class="link-left" style="margin-left: 10px" size="mini"
              @click="handleAutoSelectQuestion(item)">
              自动
            </el-button>
            <el-button type="text" class="link-left" style="margin-left: 10px" size="mini"
              @click=" handleSelectQuestion(item)">
              选题
            </el-button>
            <el-button type="text" class="link-left" style="margin-left: 10px" size="mini"
              @click=" handleCleanQuestion(item)">清空
            </el-button>

            <el-button type="text" class="link-left" style="margin-left: 10px" size="mini"
              @click=" handleDeleteQuestionGroup(index)">删除
            </el-button>
          </el-col>

        </el-row>

        <el-card class="exampaper-item-box" v-if="item.isShow==true">
          <el-form-item :key="questionIndex" :label="''+(questionIndex+1)+'题 '" label-width="50px"
            v-for="(questionItem,questionIndex) in item.questionItems" style="margin-bottom: 3px ">
            <el-row>
              <el-col :span="22">
                {{questionItem.title}}
              </el-col>
              <el-col :span="2">
                <el-button type="text" size="mini" @click="handleRemoveQuestion(item,questionIndex)">删除
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-card>
      </el-form-item>

      <el-form-item>
        <el-row>
          <el-col :span="6">
            <el-checkbox v-model="ismade">立刻组卷</el-checkbox>
            <el-checkbox v-model="isauto" :disabled="ismade == false">自动选题</el-checkbox>
          </el-col>
          <el-col :span="16">
            <el-button type="primary" @click="submitForm">{{title}}</el-button>
            <el-button @click="cancel">关闭</el-button>
            <el-button type="success" @click="addQuestionGroup">添加大题</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="questionPage.showDialog" title="选题" width="70%">
      <el-form :model="questionPage.queryParam" ref="queryForm" :inline="true" size="mini">
        <el-row>
          <el-col :span="8">
            <el-form-item label="课程" prop="courseId" >
              <el-select v-model="questionPage.queryParam.courseId" placeholder="请选择课程"  clearable>
                <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
                  :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单元" >
              <el-select v-model="questionPage.queryParam.sectionArray" placeholder="请选择单元" multiple
                clearable>
                <el-option v-for="item in sectionOptions" :key="item.id" :label="item.name" :value="item.id"
                  :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="题型" >
              <el-select v-model="questionPage.queryParam.type"  clearable>
                <el-option v-for="dict in dict.type.pony_question_type" :key="parseInt(dict.value)" :label="dict.label"
                  :value="parseInt(dict.value)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="题目" prop="title">
              <el-input v-model="questionPage.queryParam.title" placeholder="请输入题目" clearable
                @keyup.enter.native="handleQuery" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="questionPage.queryParam.difficulty" placeholder="请选择难度" clearable>
                <el-option v-for="dict in dict.type.pony_question_difficulty" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="questionPage.listLoading" :data="questionPage.tableData"
        @selection-change="handleSelectionChange" border fit highlight-current-row style="width: 100%" size="mini">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="id" label="Id" align="center" width="60px" />
        <el-table-column label="题目" align="left" header-align="center" prop="title" />
        <el-table-column label="难度" align="center" prop="difficulty" width="60">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.pony_question_difficulty" :value="scope.row.difficulty" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="questionPage.total>0" :total="questionPage.total" :page-sizes="pageSizes"
        :page.sync="questionPage.queryParam.pageNum" :page-size.sync="questionPage.queryParam.pageSize"
        :limit.sync="questionPage.queryParam.pageSize" @pagination="search" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="questionPage.showDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmQuestionSelect">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapState,
    mapActions
  } from 'vuex'
  import Pagination from '@/components/Pagination'
  import {
    listPaper,
    getPaper,
    delPaper,
    addPaper,
    updatePaper
  } from "@/api/examination/paper";
  import {
    listQuestion,
    getQuestion,
    autoSelectQuestion
  } from "@/api/question/question";

  export default {
    components: {
      Pagination
    },
    dicts: ['sys_normal_disable', 'pony_manual_auto', 'pony_question_type', 'pony_question_difficulty'],
    data() {
      return {
        form: {
          id: null,
          name: '',
          questionList: [],
          // 知识单元列表
          sectionArray: null,
        },
        title: "新增",
        isauto: true,
        ismade: true,
        // 课程列表
        courseOptions: [],
        // 知识单元列表
        sectionOptions: [],
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请输入试卷名称',
          }],
          courseId: [{
            required: true,
            message: '请选择课程',
          }]
        },
        autoSelectParam: {
          type: null,
          sectionIds: null,
          courseId: null,
          quantity: 0,
        },

        pageSizes: [5, 10, 20, 50],
        questionPage: {
          multipleSelection: [],
          showDialog: false,
          queryParam: {
            id: null,
            title: '',
            type: null,
            sectionIds: null,
            sectionArray: null,
            courseId: null,
            pageSize: 5,
            pageNum: 1,
          },
          listLoading: true,
          tableData: [],
          total: 0
        },
        currentQuestionGroup: null
      }
    },
    created() {
      let path = this.$route.path
      let id = parseInt(path.slice(path.lastIndexOf("/") + 1))
      this.open = true
      if (id && parseInt(id) > 0) {
        this.handleUpdate(id)
      } else {
        this.handleAdd()
      }
    },
    methods: {
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        getPaper(0).then(response => {
          this.courseOptions = response.courses;
          this.sectionOptions = response.sections;
          this.initQuestionList();
          this.open = true;
          this.title = "新增";
        });
      },
      /** 修改按钮操作 */
      handleUpdate(id) {
        this.reset();
        let that = this
        that.form.questionList = [];
        getPaper(id).then(response => {
          this.courseOptions = response.courses;
          this.sectionOptions = response.sections;
          this.form.id = response.data.id;
          if (response.data.courseId == 0) {
            this.form.courseId = null;
          } else {
            this.form.courseId = response.data.courseId;;
          }
          this.form.sectionArray = response.data.sectionIds;
          this.form.name = response.data.name;
          if (response.data.isauto == 1) {
            this.isauto = true;
          } else {
            this.isauto = false;
          }
          if (response.data.ismade == 1) {
            this.ismade = true;
          } else {
            this.ismade = false;
          }
          this.form.times = response.data.times;
          this.form.totalScore = response.data.totalScore;
          this.form.passScore = response.data.passScore;
          this.form.status = response.data.status;
          let list = JSON.parse(response.data.questions);
          list.forEach((self, index) => {
            if (self != null) {
              let questionGroup = {};
              questionGroup.id = index + 1;
              questionGroup.show = true;
              questionGroup.title = self.title;
              questionGroup.quantity = self.quantity;
              if (self.type == 0) {
                questionGroup.type = null;
              } else {
                questionGroup.type = self.type;
              }
              questionGroup.score = self.score;
              questionGroup.questionItems = []
              if (self.questionItems != "") {
                let questionItems = JSON.parse(self.questionItems);
                questionItems.forEach((s, i) => {
                  let questionItem = {};
                  questionItem.id = s.id;
                  questionItem.title = s.title;
                  questionGroup.questionItems.push(questionItem);
                });
              }
              if (questionGroup.questionItems.length == 0) {
                questionGroup.isShow = false;
              } else {
                questionGroup.isShow = questionGroup.show;
              }
              that.form.questionList.push(questionGroup)
            }
          });
          that.open = true;
          that.title = "修改";
        });
      },
      /** 删除按钮操作 */
      handleDeleteQuestionGroup(index) {
        this.form.questionList.splice(index, 1);
        this.sumTotalScore();
      },
      handleCollapseQuestionGroup(item) {
        item.show = !item.show;
        if (item.questionItems.length == 0) {
          item.isShow = false;
        } else {
          item.isShow = ! item.isShow;
        }

      },

      /** 提交按钮 */
      submitForm() {
        let data = {};
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.open = true
            let iserror = false;
            data.id = this.form.id;
            data.courseId = this.form.courseId;
            data.sectionIds = this.form.sectionArray;
            data.name = this.form.name;
            if (this.isauto == true) {
              data.isauto = 1;
            } else {
              data.isauto = 0;
            }
            if (this.ismade == true) {
              data.ismade = 1;
            } else {
              data.ismade = 0;
            }
            data.times = this.form.times;
            data.totalScore = this.form.totalScore;
            data.passScore = this.form.passScore;
            data.status = this.form.status;
            let questionList = [];
            this.form.questionList.forEach((self, index) => {
              if (self.title == null || self.title == "") {
                this.$modal.msgError("请输入第" + this.arabicToChinese(index + 1) + "题名称");
                iserror = true;
                return;
              }

              let questionGroup = {};
              questionGroup.id = index + 1;
              questionGroup.title = self.title;
              questionGroup.quantity = self.quantity;
              questionGroup.score = self.score;
              questionGroup.type = self.type;
              questionGroup.courseId = this.form.courseId;
              questionGroup.questionItems = [];
              let questionArr = [];
              self.questionItems.forEach((s, i) => {
                questionArr.push(s.id);
                let questionItem = {};
                questionItem.id = s.id;
                questionItem.title = s.title;
                //questionGroup.questionItems.push(questionItem);
              });
              questionGroup.questionIds = questionArr.join();
              questionList.push(questionGroup);
            });
            if (iserror == false) {
              data.questions = JSON.stringify(questionList)
              if (this.form.id != null) {
                updatePaper(data).then(response => {
                  this.$modal.msgSuccess("试卷修改保存成功");
                  this.open = false;
                  this.handleUpdate(this.form.id);
                });
              } else {
                addPaper(data).then(response => {
                  this.$modal.msgSuccess("试卷新增保存成功");
                  this.open = false;
                  this.reset();
                  this.initQuestionList();
                  this.title = "新增";
                });
              }
            }
          }
        })
      },

      sumTotalScore() {
        let totalScore = 0;
        let quantity = 0;
        let score = 0;

        this.form.questionList.forEach((self, index) => {
          if (self.quantity == null) {
            quantity = 0
          } else {
            quantity = self.quantity
          }
          if (self.score == null) {
            score = 0
          } else {
            score = self.score
          }
          totalScore = totalScore + (self.quantity * self.score);
        })
        this.form.totalScore = totalScore;
        this.form.passScore = Math.ceil(totalScore * 0.6);
      },

      initQuestionList() {
        this.form.questionList.push({
          title: '单项选择题',
          type: 1,
          quantity: 10,
          score: 2,
          isShow: false,
          questionItems: []
        })
        this.form.questionList.push({
          title: '多项选择题',
          type: 2,
          quantity: 10,
          score: 2,
          isShow: false,
          questionItems: []
        })
        this.form.questionList.push({
          title: '判断题',
          type: 3,
          quantity: 10,
          score: 2,
          isShow: false,
          questionItems: []
        })
        this.form.questionList.push({
          title: '填空题',
          type: 4,
          quantity: 5,
          score: 4,
          isShow: false,
          questionItems: []
        })
        this.form.questionList.push({
          title: '简答题',
          type: 5,
          quantity: 2,
          score: 10,
          isShow: false,
          questionItems: []
        })
      },
      cancel() {
        const obj = {
          path: "/examination/paper-edit",
          query: {
            t: Date.now(),
            pageNum: this.$route.query.pageNum
          }
        };
        this.$tab.closeOpenPage(obj);
        this.$router.push('/examination/paper');

      },
      addQuestionGroup() {
        this.form.questionList.push({
          title: '',
          type: null,
          quantity: 1,
          score: 1,
          isShow: false,
          questionItems: []
        });
        this.sumTotalScore();
      },

      removeQuestionGroup(questionGroup) {
        this.form.questionList.remove(questionGroup)
      },
      handleAutoSelectQuestion(questionGroup) {
        this.currentQuestionGroup = questionGroup;
        if (this.form.courseId == null || this.form.courseId == 0) {
          this.$modal.msgError("自动选题请先选择课程");
          return false;
        }
        if (questionGroup.type == null || questionGroup.type == 0) {
          this.$modal.msgError("自动选题请先选择题型");
          return false;
        }
        if (questionGroup.questionItems.length >= questionGroup.quantity) {
          this.$modal.msgWarning("该题数量已经够了");
          return true;
        }

        this.autoSelectParam.courseId = this.form.courseId;
        this.autoSelectParam.type = questionGroup.type;
        this.autoSelectParam.quantity = questionGroup.quantity;
        this.autoSelectParam.sectionIds = "";
        if (this.form.sectionArray != null) {
          this.autoSelectParam.sectionIds = this.form.sectionArray.join();
        }

        let questionArr = [];
        questionGroup.questionItems.forEach((s, i) => {
          questionArr.push(s.id);
        });
        this.autoSelectParam.questionIds = questionArr.join();
        autoSelectQuestion(this.autoSelectParam).then(response => {
          this.currentQuestionGroup.questionItems = [];
          if (response.total > 0) {
            response.rows.forEach(q => {
              this.currentQuestionGroup.questionItems.push(q);
            })
            this.currentQuestionGroup.isShow = true;
          }
          if (response.total < this.currentQuestionGroup.quantity) {
            this.$modal.msgWarning("满足该题的习题库数量不足");
            return false;
          } else {
            return true;
          }
        })
        return false;
      },
      handleCleanQuestion(questionGroup) {
        questionGroup.questionItems.forEach((s, i) => {
          questionGroup.questionItems.splice(0, questionGroup.questionItems.length);
        })
        questionGroup.isShow = false;
      },
      handleSelectQuestion(questionGroup) {
        this.currentQuestionGroup = questionGroup;
        this.questionPage.queryParam.courseId = this.form.courseId;
        this.questionPage.queryParam.type = questionGroup.type;
        this.questionPage.queryParam.sectionArray = this.form.sectionArray;
        if (this.form.sectionArray == null) {
          this.questionPage.queryParam.sectionIds = "";
        } else {
          this.questionPage.queryParam.sectionIds = this.form.sectionArray.join();
        }
        this.questionPage.showDialog = true
        this.search()
      },
      handleRemoveQuestion(questionGroup, questionIndex) {
        questionGroup.questionItems.splice(questionIndex,1);
        if ( questionGroup.questionItems.length == 0) {
          questionGroup.isShow = false;
        }
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.search();
      },
      handleQuery() {
        this.questionPage.queryParam.pageNum = 1
        this.questionPage.queryParam.sectionIds = this.questionPage.queryParam.sectionArray.join();
        this.search()
      },
      confirmQuestionSelect() {
        let that = this;

        let questionArr = [];
        this.currentQuestionGroup.questionItems.forEach((s, i) => {
          questionArr.push(s.id);
        });
        this.questionPage.multipleSelection.forEach(q => {
          if (questionArr.includes(q.id) == false) {
            getQuestion(q.id).then(response => {
              that.currentQuestionGroup.questionItems.push(response.data);
              questionArr.push(q.id);
              this.currentQuestionGroup.isShow = true;
            })
          }
        })

        this.questionPage.showDialog = false
      },
      levelChange() {
        this.form.courseId = null
        this.courseFilter = this.courses.filter(data => data.level === this.form.level)
      },
      search() {
        this.questionPage.listLoading = true
        /** 查询习题列表 */
        listQuestion(this.questionPage.queryParam).then(response => {
          this.questionPage.tableData = response.rows;
          this.questionPage.total = response.total;
          this.questionPage.listLoading = false
        })
      },
      arabicToChinese(num) {
        let numArr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        let numLimit = ["亿", "万", ""]; //设置数字上限
        let numUnit = ["千", "百", "十", ""];
        //num四位数是一个阶段对应 numLimit 每个阶段对应一个 numUnit，每个数字对应numArr。
        num = num.toString();
        num = num.split('');
        while (num.length < numLimit.length * 4) {
          num.unshift('');
        }
        let numLength = num.length;
        let s = "";
        let limit = Math.ceil(numLength / 4);
        for (let i = 1; i <= limit; i++) {
          let start = (i - 1) * 4;
          let end = i * 4;
          let limitNum = num.slice(start, end);
          for (let j = 0; j < limitNum.length; j++) {
            if (limitNum[j] !== '') {
              let char = numArr[limitNum[j]];
              let unit = numUnit[j];
              if (limitNum[j] == 0) {
                unit = '';
              }
              s += char + unit;
            }
          }
          let hasValue = limitNum.filter(val => {
            return val !== '';
          });
          s = s.replace(/(零{2,})/, '零');
          if (s !== '零') {
            s = s.replace(/(零*)$/, ''); //结尾去掉零
          }
          if (hasValue.length > 0) {
            s += numLimit[i - 1];
          }
        }
        s = s.replace(/^一十/, '十');
        return s;
      },
      handleSelectionChange(val) {
        this.questionPage.multipleSelection = val
      },
      questionTypeFormatter(row, column, cellValue, index) {
        return this.enumFormat(this.questionTypeEnum, cellValue)
      },
      subjectFormatter(row, column, cellValue, index) {
        return this.subjectEnumFormat(cellValue)
      },
      reset() {
        let lastId = this.form.id
        this.form = {
          id: null,
          courseId: null,
          sectionArray: null,
          questionList: [],
          name: null,
          setting: null,
          questions: null,
          isauto: 1,
          ismade: null,
          times: 90,
          totalScore: 100,
          passScore: 60,
          status: 0
        }
        //this.form.id = lastId
        this.resetForm("form");
      },
    }
  }
</script>

<style lang="scss">
  .exampaper-item-box {
    .q-title {
      margin: 0px 5px 0px 5px;
    }

    .q-item-content {}
  }
</style>
