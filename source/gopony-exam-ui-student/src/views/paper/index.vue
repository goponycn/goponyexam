<template>
	<div class="achievement-container">
		<el-row type="flex">
			<el-col :span="2" class="mt20">
				<div></div>
			</el-col>
			<el-col :span="20" class="mt20">
				<el-table v-loading="loading" :data="paperList"
					:header-cell-style="{background:'#5b5755',color:'#fafafa'}">
					<el-table-column label="编号" align="center" prop="examId" width="100"
						:show-overflow-tooltip="true" />

					<el-table-column label="课程" align="left" header-align="center" prop="courseName" width="220"
						:show-overflow-tooltip="true" />
					<el-table-column label="名称" align="left" header-align="center" prop="examName"
						:show-overflow-tooltip="true" />
					<el-table-column label="开考时间" align="center" prop="startTime" width="160">
						<template slot-scope="scope">
							<span>{{parseTime(scope.row.startTime)}} </span>
						</template>
					</el-table-column>
					<el-table-column label="状态" align="center" prop="state" width="80">
						<template slot-scope="scope">
							<dict-tag :options="stateOptions" :value="scope.row.state" />
						</template>
					</el-table-column>
					<el-table-column label="" align="center" class-name="small-padding fixed-width" width="100">
						<template slot-scope="scope">
							<el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.state<=1"
								@click="$router.push({path:'/exam/'+scope.row.id})">进入考试</el-button>
							<el-button size="mini" type="text" icon="el-icon-view" v-if="scope.row.state>1" @click="handleDetail(scope.row)">详情
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
					<el-col :span="24">
						<el-form-item label="考试名称" prop="examName">
							{{form.examName}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="课程" prop="courseName">
							{{form.courseName}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="开考时间" prop="startTime">
							<span>{{ parseTime(form.startTime) }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="试卷总分" prop="totalScore">
							{{form.totalScore}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="考生名称" prop="studentName">
							{{form.studentName}}
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
		listPaper,
		getPaper,
		getPaperDetail
	} from '@/api/exam/paper'
	import {
		getDictsByTypeList
	} from "@/api/system/dict/data";
	import Pagination from '@/components/Pagination'
	export default {
		name: 'PaperList',
		dicts: ['pony_exam_state'],
		data() {
			return {
				stateOptions: [],
				paperList: [],
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
				const dictTypeList = ['pony_exam_state'];
				getDictsByTypeList(dictTypeList).then(response => {
					this.stateOptions = response.data.pony_exam_state;
				});
				this.getList();
			},
			getList() {
				listPaper().then(response => {
					this.paperList = response.rows;
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
				const id = row.id 
				getPaperDetail(id).then(response => {
					this.form = response.data;
					this.open = true;
					this.title = "考试详情";
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
