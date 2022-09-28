import request from '@/utils/request'

// 查询习题列表
export function listQuestion(query) {
  return request({
    url: '/question/explain/list',
    method: 'get',
    params: query
  })
}

// 查询习题详细
export function getQuestion(id) {
  return request({
    url: '/question/explain/' + id,
    method: 'get'
  })
}

// 新增习题
export function addQuestion(data) {
  return request({
    url: '/question/explain',
    method: 'post',
    data: data
  })
}

// 修改习题
export function updateQuestion(data) {
  return request({
    url: '/question/explain',
    method: 'put',
    data: data
  })
}

// 删除习题
export function delQuestion(id) {
  return request({
    url: '/question/explain/' + id,
    method: 'delete'
  })
}
