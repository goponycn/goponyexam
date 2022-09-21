import request from '@/utils/request'

// 查询签到日志列表
export function listSign(query) {
  return request({
    url: '/student/sign/list',
    method: 'get',
    params: query
  })
}

// 签到
export function signIn() {
  return request({
    url: '/student/sign/signIn',
    method: 'post'
  })
}
