import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

// 查询班级列表
export function listTeam(query) {
  return request({
    url: '/basic/team/list',
    method: 'get',
    params: query
  })
}

// 查询班级详细
export function getTeam(id) {
  return request({
    url: '/basic/team/' + id,
    method: 'get'
  })
}

// 新增班级
export function addTeam(data) {
  return request({
    url: '/basic/team',
    method: 'post',
    data: data
  })
}

// 修改班级
export function updateTeam(data) {
  return request({
    url: '/basic/team',
    method: 'put',
    data: data
  })
}

// 删除班级
export function delTeam(id) {
  return request({
    url: '/basic/team/' + id,
    method: 'delete'
  })
}

// 状态修改
export function changeTeamStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/basic/team/changeStatus',
    method: 'put',
    data: data
  })
}
