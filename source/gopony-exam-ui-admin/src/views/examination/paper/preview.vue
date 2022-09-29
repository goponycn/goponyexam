<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!--导航区-->
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
        <div style="text-align:center;vertical-align:middle;">
          <el-button type="primary" @click=" handlePrint(printData)" size="small">打印</el-button>
          <el-button @click="cancel" size="small">关闭</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <!--试卷区-->
      <el-col :span="24" :xs="24">
        <div id="printFrom">
          <div style="height: 38px; margin-bottom: 15px;margin-left: 2%;margin-right: 2%;">
            <el-row>
              <el-col :span="24">
                <span style="text-align: center;display:block;font-size: 22px;"> <strong>{{ form.paperName }}</strong></span>
              </el-col>
              <el-col :span="24">
                <span style="text-align: center;display:block;font-size: 12px;"> (总分:{{form.totalScore}}分
                  时间:{{form.times}}分钟)</span>
              </el-col>
            </el-row>
          </div>
          <el-form ref="form" v-loading="loading" :model="form" label-width="100px" :rules="rules" size="small">
            <el-row>
              <el-col :span="24">
                <section v-for="(item,index) in form.questionList" :key="index" required>
                  <div style="margin-bottom: 10px;margin-top: 10px ">
                    <span size="small">{{ arabicToChinese((index+1))+'、' }}</span>
                    <span><strong>{{ item.title +'(每小题'+item.score+'分,共'+item.totalScore+'分)' }}</strong></span>
                  </div>
                  <el-card class="exampaper-item-box">
                    <el-form-item v-for="(questionItem,questionIndex) in item.questionItems" :key="questionIndex"
                      :label="''+(questionIndex+1)+'、 '" label-width="40px" :ID="questionItem.code"
                      style="margin-bottom: 10px ">
                      <el-row>
                        <el-col :span="23">
                          <div class="question_container" v-html="questionItem.content" />
                        </el-col>
                        <el-col :span="23" v-if="questionItem.type==5">
                          <el-input class="textarea-text" type="textarea" v-model="questionItem.doAnswer"
                            :rows="questionItem.quantity" placeholder="">
                          </el-input>
                        </el-col>
                        <el-col :span="23" v-if="questionItem.type==9">
                          <admixture-paper :ref="questionItem.id" @handle="handleAdmixtureChange()"
                            :questions="questionItem.subItems">
                          </admixture-paper>
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

  import AdmixturePaper from '@/components/AdmixturePaper'
  import {
    getPreview
  } from '@/api/examination/paper'
  import Print from 'print-js'
  export default {
    dicts: ['sys_normal_disable', 'pony_manual_auto', 'pony_question_type'],
    components: {
      AdmixturePaper
    },
    data() {
      return {
        form: {
          id: null,
          name: '',
          questionList: [],
          totalScore: 0,
          times: 0,
        },
        printData: {
          printable: 'printFrom',
          header: '',
          ignore: ['no-print']
        },
        total: 0,
        accomplish: 0,
        remain: null,
        usable: '1',
        loading: false,
        paperHeight: 420,
        rules: {},
        currentQuestionGroup: null
      }
    },

    created() {
      const path = this.$route.path
      const id = parseInt(path.slice(path.lastIndexOf('/') + 1))
      this.open = true
      if (id && parseInt(id) > 0) {
        this.handlePaper(id)
      }
      this.paperHeight = document.documentElement.clientHeight - 180;
      window.addEventListener("resize", this.resizeHandler);
      this.usable = '1';

    },

    unmounted() {
      window.removeEventListener("resize", this.resizeHandler);
    },


    methods: {
      resizeHandler() {
        this.paperHeight = document.documentElement.clientHeight - 180;
      },
      /** 批阅按钮操作 */
      handlePaper(id) {
        this.reset()
        const that = this
        that.form.questionList = []
        getPreview(id).then(response => {
          this.form.id = response.data.id
          this.form.courseId = response.data.courseId
          this.form.paperName = response.data.name
          this.form.state = response.data.state
          this.form.totalScore = response.data.totalScore;
          this.form.times = response.data.times;
          const list = JSON.parse(response.data.questions)
          let k = 1
          list.forEach((self, index) => {
            const questionGroup = {}
            questionGroup.id = index + 1
            questionGroup.title = self.title
            questionGroup.quantity = self.quantity
            if (self.type == 0) {
              questionGroup.type = null
            } else {
              questionGroup.type = self.type
            }
            questionGroup.score = self.score
            questionGroup.totalScore = self.score * self.quantity
            questionGroup.questionItems = []
            if (self.items != '') {
              const questionItems = JSON.parse(self.items)
              questionItems.forEach((s, i) => {
                const questionItem = {}
                questionItem.id = s.id
                questionItem.content = s.content
                questionItem.isauto = s.isauto
                questionItem.doAnswer = s.doAnswer
                questionItem.score = s.score
                questionItem.type = s.type
                questionItem.buttonType = this.getButtonType(s.doAnswer);
                if (s.type == 1 || s.type == 2) {
                  questionItem.options = this.selectOptions(parseInt(s
                    .quantity));
                }
                if (s.type == 3) {
                  questionItem.options = this.judgeOptions();
                }
                if (s.type == 4) {
                  questionItem.options = this.fillOptions(parseInt(s
                    .quantity), s.doAnswer);
                  questionItem.buttonType = this.getFillButtonType(
                    s.doAnswer);
                }

                questionItem.subItems = []
                //综合题子题
                if (s.type == 9) {
                  questionItem.subItems = JSON.parse(s.subItems);
                  questionItem.subItems.forEach((subItem, i) => {
                    if (subItem.type == 1 || subItem.type == 2) {
                      subItem.options = this.selectOptions(parseInt(
                        subItem
                        .quantity));
                    }
                    if (subItem.type == 3) {
                      subItem.options = this.judgeOptions();
                    }
                    if (subItem.type == 4) {
                      subItem.options = this.fillOptions(parseInt(
                        subItem
                        .quantity), subItem.doAnswer);
                    }
                  })
                  questionItem.buttonType = this.getAdmixtureButtonType(
                    questionItem.subItems);
                }

                questionItem.code = 'q' + k;
                k = k + 1;
                questionGroup.questionItems.push(questionItem);
              })
            }
            that.form.questionList.push(questionGroup)
          })

          that.open = true;
          this.sumTotal();
        })
      },

      handlePrint(params) {
        printJS({
          printable: 'printFrom',
          type: params.type || 'html',
          header: params.header,
          targetStyles: ['*'],
          style: '@page {size:auto;margin:5mm 5mm 10mm 5mm };',
          ignoreElements: params.ignore || [],
          properties: params.properties || null
        })
      },

      handleChange(questionItem) {
        questionItem.buttonType = this.getButtonType(questionItem.doAnswer);
        if (questionItem.type == 4) {
          let subDoAnswer = [];
          questionItem.options.forEach((optionItem, j) => {
            subDoAnswer[j] = optionItem.subDoAnswer;
          })
          questionItem.doAnswer = JSON.stringify(subDoAnswer)
          questionItem.buttonType = this.getFillButtonType(questionItem.doAnswer);
        }
        this.sumTotal()
      },

      //综合题答题
      handleAdmixtureChange() {
        let total = 0
        let accomplish = 0
        this.form.questionList.forEach((self, index) => {
          self.questionItems.forEach((s, i) => {
            if (s.type == 9) {
              let subItems = this.$refs[s.id][0].subItems;
              s.buttonType = this.getAdmixtureButtonType(subItems);
            }
            if (s.buttonType == "success") {
              accomplish = accomplish + 1;
            }
            total = total + 1
          })
          this.accomplish = accomplish;
          this.total = total;
        })
      },

      // 选择题选项
      selectOptions(n) {
        let options = []
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if (n > 26) n = 26

        for (let i = 0; i < n; i++) {
          let item = {};
          item.id = alphabet[i];
          item.name = alphabet[i];
          options.push(item)
        }
        return options
      },
      // 判断题选项
      judgeOptions(n) {
        let options = []
        let item1 = {};
        item1.id = 'A';
        item1.name = '√';
        let item2 = {};
        item2.id = 'B';
        item2.name = 'x';
        options.push(item1)
        options.push(item2)
        return options
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

      //普通题类型
      getButtonType(doAnswer) {
        let type = "";
        if (doAnswer != null && doAnswer != "") {
          type = "success";
        }
        return type;
      },

      //获取综合题类型
      getAdmixtureButtonType(subItems) {
        let type = "";
        let finish = 0;
        let unFinish = 0;
        subItems.forEach((s, i) => {
          if (s.doAnswer != null && s.doAnswer != "") {
            if (s.type == 4) {
              if (this.getFillButtonType(s.doAnswer) == "success") {
                finish = finish + 1;
              } else {
                unFinish = unFinish + 1;
              }
            } else {
              finish = finish + 1;
            }
          } else {
            unFinish = unFinish + 1;
          }
        })

        if (finish > 0) {
          if (unFinish == 0) {
            type = "success"
          } else {
            type = "warning"
          }
        }
        return type;
      },

      //获取类型
      getFillButtonType(doAnswer) {
        let type = "";
        let finish = 0;
        let unFinish = 0;
        if (doAnswer != null && doAnswer != "") {
          let subItems = JSON.parse(doAnswer);
          subItems.forEach((s, i) => {
            if (subItems[i] != null && subItems[i] != "") {
              finish = finish + 1;
            } else {
              unFinish = unFinish + 1;
            }
          })
        }
        if (finish > 0) {
          if (unFinish == 0) {
            type = "success"
          } else {
            type = "warning"
          }
        }
        return type;
      },

      handleClick(tab) {},
      sumTotal() {
        let total = 0
        let accomplish = 0
        this.form.questionList.forEach((self, index) => {
          self.questionItems.forEach((s, i) => {
            if (s.buttonType == "success") {
              accomplish = accomplish + 1;
            }
            total = total + 1
          })
          this.accomplish = accomplish;
          this.total = total;
        })
      },

      cancel() {
        const obj = {
          path: "/examination/paper-preview",
          query: {
            t: Date.now(),
            pageNum: this.$route.query.pageNum
          }
        };
        this.$tab.closeOpenPage(obj);
        this.$router.push('/examination/paper');
      },

      arabicToChinese(num) {
        const numArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
        const numLimit = ['亿', '万', ''] // 设置数字上限
        const numUnit = ['千', '百', '十', '']
        // num四位数是一个阶段对应 numLimit 每个阶段对应一个 numUnit，每个数字对应numArr。
        num = num.toString()
        num = num.split('')
        while (num.length < numLimit.length * 4) {
          num.unshift('')
        }
        const numLength = num.length
        let s = ''
        const limit = Math.ceil(numLength / 4)
        for (let i = 1; i <= limit; i++) {
          const start = (i - 1) * 4
          const end = i * 4
          const limitNum = num.slice(start, end)
          for (let j = 0; j < limitNum.length; j++) {
            if (limitNum[j] !== '') {
              const char = numArr[limitNum[j]]
              let unit = numUnit[j]
              if (limitNum[j] == 0) {
                unit = ''
              }
              s += char + unit
            }
          }
          const hasValue = limitNum.filter(val => {
            return val !== ''
          })
          s = s.replace(/(零{2,})/, '零')
          if (s !== '零') {
            s = s.replace(/(零*)$/, '') // 结尾去掉零
          }
          if (hasValue.length > 0) {
            s += numLimit[i - 1]
          }
        }
        s = s.replace(/^一十/, '十')
        return s
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
          questions: null,
          isauto: 1
        }
        this.resetForm('form')
      }
    }
  }
</script>

<style  lang="scss">
  .nav_card {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .paper {
    height: 420px;
    overflow: auto;
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
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

  .question_container {
    margin: 0px auto;
    margin-bottom: 0px;
    line-height: 20px;
  }

  .exampaper-item-box {
    .q-title {
      margin: 0px 5px 0px 5px;
    }

    .question_container {
      margin: 0px auto;
      margin-bottom: 0px;
      line-height: 20px;
    }

    .q-item-content {}
  }
</style>

<style scoped lang="scss">
  .textarea-text>>>.el-textarea__inner {
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 0px;
    width: 100%;
    resize: none;
  }

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
