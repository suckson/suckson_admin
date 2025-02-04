import request from '@/utils/request'


export function listSite(query) {
  return request({
    url: '/ball/site/list',
    method: 'get',
    params: query
  })
}


export function getSite(siteId) {
  return request({
    url: '/system/site/' + siteId,
    method: 'get'
  })
}


export function addSite(data) {
  return request({
    url: '/system/site',
    method: 'post',
    data: data
  })
}

export function updateSite(data) {
  return request({
    url: '/system/site',
    method: 'put',
    data: data
  })
}


export function delSite(SiteId) {
  return request({
    url: '/system/site/' + SiteId,
    method: 'delete'
  })
}