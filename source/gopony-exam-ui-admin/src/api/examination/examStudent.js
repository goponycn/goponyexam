import request from '@/utils/request'

// 查询考试学员列表
export function listExamStudent(query) {
  return request({
    url: '/examination/examStudent/list',
    method: 'get',
    params: query
  })
}

// 查询考试学员详细
export function getExamStudent(id) {
  return request({
    url: '/examination/examStudent/' + id,
    method: 'get'
  })
}

// 新增考试学员
export function addExamStudent(data) {
  return request({
    url: '/examination/examStudent',
    method: 'post',
    data: data
  })
}

// 修改考试学员
export function updateExamStudent(data) {
  return request({
    url: '/examination/examStudent',
    method: 'put',
    data: data
  })
}

// 删除考试学员
export function delExamStudent(id) {
  return request({
    url: '/examination/examStudent/' + id,
    method: 'delete'
  })
}
