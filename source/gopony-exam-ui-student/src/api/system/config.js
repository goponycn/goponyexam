import request from '@/utils/request'

// 查询站点配置详细
export function getConfig() {
  return request({
    url: '/student/config/getConfig' ,
    method: 'post'
  })
}
