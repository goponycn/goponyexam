<template>
	<div class="notice-container">
		<el-row type="flex">
			<el-col :span="2" class="mt20">
				<div></div>
			</el-col>
			<el-col :span="20" class="mt20">
				<el-table v-loading="loading" :data="noticeList"
					:header-cell-style="{background:'#5b5755',color:'#fafafa'}">
					<el-table-column label="编号" align="center" prop="noticeId" width="100" />
					<el-table-column label="公告时间" align="center" prop="createTime" width="180">
						<template slot-scope="scope">
							<span>{{ parseTime(scope.row.createTime) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="标题" align="left" header-align="center" prop="noticeTitle"
						:show-overflow-tooltip="true" />
					<el-table-column label="类型" align="center" prop="noticeType" width="100">
						<template slot-scope="scope">
							<dict-tag :options="typeOptions" :value="scope.row.noticeType" />
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
					<el-col :span="24">
						<el-form-item label="标题" prop="noticeTitle">
							{{form.noticeTitle}}
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="类型" prop="noticeType">
							<dict-tag :options="typeOptions" :value="form.noticeType" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="时间" prop="createTime">
							<span>{{ parseTime(form.createTime) }}</span>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="内容">
							<div class="notice_content" v-html="form.noticeContent"></div>
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
		listNotice
	} from '@/api/system/notice'
	import {
		getDictsByTypeList
	} from "@/api/system/dict/data";
	export default {
		name: 'NoticeList',
		dicts: ['sys_notice_status', 'sys_notice_type'],
		data() {
			return {
				typeOptions: [],
				noticeList: [],
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
				tagOptions: []
			}
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				const dictTypeList = ['sys_notice_type'];
				getDictsByTypeList(dictTypeList).then(response => {
					this.typeOptions = response.data.sys_notice_type;
				});

				this.getList();
			},
			getList() {
				listNotice().then(response => {
					this.noticeList = response.rows;
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
				this.form = {
					noticeId: 0,
					noticeTitle: "",
					noticeType: "",
					noticeContent: "",
					createTime: null,
					status: "0"
				};
				this.resetForm("form");
			},
			/** 修改按钮操作 */
			handleDetail(row) {
				this.reset();
				this.form.id = row.id;
				this.form.noticeTitle = row.noticeTitle;
				this.form.noticeContent = row.noticeContent;
				this.form.noticeType = row.noticeType;
				this.form.createTime = row.createTime;
				this.open = true;
				this.title = "公告详情";
			},
		}
	}
</script>

<style scoped>
	.notice-container {
		width: 100%;
		margin: auto;
	}

	#side .item {
		margin-bottom: 30px;
		margin-top: 8px;
	}

	h5 {
		font-size: 18px;
	}

	.pagination {
		background-color: #F9F9F9;
		text-align: center;
	}


	.notice_content {
		margin: 10px auto;
		margin-bottom: 0px;
		line-height: 20px;
	}

	html,
	body {
		margin: 0;
		padding: 0;
	}

</style>
