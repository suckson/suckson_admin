import request from '@/utils/request'

// 查询订单列表
export function listOrder(query) {
  return request({
    url: '/ball/order',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getOrder(orderNo) {
  return request({
    url: '/ball/order/' + orderNo,
    method: 'get'
  })
}

// 新增订单
export function addOrder(data) {
  return request({
    url: '/ball/order',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateOrder(data) {
  return request({
    url: '/ball/order',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delOrder(orderNo) {
  return request({
    url: '/ball/order/' + orderNo,
    method: 'delete'
  })
}


// 查询订单列表
export function listTransactionRecord(query) {
  return request({
    url: '/ball/transaction/record/list',
    method: 'get',
    params: query
  })
}

