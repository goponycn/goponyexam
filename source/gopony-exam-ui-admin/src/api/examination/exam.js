import request from '@/utils/request'

// 查询考试列表
export function listExam(query) {
  return request({
    url: '/examination/exam/list',
    method: 'get',
    params: query
  })
}

// 查询考试详细
export function getExam(id) {
  return request({
    url: '/examination/exam/' + id,
    method: 'get'
  })
}

// 查询试卷下拉列表
export function getPapers(id) {
  return request({
    url: '/examination/exam/papers/' + id,
    method: 'get'
  })
}

// 启用考场
export function enableExam(id) {
  return request({
    url: '/examination/exam/enable/' + id,
    method: 'put'
  })
}

// 取消考场
export function cancelExam(id) {
  return request({
    url: '/examination/exam/cancel/' + id,
    method: 'put'
  })
}

// 结束考场
export function finishExam(id) {
  return request({
    url: '/examination/exam/finish/' + id,
    method: 'put'
  })
}

// 新增考试
export function addExam(data) {
  return request({
    url: '/examination/exam',
    method: 'post',
    data: data
  })
}

// 修改考试
export function updateExam(data) {
  return request({
    url: '/examination/exam',
    method: 'put',
    data: data
  })
}

// 删除考试
export function delExam(id) {
  return request({
    url: '/examination/exam/' + id,
    method: 'delete'
  })
}
