<template>
  <div class="app-container" style="padding: 5px;">
    <el-row :gutter="20">
      <el-col :span="18" :xs="24">
        <div style="margin-left: 2%;">
          <el-tabs size="mini" @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in form.questionList" :key="index" size="mini" :name="index+''"
              :label="'第'+arabicToChinese(index+1)+'题' ">
              <div class="nav_card">
                <div v-for="(questionItem,questionIndex) in item.questionItems" class="nav_item">
                  <el-button
                    style="width: 18px; height: 18px;font-size: 5px;padding:0px; pavertical-align:middle; text-align:center;"
                    size="mini" circle :type="questionItem.buttonType" @click="toQuestion(questionItem)">
                    {{ questionIndex+1 }}
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="6" :xs="24">
        <div style="text-align:center;vertical-align:middle;margin: 1px;">
          <span style="text-align: center;font-size: 10px; ">批阅进度 {{accomplish}}/{{total}}</span>&nbsp;&nbsp;
          <span style="text-align: center;font-size: 10px; ">得分</span><span
            style="text-align: center; font-size: 30px;color:red;"> {{form.score}}</span>
        </div>
        <div style="text-align:center;vertical-align:middle;">
          <el-button type="danger" @click="handleSubmitDecide" size="small">批阅</el-button>
          <el-button type="primary" @click="handleSaveDecide" size="small">保存</el-button>
          <el-button @click="cancel" size="small">关闭</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!--试卷批阅区-->
      <el-col :span="24" :xs="24">
        <div style="height: 30px; margin-bottom: 5px;margin-left: 2%;margin-right: 2%;">
          <el-row>
            <el-col :span="24">
              <span style="text-align: center;display:block;font-size: 20px;"> {{ form.paperName }}</span>
            </el-col>
            <el-col :span="24">
              <span style="text-align: center;display:block;font-size: 12px;"> (总分:{{form.totalScore}}分
                时间:{{form.times}}分钟)</span>
            </el-col>
          </el-row>
        </div>

        <div class="paper" :style="{height:paperHeight + 'px'}">
          <el-form :model="form" ref="form" label-width="100px" v-loading="loading" :rules="rules" size="small">
            <el-row>
              <el-col :span="24">
                <section :key="index" required v-for="(item,index) in form.questionList">
                  <span size="small">{{arabicToChinese((index+1))+'、'}}</span>
                  <span><strong>{{item.title +'(每小题'+item.score+'分,共'+item.totalScore+'分)'}}</strong></span>
                  <el-card class="exampaper-item-box">
                    <el-form-item :key="questionIndex" :label="''+(questionIndex+1)+'、 '" label-width="40px"
                      v-for="(questionItem,questionIndex) in item.questionItems" :ID="questionItem.code"
                      style="margin-bottom: 3px ">
                      <el-row>
                        <el-col :span="17" v-if="questionItem.type<=3">
                          <div class="question_container" v-html="questionItem.content"></div>
                        </el-col>
                        <el-col :span="2" v-if="questionItem.type<=3">
                          <span>( {{questionItem.doAnswer}} )</span>
                        </el-col>
                        <el-col :span="19" v-if="questionItem.type==4">
                          <div class="question_container" v-html="questionItem.content"></div>
                          <div v-for="(optionItem,optionIndex) in questionItem.options" :key="optionIndex">
                            <el-input type="text" class="rule-input-edit" v-model="optionItem.subDoAnswer"
                              :placeholder="optionItem.placeholder" readonly>
                            </el-input>
                          </div>
                        </el-col>

                        <el-col :span="19" v-if="questionItem.type==5">
                          <div class="question_container" v-html="questionItem.content"></div>
                          <el-input type="textarea" v-model="questionItem.doAnswer" :rows="questionItem.quantity"
                            placeholder="答:" readonly>
                          </el-input>
                        </el-col>
                        <el-col :span="19" v-if="questionItem.type==9">
                          <div class="question_container" v-html="questionItem.content"></div>
                        </el-col>

                        <el-col :span="1" v-if="questionItem.type<9">
                          <span v-if="questionItem.isdecide == 0"
                            style="color:transparent; font-size:20px;display:block;width:50% ">
                            _</span>
                          <span v-if="questionItem.isdecide == 1"
                            style="color:green; font-size:20px;display:block;width:50% ">√</span>
                          <span v-if="questionItem.isdecide == 2"
                            style="color:orange; font-size:20px;display:block;width:50% ">メ</span>
                          <span v-if="questionItem.isdecide == 3"
                            style="color:red; font-size:20px;display:block;width:50% ">X</span>
                        </el-col>
                        <el-col :span="1" v-if="questionItem.type==9">
                          <span
                            style="color:transparent; font-size:20px;display:block;width:50% ">
                            _</span>
                        </el-col>

                        <el-col :span="4" v-if="questionItem.type<9">
                          <el-input-number v-model="questionItem.gainScore" @change="handleChange" :min="0"
                            :max="questionItem.score" label="得分"></el-input-number></br>
                          <el-button type="text" size="mini" @click="handleCorrect(questionItem)">对
                          </el-button>
                          <el-button type="text" size="mini" @click="handleWrong(questionItem)">错
                          </el-button>
                          <el-button v-if="questionItem.isauto == 0" type="text" size="mini"
                            @click="handlePortion(questionItem)">部分对
                          </el-button>
                          <el-button type="text" size="mini" @click="handleAnwser(questionItem)">答案
                          </el-button>
                        </el-col>

                        <el-col :span="4" v-if="questionItem.type==9">
                          <el-input-number v-model="questionItem.gainScore" @change="handleChange" :min="0"
                            :max="questionItem.score" label="得分"></el-input-number></br>
                        </el-col>

                        <el-col :span="24" v-if="questionItem.type==9">
                          <admixture-decide :ref="questionItem.id" @handle="handleAdmixtureChange()"
                            :questions="questionItem.subItems">
                          </admixture-decide>
                        </el-col>

                      </el-row>
                    </el-form-item>
                  </el-card>
                </section>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapState,
    mapActions
  } from 'vuex'
  import {
    listDecide,
    getDecide,
    updateDecide
  } from "@/api/examination/decide";
  import AdmixtureDecide from '@/components/AdmixtureDecide'
  export default {
    components: {
      AdmixtureDecide
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
        tabPosition: 'top',
        usable: '1',
        isdecide: true,
        paperHeight: 420,
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
        total: 0,
        accomplish: 0,
        currentQuestionGroup: null
      }
    },

    created() {
      let path = this.$route.path
      let id = parseInt(path.slice(path.lastIndexOf("/") + 1))
      this.open = true
      if (id && parseInt(id) > 0) {
        this.handleDecide(id)
      }
      this.usable = "1";
      this.paperHeight = document.documentElement.clientHeight - 280;
      window.addEventListener("resize", this.resizeHandler);
    },


    unmounted() {
      window.removeEventListener("resize", this.resizeHandler);
    },
    methods: {
      resizeHandler() {
        this.paperHeight = document.documentElement.clientHeight - 280;
      },
      // 填空题选项
      fillOptions(n, doAnswer) {
        let options = []
        let subDoAnswers = []
        if (doAnswer != null && doAnswer != "") {
          subDoAnswers = JSON.parse(doAnswer);
        }
        if (n > 100) n = 100
        for (let i = 0; i < n; i++) {
          let item = {};
          item.id = i + 1;
          if (n > 1) {
            item.placeholder = "（" + item.id + "）";
          }
          item.subDoAnswer = "";
          if (subDoAnswers[i] != null && subDoAnswers[i] != "") {
            item.subDoAnswer = subDoAnswers[i];
          }
          options.push(item)
        }
        return options
      },

      /** 批阅按钮操作 */
      handleDecide(id) {
        this.reset();
        let that = this
        that.form.questionList = [];
        getDecide(id).then(response => {
          this.form.id = response.data.id;
          if (response.data.courseId == 0) {
            this.form.courseId = null;
          } else {
            this.form.courseId = response.data.courseId;;
          }
          this.form.examName = response.data.examName;
          this.form.paperName = response.data.paperName;

          if (response.data.isdecide == 1) {
            this.isdecide = true;
          } else {
            this.isdecide = false;
          }
          this.form.score = response.data.score;
          this.form.state = response.data.state;
          this.form.totalScore = response.data.totalScore;
          this.form.times = response.data.times;

          let list = JSON.parse(response.data.questionList);
          let k = 1;
          list.forEach((self, index) => {
            if (self != null) {
              let questionGroup = {};
              questionGroup.id = index + 1;
              questionGroup.title = self.title;
              questionGroup.quantity = self.quantity;
              if (self.type == 0) {
                questionGroup.type = null;
              } else {
                questionGroup.type = self.type;
              }
              questionGroup.score = self.score;
              questionGroup.totalScore = self.score * self.quantity;
              questionGroup.questionItems = []
              if (self.items != "") {
                let questionItems = JSON.parse(self.items);
                questionItems.forEach((s, i) => {
                  let questionItem = {};
                  questionItem.id = s.id;
                  questionItem.content = s.content;
                  questionItem.isauto = s.isauto;
                  questionItem.doAnswer = s.doAnswer
                  questionItem.type = s.type

                  if (questionItem.type == 3) {
                    if (s.doAnswer == "A") {
                      questionItem.doAnswer = "√"
                    } else if (s.doAnswer == "B") {
                      questionItem.doAnswer = "x"
                    } else {
                      questionItem.doAnswer = ""
                    }
                  }

                  if (questionItem.type == 4) {
                    questionItem.options = this.fillOptions(parseInt(s
                      .quantity), s.doAnswer);
                  }
                  questionItem.isdecide = s.isdecide;
                  questionItem.score = s.score;
                  questionItem.gainScore = s.gainScore;
                  questionItem.answer = s.answer;
                  questionItem.buttonType = this.buttonType(questionItem.isdecide);
                  questionItem.code = "q" + k

                  questionItem.subItems = []
                  //综合题子题
                  if (s.type == 9) {
                    questionItem.subItems = JSON.parse(s.subItems);
                    questionItem.subItems.forEach((subItem, i) => {
                      if (subItem.type == 3) {
                        if (subItem.doAnswer == "A") {
                          subItem.doAnswer = "√"
                        } else if (subItem.doAnswer == "B") {
                          subItem.doAnswer = "x"
                        } else {
                          subItem.doAnswer = ""
                        }
                      }
                      if (subItem.type == 4) {
                        subItem.options = this.fillOptions(parseInt(subItem.quantity), subItem
                          .doAnswer);
                      }
                    })
                    questionItem.buttonType = this.getAdmixtureButtonType(questionItem.subItems);
                  }
                  k = k + 1;
                  questionGroup.questionItems.push(questionItem);
                });
              }
              that.form.questionList.push(questionGroup);
            }
          });
          that.open = true;
          this.sumTotalScore();
        });
      },

      /** 对按钮操作 */
      handleCorrect(item) {
        item.isdecide = 1;
        item.gainScore = item.score;
        item.buttonType = this.buttonType(item.isdecide);
        this.sumTotalScore();
      },
      /** 部分对按钮操作 */
      handlePortion(item) {
        item.isdecide = 2;
        item.gainScore = item.score / 2;
        item.buttonType = this.buttonType(item.isdecide);
        this.sumTotalScore();
      },
      /** 错按钮操作 */
      handleWrong(item) {
        item.isdecide = 3;
        item.gainScore = 0;
        item.buttonType = this.buttonType(item.isdecide);
        this.sumTotalScore();
      },
      handleChange() {
        this.sumTotalScore();
      },
      //查看答案
      handleAnwser(item) {
        this.$alert(item.answer, '标准答案', {
          confirmButtonText: '确定'
        });
      },

      //普通题导航按钮
      buttonType(isdecide) {
        let type = "";
        switch (isdecide) {
          case 1:
            type = "success";
            break;
          case 2:
            type = "warning";
            break;
          case 3:
            type = "danger";
            break;
        }
        return type;
      },

      //获取综合题导航按钮类型
      getAdmixtureButtonType(subItems) {
        let type = "";
        let allIsCorrect = true
        let allIsWrong = true
        let allIsBlank = true
        subItems.forEach((s, i) => {
          if (s.isdecide != null && s.isdecide != 0) {
            if (s.isdecide == 1) {
              allIsWrong = false
            } else {
              allIsCorrect = false
            }
            allIsBlank = false
          } else {
            allIsCorrect = false
          }
        })
        if (allIsCorrect == true) {
          type = "success"
        } else if (allIsWrong == true) {
          type = "danger";
        } else if (allIsBlank == true) {
          type = "";
        } else {
          type = "warning"
        }
        return type;
      },


      //综合题答题
      handleAdmixtureChange() {
        this.form.questionList.forEach((self, index) => {
          self.questionItems.forEach((s, i) => {
            if (s.type == 9) {
              //let subItems = this.$refs[s.id][0].subItems;
              let subItems = s.subItems;
              s.buttonType = this.getAdmixtureButtonType(subItems);
              if (s.buttonType == "success") {
                s.gainScore = s.score;
                s.isdecide = 1;
              } else if (s.buttonType == "danger") {
                s.gainScore = 0;
                s.isdecide = 3;
              } else if (s.buttonType == "warning") {
                s.gainScore = s.score / 2;
                s.isdecide = 2;
              } else {
                s.gainScore = null;
                s.isdecide = 0;
              }
            }
          })
        })
        this.sumTotalScore();
      },

      handleSubmitDecide() {
        this.isdecide = true;
        this.submitForm();
      },
      handleSaveDecide() {
        this.isdecide = false;
        this.submitForm();
      },
      /** 提交按钮 */
      submitForm() {
        let data = {};
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.open = true
            let iserror = false;
            data.id = this.form.id;
            data.name = this.form.name;
            data.isdecide = 0;
            if (this.isdecide == true) {
              data.isdecide = 1;
            }
            let questionList = [];
            this.form.questionList.forEach((self, index) => {
              let questionGroup = {};
              questionGroup.id = self.id;
              questionGroup.quantity = self.quantity;
              questionGroup.score = self.score;
              questionGroup.type = self.type;
              questionGroup.items = "";
              let questionItems = [];
              self.questionItems.forEach((s, i) => {
                let questionItem = {};
                questionItem.id = s.id;
                questionItem.gainScore = s.gainScore;
                questionItem.isdecide = s.isdecide;
                if (s.type == 9) {
                  questionItem.subItems = this.$refs[s.id][0].getDecide();
                }
                questionItems.push(questionItem);
              });
              questionGroup.items = JSON.stringify(questionItems);
              questionList.push(questionGroup);
            });
            data.questionList = JSON.stringify(questionList)
            if (this.form.id != null) {
              updateDecide(data).then(response => {
                this.$modal.msgSuccess("批阅提交成功");
                this.open = false;
                this.handleDecide(this.form.id);
              });
            } else {
              this.$modal.msgError("考卷不存在");
              this.open = false;
            }
          }
        })
      },
      handleClick(tab) {},
      sumTotalScore() {
        let totalScore = 0;
        let gainScore = 0
        let total = 0
        let accomplish = 0
        this.form.questionList.forEach((self, index) => {
          self.questionItems.forEach((s, i) => {
            if (s.gainScore == null) {
              gainScore = 0
            } else {
              gainScore = s.gainScore
            }
            totalScore = totalScore + gainScore;
            if (s.isdecide != null && s.isdecide != 0) {
              accomplish = accomplish + 1;
              s.buttonType = this.buttonType(s.isdecide)
            } else {
              s.buttonType = this.buttonType(0)
            }
            total = total + 1
          });
          this.form.score = totalScore;
          this.accomplish = accomplish;
          this.total = total;
        });
      },

      cancel() {
        const obj = {
          path: "/examination/Decide-edit",
          query: {
            t: Date.now(),
            pageNum: this.$route.query.pageNum
          }
        };
        this.$tab.closeOpenPage(obj);
        this.$router.push('/examination/decide');
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
      questionTypeFormatter(row, column, cellValue, index) {
        return this.enumFormat(this.questionTypeEnum, cellValue)
      },
      subjectFormatter(row, column, cellValue, index) {
        return this.subjectEnumFormat(cellValue)
      },
      toQuestion(item) {
        // 滚到指定元素
        this.$el.querySelector(`#${item.code}`).scrollIntoView({
          behavior: 'smooth'
        })
      },

      reset() {
        this.form = {
          id: null,
          courseId: null,
          questionList: [],
          setting: null,
          questions: null,
          isauto: 1,
        }
        this.resetForm("form");
      },
    }
  }
</script>



<style lang="scss">
  .nav_card {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .paper {
    height: 420px;
    overflow: auto;
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
    float: right;
  }

  .nav_item {
    width: 30px;
    height: 30px;
  }

  .item {
    display: inline;
    margin: 20px, 0;
    width: 100px;
    height: 30px;
  }

  .questionItem {
    display: inline;
    justify-content: center;
    align-items: center;
    margin: 20px, 0;

    width: 20px;
    height: 20px;
    border: 1px solid #778899;
    color: #778899;
  }

  .exampaper-item-box {
    .q-title {
      margin: 0px 5px 0px 5px;
    }

    .question_container {
      margin: 0px auto;
      margin-bottom: 0px;
      line-height: 18px;
    }

    .q-item-content {}

  }
</style>

<style scoped lang="scss">
  .rule-input-edit ::v-deep {
    .el-input__inner {
      border: 0px;
      border-bottom: 1px solid #a8acab;
      border-radius: 0px;

      &:focus {
        border-bottom: 1px solid #409eff;
      }
    }
  }
</style>
