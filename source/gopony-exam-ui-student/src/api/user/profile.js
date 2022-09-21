import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/student/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/student/user/updateProfile',
    method: 'put',
    data: data
  })
}

// 用户密码修改
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/student/user/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/student/user/avatar',
    method: 'post',
    data: data
  })
}


