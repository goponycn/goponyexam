import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

// 查询科目列表
export function listSubject(query) {
  return request({
    url: '/basic/subject/list',
    method: 'get',
    params: query
  })
}

// 查询科目详细
export function getSubject(id) {
  return request({
    url: '/basic/subject/' + id,
    method: 'get'
  })
}

// 新增科目
export function addSubject(data) {
  return request({
    url: '/basic/subject',
    method: 'post',
    data: data
  })
}

// 修改科目
export function updateSubject(data) {
  return request({
    url: '/basic/subject',
    method: 'put',
    data: data
  })
}

// 删除科目
export function delSubject(id) {
  return request({
    url: '/basic/subject/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeSubjectStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/basic/subject/changeStatus',
    method: 'put',
    data: data
  })
}
