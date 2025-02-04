<template>
    <div class="info_main">
        <el-form ref="formRef" style="max-width: 1000px" size="large" :model="form" :rules="rules" label-width="auto"
            label-position="top">
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="活动封面" prop="cover">
                        <ImageUpload :limit="1" v-model:modelValue="form.cover"></ImageUpload>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="活动名称" prop="name">
                        <el-input v-model="form.name" style="width: 100%;" placeholder="请输入" autocomplete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属场馆" prop="shopId">
                        <el-select v-model="form.shopId" style="width: 100%;" autocomplete="off" @change="shopChange"  @visible-change="shopVisible">
                            <el-option v-for="item in shopListData" :key="item.id" :label="item.name" :value="item.id"></el-option>  
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="场地号" prop="siteList">
                        <el-select v-model="form.siteList" multiple value-key="id" autocomplete="off" style="width: 100%;" @visible-change="siteVisible">
                            <el-option v-for="item in siteListData" :key="item.id" :label="item.name" :value="item.id"></el-option>  
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="8" >
                <el-form-item label="场馆地址" prop="address">
                    <el-button type="primary" text  @click="$refs.mapPickerRef.open(form.address, [form.longitude, form.latitude])">{{ form.address ? '修改' : '选择'}}</el-button> <map-picker @confirm="chooseAddress" ref="mapPickerRef"></map-picker>
                    <el-text type="danger" text style="margin: 0 0 0 8px;font-size: 14px;">{{ form.address }}</el-text>
                </el-form-item>
                </el-col> -->
                <el-col :span="8">
                    <el-form-item label="最大报名人数" prop="personMax">
                        <el-input-number v-model="form.personMax" min="1" style="width: 100%;" placeholder="请输入" autocomplete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="起始时间" prop="dateTime">
                        <el-date-picker v-model="form.dateTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="form.price" placeholder="请输入" style="width: 100%;" autocomplete="off">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="是否允许退款" prop="refund">
                        <el-select v-model="form.refund" autocomplete="off" style="width: 100%;">
                            <el-option label="否" value="0"></el-option>  
                            <el-option label="是" value="1"></el-option>  
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="停止报名时间" prop="refundEndTime">
                        <el-date-picker type="datetime"  value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" v-model="form.stopTimme" placeholder="请输入" style="width: 100%;" autocomplete="off" >
                        </el-date-picker >
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="报名联系人" prop="contact">
                        <el-input v-model="form.contact" style="width: 100%;" autocomplete="off">
                        </el-input>
                        <!-- <el-select v-model="form.contact" autocomplete="off" style="width: 100%;">
                            <el-option v-for="item in shopList" :label="item.name" :value="item.id"></el-option>  
                        </el-select> -->
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系电话" prop="contactPhone">
                        <el-input v-model="form.contactPhone" style="width: 100%;" autocomplete="off">
                        </el-input>
                        <!-- <el-select v-model="form.contact_phone" autocomplete="off" style="width: 100%;">
                            <el-option v-for="item in shopList" :label="item.name" :value="item.id"></el-option>  
                        </el-select> -->
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" :autosize="{ minRows: 4 }" type="textarea"
                        placeholder="介绍一下你的场馆服务"  autocomplete="off"  />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="活动介绍" prop="content">
                        <WangEditor v-model:value="form.content" placeholder="课程详情"
                            height="400px" />
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
import ImageUpload from "@/components/ImageUpload"
import tabsFormItem from "@/components/tabs-form-item"
import { getActivity, listShop, listSite, updateActivity, addActivity } from "@api/bd";
import dayjs from 'dayjs'



const route = useRoute()

const router = useRouter()

const { proxy } = getCurrentInstance();

const coachList = ref([])

const shopListData = ref([])
const siteListData = ref([])
const selectSite = ref({})

const form = reactive({
    // imgList: [],

    /// 活动地址
    address: '',
    /// 报名联系人
    contact: '',
    /// 联系电话
    contactPhone: '',
    /// 活动介绍
    content: '',
    /// 活动图片
    cover: '',
    /// 活动结束时间
    endTime: '',
    /// 维度
    latitude: '',
    /// 经度
    longitude: '',
    /// 活动名称
    name: '',
    /// 报名最大人数
    personMax: null,
    /// 价格
    price: null,
    /// 是否允许退款（0否 1是）
    refund: '0',
    /// 距活动开始n分钟前停止报名
    refundEndTime: null,
    /// 场馆id
    shopId: '',
    /// 场地集合
    siteList: '',
    /// 活动开始时间
    startTime: '',
    dateTime:[],
})

const rules = reactive({
    name: [{ required: true, message: "活动名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "长度必须介于 2 和 20 之间", trigger: "blur" }],
    cover: [{ required: true, message: "活动封面不能为空", trigger: "blur" }],
    shopId: [{ required: true, message: "所属球馆不能为空", trigger: "blur" }],
    siteId: [{ required: true, message: "场地号不能为空", trigger: "blur" }],
    personMax: [{ required: true, message: "最大报名人数不能为空", trigger: "blur" }],
    dateTime: [{ type:'array', required: true, message: "活动起始时间不能为空", trigger: "blur" }],
    price: [{ required: true, message: "活动价格不能为空", trigger: "blur" }],
    contact: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
    contactPhone: [{ required: true, message: "联系电话不能为空", trigger: "blur" }],
    content: [{ required: true, message: "活动介绍不能为空", trigger: "blur" }],
})


onMounted(() => {
    getDetail()
})

const getlistShop = () => {
    listShop({ pageSize: 100, pageNum: 1 }).then((res) => {
        shopListData.value = res.rows
    })
}
const getlistSite = () => {
    listSite({ pageSize: 100, pageNum: 1, shopId: form.shopId }).then((res) => {
        siteListData.value = res.rows
    })
}

const getDetail = () => {
    if (route.query.id) { // 有id 进行编辑
        getActivity(route.query.id).then((res) => {
            objKeySetVal(res.data, form)
            getlistShop()
            getlistSite()
            form.dateTime = [dayjs(form.startTime).format("YYYY-MM-DD HH:mm"),dayjs(form.endTime).format("YYYY-MM-DD HH:mm")]
        })
    }
}

const shopVisible = (e) =>{
    if(e) getlistShop()
}

const shopChange = (e) =>{
    selectSite.value = shopListData.value.filter((item)=> item.id = e)[0]
    console.log(selectSite.value );
    
    form.address = selectSite.value.address
    form.latitude = selectSite.value.latitude
    form.longitude = selectSite.value.longitude
    form.contact = selectSite.value.name
    form.contactPhone = selectSite.value.phone
}

// const shopChange = (e) =>{
//     selectSite.value = shopListData.value.filter((item)=> item.id = e)[0]
// }

const siteVisible = (e) =>{
    if(e){
        if(!form.shopId){
            ElMessage({ message: '请先选择场馆', type: 'warning' })
        }else{
            getlistSite()
        }
    }
}

const submit = () => {
    // console.log(dateTime.value);
    
    proxy.$refs.formRef.validate(valid => {
        if (!valid) {
            ElMessage({ message: '请完善资料', type: 'warning' })
            return
        }
        if (route.query.id) { // 有id 进行编辑
            updateActivity({
                ...form,
                cover: form.cover[0]?.url || '',
                startTime: form.dateTime[0],
                endTime: form.dateTime[1],
                id: route.query.id
            }).then((res) => {
                if (res.code == 200) {
                    ElMessage({ message: '更新成功', type: 'success' })
                }
            })
        } else {
            addActivity({
                ...form,
                cover: form.cover[0]?.url || '',
                startTime: form.dateTime[0],
                endTime: form.dateTime[1],
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