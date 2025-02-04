import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    url: '/system/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'delete'
  })
}