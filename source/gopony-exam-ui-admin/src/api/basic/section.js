import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

// 查询单元列表
export function listSection(query) {
  return request({
    url: '/basic/section/list',
    method: 'get',
    params: query
  })
}

// 查询单元详细
export function getSection(id) {
  return request({
    url: '/basic/section/' + id,
    method: 'get'
  })
}

// 新增单元
export function addSection(data) {
  return request({
    url: '/basic/section',
    method: 'post',
    data: data
  })
}

// 修改单元
export function updateSection(data) {
  return request({
    url: '/basic/section',
    method: 'put',
    data: data
  })
}

// 删除单元
export function delSection(id) {
  return request({
    url: '/basic/section/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeSectionStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/basic/section/changeStatus',
    method: 'put',
    data: data
  })
}
