<template>
  <div class="info_main">
    <el-form ref="formRef" style="max-width: 1000px" size="large" :model="form" :rules="rules" label-width="auto" label-position="top">
      <el-row>
        <el-col :span="24">
          <el-form-item label="场馆头像" prop="avatar">
            <ImageUpload :limit="1" v-model:modelValue="form.avatar"></ImageUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="场馆名称" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="场馆电话" prop="phone">
            <el-input v-model="form.phone" style="width: 90%;"  autocomplete="off"  />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="可预约天数" prop="reserveDay">
            <el-input-number v-model="form.reserveDay" style="width: 90%;"  autocomplete="off"  />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="营业时间" prop="workTime">
            <el-time-picker  v-model="form.workTime" value-format="HH:mm" format="HH:mm" is-range range-separator="至" start-placeholder="选择开始时间"
              end-placeholder="选择结束时间" />
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item label="场馆地址" prop="address">
            <el-button type="primary" text
              @click="$refs.mapPickerRef.open(form.address, [form.longitude, form.latitude])">{{ form.address ? '修改' :
              '选择'}}</el-button> <map-picker @confirm="chooseAddress" ref="mapPickerRef"></map-picker>
            <el-text type="danger" text style="margin: 0 0 0 8px;font-size: 14px;">{{ form.address }}</el-text>
          </el-form-item>
        </el-col>
    
        <el-col :span="24">
          <el-form-item label="场馆相册" prop="imgList">
            <ImageUpload :limit="5" v-model:modelValue="form.imgList"></ImageUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="标签" prop="tags">
            <tabs-form-item v-model:tags="form.tags"> </tabs-form-item>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="场馆服务" prop="serve">
            <el-input v-model="form.serve" :autosize="{ minRows: 4 }" type="textarea" style="width: 90%;"
              placeholder="介绍一下你的场馆服务"  autocomplete="off"  />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="场馆简介" prop="desc">
            <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 4, maxRows: 100 }"
              placeholder="介绍一下你的场馆吧"  autocomplete="off"  />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="smbit-btn">
      <el-button @click="router.go(-1)" size="large">返回</el-button>
      <el-button @click="submit" type="primary" size="large">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElInput, avatarEmits } from 'element-plus'
import { objKeySetVal } from '@/utils/common'
import { getShop, updateShop, addShop } from '@api/system/shop'
import ImageUpload from "@/components/ImageUpload"
import mapPicker from "@/components/map-picker"
import tabsFormItem from "@/components/tabs-form-item"

const route = useRoute()

const router = useRouter()

const mapPickerRef = ref(null)

const { proxy } = getCurrentInstance();

const form = reactive({
  name: '',
  avatar: '',
  reserveDay: '',
  longitude: '',
  latitude: '',
  address: "",
  imgList: [],
  workTime: '',
  phone: "",
  tags: [],
  desc:'',
  serve: ''
})

const rules = reactive({
  name: [{ required: true, message: "名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "长度必须介于 2 和 20 之间", trigger: "blur" }],
  phone: [{ required: true, message: "电话不能为空", trigger: "blur" },{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: "请输入正确的手机号码"}],
  reserveDay: [{ required: true, message: "可预约天数不能为空", trigger: "blur" }],
  address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
  workTime: [{ required: true, message: "营业时间不能为空", trigger: "blur" }],
  avatar: [{ required: true, message: "头像不能为空", trigger: "blur" }],
  imgList: [{ required: true, message: "场馆相册不能为空", trigger: "blur" }],
})

const chooseAddress = (data) => {
  form.longitude = data.lng
  form.latitude = data.lat
  form.address = data.address
}
onMounted(() => {
  getShopDetail()
})

const getShopDetail = () => {
  if (route.query.id) { // 有id 进行编辑
    getShop(route.query.id || '').then((res) => {
      objKeySetVal(res.data, form, ['workTime', 'imgList', 'tags'])
      form.workTime = res.data.workTime.split('-')
      form.imgList =  res.data.imgList.split(',')
      form.tags = JSON.parse(res.data.tags)
      console.log(JSON.parse(res.data.tags));
    })
  }
}

const submit = () => {
  proxy.$refs.formRef.validate(valid => {
  if(!valid) { 
    ElMessage({ message: '请完善资料', type: 'warning' })
    return 
  }
  if (route.query.id) { // 有id 进行编辑
    updateShop({    
      ...form,
      avatar: form.avatar[0]?.url,
      imgList: form.imgList.map(item => (item.url)).join(','),
      tags: JSON.stringify(form.tags),
      workTime: form.workTime.join('-'), id:route.query.id}).then((res) => {
      if (res.code == 200) {
        ElMessage({ message: '更新成功', type: 'success' })
      }
    })
  }else{
    addShop({
      ...form,
      avatar:form.avatar[0]?.url || '',
      imgList: form.imgList.map(item => (item.url)).join(','),
      tags: JSON.stringify(form.tags),
      workTime: form.workTime.join('-')
    }).then((res) => {
    if (res.code == 200) {
      ElMessage({ message: '添加成功', type: 'success' })
    }
  })
  }
})
}
</script>

<style scoped>
.info_main {
  padding: 10px 30px;

  .info_box {
    .tips {
      color: #606266;
      font-size: 12px;
    }
  }

  .info_box p {
    color: #303133;
  }

  padding-bottom: 80px;
}
</style>