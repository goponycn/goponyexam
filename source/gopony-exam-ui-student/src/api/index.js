import request from '@/utils/request'


export function getIndex() {
    return request({
      url: '/student/index',
      method: 'get'
    });
}
