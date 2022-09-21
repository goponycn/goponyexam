<template>
	<div class="app-container">
		<el-row :gutter="20" type="flex">
			<el-col :span="4" :xs="0"><div></div></el-col>
			<el-col :span="16" :xs="24">
				<el-card class="box-card">
					<el-tabs v-model="activeTab" tab-position="left">
						<el-tab-pane label="基本资料" name="userinfo">
							<span slot="label"><i class="el-icon-user-solid"></i> 基本资料</span>
							<userInfo :user="user" />
						</el-tab-pane>
						<el-tab-pane label="修改密码" name="resetPwd">
							<span slot="label"><i class="el-icon-s-tools"></i> 修改密码</span>
							<resetPwd :user="user" />
						</el-tab-pane>
					</el-tabs>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import userInfo from "./userInfo";
	import resetPwd from "./resetPwd";
	import {
		getUserProfile
	} from "@/api/user/profile";

	export default {
		name: "Profile",
		components: {
			userInfo,
			resetPwd
		},
		data() {
			return {
				user: {},
				postGroup: {},
				activeTab: "userinfo"
			};
		},
		created() {
			this.getUser();
		},
		methods: {
			close() {
				this.$router.push({
					path: "/"
				});
			},
			getUser() {
				getUserProfile().then(response => {
					this.user = response.data;
					this.postGroup = response.postGroup;
				});
			}
		}
	};
</script>
<style scoped>
	.app-container {
		padding: 20px;
		width: 100%;
		margin: auto;
	}

	.list-group {
		padding-left: 0px;
		list-style: none;
	}

	.list-group-item {
		border-bottom: 1px solid #e7eaec;
		border-top: 1px solid #e7eaec;
		margin-bottom: -1px;
		padding: 11px 0px;
		font-size: 13px;
	}

	.pull-right {
		float: right !important;
	}
</style>
