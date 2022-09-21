import request from '@/utils/request'

// 查询试卷列表
export function listPaper(query) {
  return request({
    url: '/student/paper/list',
    method: 'get',
    params: query
  })
}

// 试卷信息
export function getPaper(id) {
  return request({
    url: '/student/paper/' + id,
    method: 'get'
  })
}


// 试卷详细信息
export function getPaperDetail(id) {
  return request({
    url: '/student/paper/detail/' + id,
    method: 'get'
  })
}

// 提交试卷
export function savePaper(data) {
  return request({
    url: '/student/paper/update',
    method: 'post',
    data: data
  })
}

