<template>
	<header>
		<div class="header-body">
			<div style="text-align: center;width: 200px; height: 80px; vertical-align: middle;color: #5b5755;">
				<p><a href="/" class="logo" >小马考试通</a></p>
			</div>
			<div class="nav">
				<ul class="nav-list">
					<li><a href="/" :class="defaultActive === `/` ? `nav-model active`: `nav-model`" >首页</a></li>
					<li><a href="/paper" :class="defaultActive === `/paper` ? `nav-model active`: `nav-model`" >考试</a>
					</li>
					<li><a href="/achievement"
							:class="defaultActive === `/achievement` ? `nav-model active`: `nav-model`" >成绩单</a></li>
					<li><a href="/notice" :class="defaultActive === `/notice` ? `nav-model active`: `nav-model`" >公告</a>
					</li>
					<li><a href="/profile"
							:class="defaultActive === `/profile` ? `nav-model active`: `nav-model`" >个人资料</a></li>
				</ul>
			</div>
			<div style="width: 20%; height: 80px; float:right;"></div>
			<div style="width: 200px; height: 80px; text-align: center; ">
				<ul class="h-r-login">
					<li v-if="!isLogin">
						<a href="#login" @click="$store.dispatch('showLoginForm')" title="登录">
							<em class="icon18 login-icon">&nbsp;</em>
							<span class="vam ml5">登录</span>
						</a>
						|
						<a href="#register" @click="$store.dispatch('showRegisterForm')" title="注册">
							<span class="vam ml5">注册</span>
						</a>
					</li>
					<li v-if="isLogin" class="h-r-user">
						<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handleCommand">
							<div class="avatar-wrapper">
								<img width="40px" height="40px" style="border-radius: 10px;"  :src="require('@/assets/styles/images/profile.jpg')" class="user-avatar">
								<i class="el-icon-caret-bottom" />
							</div>
							<el-dropdown-menu slot="dropdown">
								<router-link to="/profile" >
									<el-dropdown-item icon="el-icon-user-solid">个人资料</el-dropdown-item>
								</router-link>
								<el-dropdown-item divided icon="el-icon-remove-outline" command="logout" >
									<span>退出登录</span>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>

					</li>
				</ul>
			</div>
		</div>
		
	</header>
	
</template>

<script>
	import '@/assets/styles/css/clear.css';
	import {
		getUrlParams
	} from '@/utils/common';
	import {
		setToken
	} from '@/utils/auth';
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: "Header",
		data() {
			return {
				searchList: [],
				state: '',
				timeout: null,
				user: {},
				keyword: '',
				openRegister:false
			}
		},

		computed: {
			defaultActive() {

				let routePath = this.$route.matched[1].path || '/';
				// 如果是动态路由，则只取前一级路由 /pager/:id
				if (routePath.indexOf('/', 1) !== -1) {
					// 截取一级路由 /movie
					routePath = routePath.substring(0, routePath.indexOf('/', 1));
				}
				return routePath;
			},
			...mapGetters([
				'name',
				'avatar',
				'isLogin'
			])
		},
		mounted() {
			this.getToken();
		},
		methods: {
			getToken() {
				let token = this.$route.query.thirdToken || '';
				if (token) {
					setToken(token);
					self.opener.location.reload();
					window.close()
				}
				if (!this.isLogin) {
					this.$router.push("/").catch(err => {});
				}
			},
	
			

			handleCommand(command) {
				if (!this.isLogin) {
					this.$store.dispatch('showLoginForm');
				}
				switch (command) {
					case 'profile':
						window.open('/profile', '_blank');
						break;
					case 'editPassword':
						window.open("/profile/editPassword", '_blank');
						break;
					case 'page':
						// 以新窗口方式 打开编辑文章窗口
						window.open('/page', '_blank');
						break;
					case 'logout':
						this.$store.dispatch('LogOut').then(() => {
							this.$router.push("/");
							this.$message({
								message: '退出成功',
								type: 'success'
							});
							
						}).catch(err => {});
						break;
					default:
						break
				}
			}
		}
	}
</script>

<style scoped>
	.avatar {
		margin: 0 auto;
		border-radius: 50%;
	}

	.h-r-login li a:hover,
	.nav li a:hover,
	.nav li.current a {
		text-decoration: none
	}

	.h-r-login,
	.h-r-search {
		float: right;
		padding-top: 22px
	}

	.h-r-login li {
		float: left;
		margin-left: 10px;
		position: relative;
	}

	.h-r-login li a {
		cursor: pointer;
		line-height: 50px;
		color: #666;
		font-size: 16px;
		transition: .3s;
		-webkit-transition: .3s
	}

	.h-r-login li.h-r-user a img {
		border-radius: 50%;
		width: 30px;
		height: 30px
	}

	.h-r-login li.h-r-user span {
		max-width: 60px;
		height: 17px;
		font-size: 16px;
		line-height: 16px;
		overflow: hidden
	}

	.red-point {
		position: absolute;
		right: -4px;
		top: 8px;
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #cb2020;
		text-indent: -9999px
	}

	.right-menu {
		float: right;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background .3s;

				&:hover {
					background: rgba(0, 0, 0, .025)
				}
			}
		}

		.avatar-container {
			margin-right: 30px;

			.avatar-wrapper {
				margin-top: 5px;
				position: relative;

				.user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}
</style>
