import request from '@/utils/request'

// 查询试卷列表
export function listPaper(query) {
  return request({
    url: '/examination/paper/list',
    method: 'get',
    params: query
  })
}

// 查询试卷详细
export function getPaper(id) {
  return request({
    url: '/examination/paper/' + id,
    method: 'get'
  })
}

// 查询试卷预览详细
export function getPreview(id) {
  return request({
    url: '/examination/paper/preview/' + id,
    method: 'get'
  })
}

// 新增试卷
export function addPaper(data) {
  return request({
    url: '/examination/paper',
    method: 'post',
    data: data
  })
}

// 修改试卷
export function updatePaper(data) {
  return request({
    url: '/examination/paper',
    method: 'put',
    data: data
  })
}

// 删除试卷
export function delPaper(id) {
  return request({
    url: '/examination/paper/' + id,
    method: 'delete'
  })
}
