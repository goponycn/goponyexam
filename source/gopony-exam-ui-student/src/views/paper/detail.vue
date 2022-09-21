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
										size="mini" circle :type="questionItem.buttonType"
										@click="toQuestion(questionItem)">{{ questionIndex+1 }}</el-button>
								</div>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-col>
			<el-col :span="6" :xs="24">
				<div style="text-align:center;vertical-align:middle;margin: 10px;">
					<span style="text-align: center;font-size: 10px; ">完成进度 {{accomplish}}/{{total}}</span>&nbsp;&nbsp;
					<span style="text-align: center;font-size: 10px; ">剩余时间 {{this.remain}}分钟</span>
				</div>
				<div style="text-align:center;vertical-align:middle;">
					<el-button type="danger" @click="handleSubmitPaper" size="small">交卷</el-button>
					<el-button type="primary" @click="handleSavePaper" size="small">保存</el-button>
					<el-button @click="cancel" size="small">关闭</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row>
			<!--试卷区-->
			<el-col :span="24" :xs="24">
				<div style="height: 30px; margin-bottom: 15px;margin-left: 2%;margin-right: 2%;">
					<el-row>
						<el-col :span="24">
							<span style="text-align: center;display:block;font-size: 22px;"> {{ form.paperName }}</span>
						</el-col>
						<el-col :span="24">
							<span style="text-align: center;display:block;font-size: 12px;"> (总分:{{form.totalScore}}分
								时间:{{form.times}}分钟)</span>
						</el-col>
					</el-row>
				</div>
				<div class="paper" :style="{height:paperHeight + 'px'}">
					<el-form ref="form" v-loading="loading" :model="form" label-width="100px" :rules="rules"
						size="small">
						<el-row>
							<el-col :span="24">
								<section v-for="(item,index) in form.questionList" :key="index" required>
									<div style="margin-bottom: 10px;margin-top: 10px ">
										<span size="small">{{ arabicToChinese((index+1))+'、' }}</span>
										<span><strong>{{ item.title +'(每小题'+item.score+'分,共'+item.totalScore+'分)' }}</strong></span>
									</div>
									<el-card class="exampaper-item-box">
										<el-form-item v-for="(questionItem,questionIndex) in item.questionItems"
											:key="questionIndex" :label="''+(questionIndex+1)+'、 '" label-width="40px"
											:ID="questionItem.code" style="margin-bottom: 10px ">
											<el-row>
												<el-col :span="20" v-if="questionItem.type<=3">
													<div class="question_container" v-html="questionItem.content" />
												</el-col>
												<el-col :span="3" v-if="questionItem.type==1">
													<el-select v-model="questionItem.doAnswer"
														@change="handleChange(questionItem)" placeholder="请选择"
														clearable>
														<el-option v-for="item in questionItem.options" :key="item.id"
															:label="item.name" :value="item.id"></el-option>
													</el-select>
												</el-col>
												<el-col :span="3" v-if="questionItem.type==2">
													<el-select v-model="questionItem.doAnswer"
														@change="handleChange(questionItem)" placeholder="请选择" clearable
														multiple>
														<el-option v-for="item in questionItem.options" :key="item.id"
															:label="item.name" :value="item.id" multiple></el-option>
													</el-select>
												</el-col>

												<el-col :span="3" v-if="questionItem.type==3">
													<el-select v-model="questionItem.doAnswer" placeholder="请选择"
														@change="handleChange(questionItem)" clearable>
														<el-option v-for="item in questionItem.options" :key="item.id"
															:label="item.name" :value="item.id" multiple></el-option>
													</el-select>
												</el-col>

												<el-col :span="23" v-if="questionItem.type>3">
													<div class="question_container" v-html="questionItem.content" />
												</el-col>
												<el-col :span="23" v-if="questionItem.type==4">
													<div class="inputDeep"
														v-for="(optionItem,optionIndex) in questionItem.options"
														:key="optionIndex">
														<el-input type="text" class="rule-input-edit"
															v-model="optionItem.subDoAnswer"
															:placeholder="optionItem.placeholder"
															@change="handleChange(questionItem)">
														</el-input>
													</div>
												</el-col>
												<el-col :span="23" v-if="questionItem.type==5">
													<el-input type="textarea" v-model="questionItem.doAnswer"
														:rows="questionItem.quantity" placeholder="答:"
														@change="handleChange(questionItem)">
													</el-input>
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
		getPaper,
		savePaper
	} from '@/api/exam/paper'

	export default {
		dicts: ['sys_normal_disable', 'pony_manual_auto', 'pony_question_type'],
		components: {
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
			let timer = setInterval(() => {
				this.diffMinutes()
			}, 60000)
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
				getPaper(id).then(response => {
					this.form.id = response.data.id
					this.form.courseId = response.data.courseId
					this.form.examName = response.data.examName
					this.form.paperName = response.data.paperName
					this.form.state = response.data.state
					this.form.stopTime = response.data.stopTime;
					this.form.totalScore = response.data.totalScore;
					this.form.times = response.data.times;
					const list = JSON.parse(response.data.questionList)
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
					this.diffMinutes();
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

			//保存
			handleSavePaper() {
				this.updatePaper(2, 1, false);
			},
			//交卷
			handleSubmitPaper() {
				let that = this;
				this.$modal.confirm('交卷后本次考试结束,请确认交卷吗？').then(function() {
					that.updatePaper(2, 2, false);
					that.$router.push('/paper')
				}).catch(() => {});

			},
			updatePaper(ismanual = 1, state = 1, close = false) {
				const data = {}
				if (ismanual != 2) {
					ismanual = 1;
				}
				if (state != 2) {
					state = 1;
				}
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.open = true
						data.id = this.form.id
						data.state = state;
						data.ismanual = ismanual;
					}
					const answerList = []
					let subIndex = 0;
					this.form.questionList.forEach((self, index) => {
						const questionGroup = {}
						questionGroup.id = self.id
						questionGroup.items = ''
						const questionItems = []
						self.questionItems.forEach((s, i) => {
							const questionItem = {}
							questionItem.id = s.id
							questionItem.doAnswer = s.doAnswer

							if (s.type == 4) {
								//字符串数组存储填空
								let subDoAnswer = [];
								s.options.forEach((optionItem, j) => {
									subDoAnswer[j] = optionItem.subDoAnswer;
								})
								questionItem.doAnswer = JSON.stringify(subDoAnswer)
							}
							if (s.type == 9) {
								//综合题存储子题
								questionItem.subItems = this.$refs[s.id][0].getDoAnswer();
							}
							questionItems.push(questionItem)
						})
						questionGroup.items = JSON.stringify(questionItems)
						answerList.push(questionGroup)
					})
					data.answerList = JSON.stringify(answerList)
					if (this.form.id != null) {
						savePaper(data).then(response => {
							this.open = false
							if (close == false) {
								if (state == 1) {
									this.$modal.msgSuccess('试卷保存成功')
								} else {
									this.$modal.msgSuccess('交卷成功')
									this.$router.push('/paper')
								}
							}
						})
					}
				})
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

			diffMinutes() {
				let now = new Date();
				let stopTime = this.form.stopTime;
				if (stopTime == null) {
					this.remain = null;
				} else {
					let diff = new Date(stopTime).getTime() - now.getTime();
					this.remain = Math.floor(diff / (60 * 1000))
				}
			},

			cancel() {
				let that = this;
				this.$modal.confirm('请确认关闭试卷吗？').then(function() {
					that.updatePaper(1, 1, true);
					that.$router.push('/paper')
				}).catch(() => {});
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

	.inputDeep>>>.el-input__inner {
		border: 0;
	}



	.question_container {
		margin: 0px auto;
		margin-bottom: 0px;
		line-height: 25px;
	}

	.exampaper-item-box {
		.q-title {
			margin: 0px 5px 0px 5px;
		}

		.question_container {
			margin: 0px auto;
			margin-bottom: 0px;
			line-height: 25px;
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
