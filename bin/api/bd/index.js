import request from '@/utils/request'

// 查询通知公告列表
export function listNotice(query) {
  return request({
    url: '/ball/notice/list',
    method: 'get',
    params: query
  })
}

// 查询通知公告详细
export function getNotice(id) {
  return request({
    url: '/ball/notice/' + id,
    method: 'get'
  })
}

// 新增通知公告
export function addNotice(data) {
  return request({
    url: '/ball/notice',
    method: 'post',
    data: data
  })
}

// 修改通知公告
export function updateNotice(data) {
  return request({
    url: '/ball/notice',
    method: 'put',
    data: data
  })
}

// 删除通知公告
export function delNotice(id) {
  return request({
    url: '/ball/notice/' + id,
    method: 'delete'
  })
}


// 查询banner列表
export function listBanner(query) {
    return request({
      url: '/ball/banner/list',
      method: 'get',
      params: query
    })
  }
  
  // 查询banner详细
  export function getBanner(id) {
    return request({
      url: '/ball/banner/' + id,
      method: 'get'
    })
  }
  
  // 新增banner
  export function addBanner(data) {
    return request({
      url: '/ball/banner',
      method: 'post',
      data: data
    })
  }
  
  // 修改banner
  export function updateBanner(data) {
    return request({
      url: '/ball/banner',
      method: 'put',
      data: data
    })
  }
  
  // 删除banner
  export function delBanner(id) {
    return request({
      url: '/ball/banner/' + id,
      method: 'delete'
    })
  }

  // 查询订场列表
export function listUser(query) {
    return request({
      url: '/ball/user/list',
      method: 'get',
      params: query
    })
  }

    // 查询订场列表
export function changeUserMoney(data) {
  return request({
    url: '/ball/user/money',
    method: 'PUT',
    data: data
  })
}


  
  // 查询订场详细
  export function getUser(id) {
    return request({
      url: '/ball/user/' + id,
      method: 'get'
    })
  }
  
  // 新增订场
  export function addUser(data) {
    return request({
      url: '/system/user',
      method: 'post',
      data: data
    })
  }
  
  // 修改订场
  export function updateUser(data) {
    return request({
      url: '/system/user',
      method: 'put',
      data: data
    })
  }
  
  // 删除订场
  export function delUser(id) {
    return request({
      url: '/system/user/' + id,
      method: 'delete'
    })
  }

  
// 查询场地列表
export function listSite(query) {
    return request({
      url: '/ball/site/list',
      method: 'get',
      params: query
    })
  }
  
  // 查询场地列表
export function listSiteInfo(query) {
  return request({
    url: '/ball/site/info',
    method: 'get',
    params: query
  })
}

  // 查询场地详细
  export function getSite(id) {
    return request({
      url: '/ball/site/' + id,
      method: 'get'
    })
  }
  
  // 新增场地
  export function addSite(data) {
    return request({
      url: '/ball/site',
      method: 'post',
      data: data
    })
  }
  
  // 修改场地
  export function updateSite(data) {
    return request({
      url: '/ball/site',
      method: 'put',
      data: data
    })
  }
  
  // 删除场地
  export function delSite(id) {
    return request({
      url: '/ball/site/' + id,
      method: 'delete'
    })
  }

  // 查询门店文件列表
export function listFile(query) {
    return request({
      url: '/ball/file/list',
      method: 'get',
      params: query
    })
  }
  
  // 查询门店文件详细
  export function getFile(id) {
    return request({
      url: '/ball/file/' + id,
      method: 'get'
    })
  }
  
  // 新增门店文件
  export function addFile(data) {
    return request({
      url: '/ball/file',
      method: 'post',
      data: data
    })
  }
  
  // 修改门店文件
  export function updateFile(data) {
    return request({
      url: '/ball/file',
      method: 'put',
      data: data
    })
  }
  
  // 删除门店文件
  export function delFile(id) {
    return request({
      url: '/system/file/' + id,
      method: 'delete'
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
  
    // 新增订单
    export function addOrderReserve(data) {
      return request({
        url: '/ball/order/reserve',
        method: 'post',
        data: data
      })
    }
    export function cancelOrderReserve(data) {
      return request({
        url: '/ball/order/cancel/reserve',
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


  
export function listCoach(query) {
  return request({
    url: '/ball/coach/list',
    method: 'get',
    params: query
  })
}


export function getCoach(id) {
  return request({
    url: '/ball/coach/' + id,
    method: 'get'
  })
}


export function addCoach(data) {
  return request({
    url: '/ball/coach',
    method: 'post',
    data: data
  })
}

export function updateCoach(data) {
  return request({
    url: '/ball/coach',
    method: 'put',
    data: data
  })
}


export function delCoach(id) {
  return request({
    url: '/ball/coach/' + id,
    method: 'delete'
  })
}


export function listCourse(query) {
  return request({
    url: '/ball/course/list',
    method: 'get',
    params: query
  })
}

export function updateAgreement(data) {
  return request({
    url: '/ball/agreement',
    method: 'put',
    data: data
  })
}



export function getAgreement(id) {
  return request({
    url: '/ball/agreement/' + id,
    method: 'get'
  })
}


export function getCourse(id) {
  return request({
    url: '/ball/course/' + id,
    method: 'get'
  })
}


export function addCourse(data) {
  return request({
    url: '/ball/course',
    method: 'post',
    data: data
  })
}

export function updateCourse(data) {
  return request({
    url: '/ball/course',
    method: 'put',
    data: data
  })
}


export function delCourse(id) {
  return request({
    url: '/ball/course/' + id,
    method: 'delete'
  })
}

export function listActivity(query) {
  return request({
    url: '/ball/activity/list',
    method: 'get',
    params: query
  })
}

export function getActivity(id) {
  return request({
    url: '/ball/activity/' + id,
    method: 'get'
  })
}

export function addActivity(data) {
  return request({
    url: '/ball/activity',
    method: 'post',
    data: data
  })
}

export function updateActivity(data) {
  return request({
    url: '/ball/activity',
    method: 'put',
    data: data
  })
}


export function delActivity(id) {
  return request({
    url: '/ball/activity/' + id,
    method: 'delete'
  })
}

export function listCourseUser(query) {
  return request({
    url: '/ball/course_user/list',
    method: 'get',
    params: query
  })
}

export function listCourseLogs(query) {
  return request({
    url: '/ball/course_logs/list',
    method: 'get',
    params: query
  })
}

export function creatCourseLogs(data) {
  return request({
    url: '/ball/course_logs',
    method: 'post',
    data: data
  })
}