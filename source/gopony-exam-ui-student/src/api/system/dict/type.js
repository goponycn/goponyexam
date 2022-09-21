import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
  return request({
    url: '/student/dict/type/list',
    method: 'get',
    params: query
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/student/dict/type/' + dictId,
    method: 'get'
  })
}


// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/student/dict/type/optionselect',
    method: 'get'
  })
}