import request from '@/utils/request'


export function listShop(query) {
  return request({
    url: '/ball/shop/list',
    method: 'get',
    params: query
  })
}


export function getShop(shopId) {
  return request({
    url: '/ball/shop/' + shopId,
    method: 'get'
  })
}


export function addShop(data) {
  return request({
    url: '/ball/shop',
    method: 'post',
    data: data
  })
}

export function updateShop(data) {
  return request({
    url: '/ball/shop',
    method: 'put',
    data: data
  })
}


export function delShop(shopId) {
  return request({
    url: '/ball/shop/' + shopId,
    method: 'delete'
  })
}