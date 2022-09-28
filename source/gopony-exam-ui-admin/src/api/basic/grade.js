import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

// 查询年级列表
export function listGrade(query) {
  return request({
    url: '/basic/grade/list',
    method: 'get',
    params: query
  })
}

// 查询年级详细
export function getGrade(id) {
  return request({
    url: '/basic/grade/' + id,
    method: 'get'
  })
}

// 新增年级
export function addGrade(data) {
  return request({
    url: '/basic/grade',
    method: 'post',
    data: data
  })
}

// 修改年级
export function updateGrade(data) {
  return request({
    url: '/basic/grade',
    method: 'put',
    data: data
  })
}

// 删除年级
export function delGrade(id) {
  return request({
    url: '/basic/grade/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeGradeStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/basic/grade/changeStatus',
    method: 'put',
    data: data
  })
}
