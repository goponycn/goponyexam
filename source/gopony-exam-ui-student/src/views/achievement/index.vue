<template>
	<div class="achievement-container">
		<el-row type="flex">
			<el-col :span="2" class="mt20">
				<div></div>
			</el-col>
			<el-col :span="20" class="mt20">
				<el-table v-loading="loading" :data="achievementList"
					:header-cell-style="{background:'#5b5755',color:'#fafafa'}">
					<el-table-column label="日期" align="center" prop="startTime" width="120">
						<template slot-scope="scope">
							<span>{{ parseTime(scope.row.beginTime, '{y}-{m}-{d}') }} </span>
						</template>
					</el-table-column>
					<el-table-column label="课程" align="left" header-align="center" prop="courseName" width="220"
						:show-overflow-tooltip="true" />
					<el-table-column label="名称" align="left" header-align="center" prop="examName"
						:show-overflow-tooltip="true" />
					<el-table-column label="得分" align="center" prop="score" width="100" :show-overflow-tooltip="true" />
					<el-table-column label="合格" align="center" prop="ispass" width="80">
						<template slot-scope="scope">
							<dict-tag :options="statusOptions" :value="scope.row.ispass" />
						</template>
					</el-table-column>
					<el-table-column label="" align="center" class-name="small-padding fixed-width" width="80">
						<template slot-scope="scope">
							<el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class=" block pagination">
					<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum"
						:limit.sync="queryParams.pageSize" @pagination="getList" />
				</div>

			</el-col>
			<el-col :span="2" class="hidden-sm-and-down mt20">
				<div class="item">
				</div>
			</el-col>
		</el-row>

		<!-- 添加或修改公告对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
			<el-form ref="form" :model="form" label-width="80px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="课程" prop="noticeType">
							{{form.courseName}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="时间" prop="beginTime">
							<span>{{ parseTime(form.beginTime) }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="名称" prop="noticeTitle">
							{{form.examName}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="总分" prop="totalScore">
							{{form.totalScore}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="得分" prop="score">
							{{form.score}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="姓名" prop="studentName">
							{{form.studentName}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="合格" prop="ispass">
							<dict-tag :options="statusOptions" :value="form.ispass" />
						</el-form-item>
					</el-col>

				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		listAchievement,
		getAchievement
	} from '@/api/exam/achievement'
	import {
		getDictsByTypeList
	} from "@/api/system/dict/data";
	export default {
		name: 'AchievementList',
		dicts: ['pony_exam_pass_status'],
		data() {
			return {
				statusOptions: [],
				achievementList: [],
				total: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 8,
				},
				loading: false,
				title: "",
				open: false,
				// 表单参数
				form: {},
				// 标签字典
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				const dictTypeList = ['pony_exam_pass_status'];
				getDictsByTypeList(dictTypeList).then(response => {
					this.statusOptions = response.data.pony_exam_pass_status;
				});

				this.getList();
			},
			getList() {
				listAchievement().then(response => {
					this.achievementList = response.rows;
					this.total = response.total;
				})
			},
			// 取消按钮
			cancel() {
				this.open = false;
				this.reset();
			},
			// 表单重置
			reset() {
				this.form = {};
				this.resetForm("form");
			},
			/** 修改按钮操作 */
			handleDetail(row) {
				this.reset();
				const id = row.id || this.ids
				getAchievement(id).then(response => {
					this.form = response.data;
					this.open = true;
					this.title = "成绩单详情";
				});
			},


		}
	}
</script>

<style scoped>
	.achievement-container {
		width: 100%;
		margin: auto;
	}

	.pagination {
		background-color: #F9F9F9;
		text-align: center;
	}

	html,
	body {
		margin: 0;
		padding: 0;
	}
</style>
