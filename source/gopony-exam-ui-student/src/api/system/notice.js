import request from '@/utils/request'

export function listNotice(query)  {
    return request({
      url: '/student/notice/list',
      method: 'get',
	  params: query
    });
}