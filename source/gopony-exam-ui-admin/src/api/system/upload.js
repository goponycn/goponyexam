import request from '@/utils/request'

// 查询上传文件列表
export function listUpload(query) {
  return request({
    url: '/basic/upload/list',
    method: 'get',
    params: query
  })
}

// 查询上传文件详细
export function getUpload(id) {
  return request({
    url: '/basic/upload/' + id,
    method: 'get'
  })
}

// 新增上传文件
export function addUpload(data) {
  return request({
    url: '/basic/upload',
    method: 'post',
    data: data
  })
}

// 修改上传文件
export function updateUpload(data) {
  return request({
    url: '/basic/upload',
    method: 'put',
    data: data
  })
}

// 删除上传文件
export function delUpload(id) {
  return request({
    url: '/basic/upload/' + id,
    method: 'delete'
  })
}
