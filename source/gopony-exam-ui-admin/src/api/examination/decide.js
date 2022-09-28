import request from '@/utils/request'

// 查询考试学员列表
export function listDecide(query) {
  return request({
    url: '/examination/decide/list',
    method: 'get',
    params: query
  })
}

// 查询考试学员详细
export function getDecide(id) {
  return request({
    url: '/examination/decide/info/' + id,
    method: 'get'
  })
}


// 批阅
export function updateDecide(data) {
  return request({
    url: '/examination/decide/edit',
    method: 'put',
    data: data
  })
}

// 查询试卷下拉列表
export function getPapers(id) {
  return request({
    url: '/examination/decide/papers/' + id,
    method: 'get'
  })
}
