import request from '@/utils/request'

// 登录
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/student/login',
    method: 'post',
    headers: {
      isToken: false
    },
    data: data
  })
}


// 注册
export function register(data) {
  return request({
    url: '/student/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/student/getInfo',
    method: 'get'
  })
}

// 退出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCaptchaImage(query) {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
	params: query,
    timeout: 20000
  })
}
