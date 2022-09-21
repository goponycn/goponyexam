import request from '@/utils/request'

// 获取第三方登录跳转信息
export function authRender(source) {
  return request({
    url: '/student/auth/render/' + source,
    method: 'get'
  })
}
