// // // // 自动生成接口 5 个。

//查询宠物详情
export const getPet = params => http.get(`/pet/${params.petId}`)

//新建宠物信息
export const postPet = body => http.post('/pet', body)

//修改宠物信息
export const putPet = body => http.put('/pet', body)

//删除宠物信息
export const deletePet = body => http.delete(`/pet/${body.petId}`)

//根据状态查找宠物列表
export const getPetFindByStatus = params => http.get('/pet/findByStatus', { params })
自动生成接口 2 个。

//查询宠物详情
export const getPet = params => http.get(`/pet/${params.petId}`)

//删除宠物信息
export const deletePet = body => http.delete(`/pet/${body.petId}`)
自动生成接口 2 个。

//查询宠物详情
export const getPet = params => http.get(`/pet/${params.petId}`)

//删除宠物信息
export const deletePet = body => http.delete(`/pet/${body.petId}`)
自动生成接口 2 个。

//查询宠物详情
export const getPet = params => http.get(`/pet/${params.petId}`)

//删除宠物信息
export const deletePet = body => http.delete(`/pet/${body.petId}`)
自动生成接口 2 个。

//查询宠物详情
export const getPet = params => http.get(`/pet/${params.petId}`)

//删除宠物信息
export const deletePet = body => http.delete(`/pet/${body.petId}`)
