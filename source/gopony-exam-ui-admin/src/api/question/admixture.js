import request from '@/utils/request'

// 查询习题列表
export function listQuestion(query) {
  return request({
    url: '/question/admixture/list',
    method: 'get',
    params: query
  })
}


// 查询习题详细
export function getQuestion(id) {
  return request({
    url: '/question/admixture/' + id,
    method: 'get'
  })
}

// 新增习题
export function addQuestion(data) {
  return request({
    url: '/question/admixture',
    method: 'post',
    data: data
  })
}

// 修改习题
export function updateQuestion(data) {
  return request({
    url: '/question/admixture',
    method: 'put',
    data: data
  })
}

// 删除习题
export function delQuestion(id) {
  return request({
    url: '/question/admixture/' + id,
    method: 'delete'
  })
}

// 查询习题子题列表
export function detailQuestion(id) {
  return request({
    url: '/question/admixture/detail/' + id,
    method: 'get'
  })
}

// 查询习题详细子题
export function getSubQuestion(id) {
  return request({
    url: '/question/admixture/subquestion/' + id,
    method: 'get'
  })
}

// 新增习题子题
export function addSubQuestion(data) {
  return request({
    url: '/question/admixture/subquestion',
    method: 'post',
    data: data
  })
}

// 修改习题子题
export function updateSubQuestion(data) {
  return request({
    url: '/question/admixture/subquestion',
    method: 'put',
    data: data
  })
}

// 删除习题子题
export function delSubQuestion(id) {
  return request({
    url: '/question/admixture/subquestion/' + id,
    method: 'delete'
  })
}
