const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  // 登录状态
  isLogin: (state) => state.user.token,
  // 用户ID
  userId: (state) => state.user.userId,
  // 登录弹出框
  loginFormVisible: (state) => state.user.loginFormVisible,
  // 登录弹出框
  registerFormVisible: (state) => state.user.registerFormVisible,
  //签到数据
  signRecord: (state) => state.user.signRecord
}
export default getters
