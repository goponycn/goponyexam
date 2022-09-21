import request from '@/utils/request'

export function getDictsByTypeList(dictTypeList) {
  return request({
    url: '/student/dict/data/listByDictTypeList',
    method: 'post',
    data: dictTypeList
  })
}

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/student/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/student/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/student/dict/data/type/' + dictType,
    method: 'get'
  })
}


