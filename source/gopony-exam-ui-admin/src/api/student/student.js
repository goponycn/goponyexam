import request from '@/utils/request'

// 查询学员列表列表
export function listStudent(query) {
  return request({
    url: '/student/student/list',
    method: 'get',
    params: query
  })
}

// 查询学员列表详细
export function getStudent(id) {
  return request({
    url: '/student/student/' + id,
    method: 'get'
  })
}

// 新增学员列表
export function addStudent(data) {
  return request({
    url: '/student/student',
    method: 'post',
    data: data
  })
}

// 修改学员列表
export function updateStudent(data) {
  return request({
    url: '/student/student',
    method: 'put',
    data: data
  })
}

// 删除学员列表
export function delStudent(id) {
  return request({
    url: '/student/student/' + id,
    method: 'delete'
  })
}
