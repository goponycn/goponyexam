import request from '@/utils/request'

// 查询目录列表
export function listCatalog(query) {
  return request({
    url: '/basic/catalog/list',
    method: 'get',
    params: query
  })
}

// 查询目录详细
export function getCatalog(id) {
  return request({
    url: '/basic/catalog/' + id,
    method: 'get'
  })
}

// 新增目录
export function addCatalog(data) {
  return request({
    url: '/basic/catalog',
    method: 'post',
    data: data
  })
}

// 修改目录
export function updateCatalog(data) {
  return request({
    url: '/basic/catalog',
    method: 'put',
    data: data
  })
}

// 删除目录
export function delCatalog(id) {
  return request({
    url: '/basic/catalog/' + id,
    method: 'delete'
  })
}


// 查询目录列表（排除节点）
export function listCatalogExcludeChild(query) {
  return request({
    url: '/basic/catalog/list/exclude' ,
    method: 'get',
    params: query
  })
}


// 查询目录下拉树结构
export function treeselectCatalog() {
  return request({
    url: '/basic/catalog/treeselect',
    method: 'get'
  })
}

