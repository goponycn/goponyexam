import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

// 查询课程列表
export function listCourse(query) {
  return request({
    url: '/basic/course/list',
    method: 'get',
    params: query
  })
}

// 查询课程详细
export function getCourse(id) {
  return request({
    url: '/basic/course/' + id,
    method: 'get'
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: '/basic/course',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateCourse(data) {
  return request({
    url: '/basic/course',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delCourse(id) {
  return request({
    url: '/basic/course/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeCourseStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/basic/course/changeStatus',
    method: 'put',
    data: data
  })
}
