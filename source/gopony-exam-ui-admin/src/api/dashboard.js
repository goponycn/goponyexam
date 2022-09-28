import request from '@/utils/request'

// 查询服务器详细
export function getDashboard() {
  return request({
    url: '/dashboard/index',
    method: 'get'
  })
}