import request from '@/utils/request'

// 查询成绩单列表
export function listAchievement(query) {
  return request({
    url: '/student/achievement/list',
    method: 'get',
    params: query
  })
}

// 成绩单详细信息
export function getAchievement(id) {
  return request({
    url: '/student/achievement/' + id,
    method: 'get'
  })
}