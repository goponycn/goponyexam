<template>
	<el-form ref="form" :model="user" :rules="rules" label-width="80px">
		<el-form-item label="用户名" prop="userName">
			<el-input v-model="user.userName" maxlength="30" disabled />
		</el-form-item>
        <el-form-item label="学号" prop="nickName">
        	<el-input v-model="user.sno" maxlength="30" />
        </el-form-item>
		<el-form-item label="姓名" prop="trueName">
			<el-input v-model="user.trueName" maxlength="30" />
		</el-form-item>
		<el-form-item label="手机号码" prop="phonenumber">
			<el-input v-model="user.phonenumber" maxlength="11" />
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input v-model="user.email" maxlength="50" />
		</el-form-item>
		<el-form-item label="性别">
			<el-radio-group v-model="user.sex">
				<el-radio label="0">未知</el-radio>
				<el-radio label="1">男</el-radio>
				<el-radio label="2">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="所属班级" prop="teamName">
			<el-input v-model="user.teamName" maxlength="30" disabled />
		</el-form-item>

		<el-form-item label="创建日期">
			<div class="pull-right">{{ user.createTime }}</div>
		</el-form-item>

		<el-form-item style="text-align:center;">
			<el-button type="primary" @click="submit">保存</el-button>
			<el-button @click="close">关闭</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import {
		updateUserProfile
	} from "@/api/user/profile";

	export default {
		props: {
			user: {}
		},
		data() {
			return {
				// 表单校验
				rules: {
					email: [{
						type: "email",
						message: "请输入正确的邮箱地址",
						trigger: ["blur", "change"]
					}],
					phonenumber: [{
						pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
						message: "请输入正确的手机号码",
						trigger: "blur"
					}]
				}
			};
		},
		methods: {
			submit() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						updateUserProfile(this.user).then(response => {
							this.$message({
								message: '个人资料修改成功',
								type: 'success'
							});
						});
					}
				});
			},
			close() {
				this.$router.push({
					path: "/"
				});
			}
		}
	};
</script>
