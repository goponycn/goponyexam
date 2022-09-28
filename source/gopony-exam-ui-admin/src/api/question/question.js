import request from '@/utils/request'

// 查询习题列表
export function listQuestion(query) {
  return request({
    url: '/question/question/list',
    method: 'get',
    params: query
  })
}

// 查询习题详细
export function getQuestion(id) {
  return request({
    url: '/question/question/' + id,
    method: 'get'
  })
}

// 查询习题列表
export function autoSelectQuestion(query) {
  return request({
    url: '/question/question/auto',
    method: 'get',
    params: query
  })
}
