import request from '@/utils/request'
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload"); // 上传的图片服务器地址

//文件上传
export const upload = (data) => {
  return request({
    url: "/common/upload",
    method: 'post',
    data
  })
};

