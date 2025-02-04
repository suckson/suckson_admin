<template>
    <div class="info_main">
        <el-form ref="formRef" style="max-width: 1000px" size="large" :model="form" :rules="rules" label-width="auto"
            label-position="top">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="课程首图" prop="avatar">
                        <ImageUpload :limit="1" v-model:modelValue="form.avatar"></ImageUpload>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="课程名称" prop="name">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属场馆" prop="shopId">
                        <el-select v-model="form.shopId" style="width: 90%;" autocomplete="off" >
                            <el-option v-for="item in shopList" :label="item.name" :value="item.id"></el-option>  
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属教练" prop="coachId">
                        <el-select v-model="form.coachId" style="width: 90%;" autocomplete="off">
                            <el-option v-for="item in coachList" :label="item.userName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="包含课时" prop="includeTime">
                        <el-input-number v-model="form.includeTime" style="width: 100%;" autocomplete="off" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="课程价格" prop="price">
                        <el-input-number v-model="form.price" style="width: 90%;" autocomplete="off" />
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="课程相册" prop="imgList">
                        <ImageUpload :limit="5" v-model:modelValue="form.imgList"></ImageUpload>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="标签" prop="tags">
                        <tabs-form-item v-model:tags="form.tags"> </tabs-form-item>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="课程详情" prop="content">
                        <WangEditor style="width: 100%" v-model:value="form.content" placeholder="课程详情"
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
import { getCourse, updateCourse, addCourse } from '@api/bd'
import ImageUpload from "@/components/ImageUpload"
import tabsFormItem from "@/components/tabs-form-item"
import { listCoach, listShop } from "@api/bd";


const route = useRoute()

const router = useRouter()

const { proxy } = getCurrentInstance();

const coachList = ref([])

const shopList = ref([])

const form = reactive({
    name: '',
    avatar: '',
    coachId: '',
    shopId: '',
    imgList: [],
    price: '',
    content: '',
    includeTime: ''
})

const rules = reactive({
    name: [{ required: true, message: "名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "长度必须介于 2 和 20 之间", trigger: "blur" }],
    avatar: [{ required: true, message: "头像不能为空", trigger: "blur" }],
    coachId: [{ required: true, message: "所属教练", trigger: "blur" }],
    shopId: [{ required: true, message: "所属球馆", trigger: "blur" }],
    content: [{ required: true, message: "课程详情", trigger: "blur" }],
    price: [{ required: true, message: "课程价格", trigger: "blur" }],
    imgList: [{ required: true, message: "课程相册不能为空", trigger: "blur" }],
    includeTime: [{ required: true, message: "包含课时不能为空", trigger: "blur" }],
})

onMounted(() => {
    getDetail()
    getlistCoach()
    getlistShop()
})

const getlistCoach = () => {
    listCoach({ pageSize: 1, pageNum: 100 }).then((res) => {
        coachList.value = res.rows
    })
}
const getlistShop = () => {
    listShop({ pageSize: 1, pageNum: 100 }).then((res) => {
        shopList.value = res.rows
    })
}



const getDetail = () => {
    if (route.query.id) { // 有id 进行编辑
        getCourse(route.query.id || '').then((res) => {
            objKeySetVal(res.data, form, ['imgList', 'tags'])
            form.imgList = res.data.imgList.split(',')
            form.tags = JSON.parse(res.data.tags)
        })
    }
}

const submit = () => {
    proxy.$refs.formRef.validate(valid => {
        if (!valid) {
            ElMessage({ message: '请完善资料', type: 'warning' })
            return
        }
        if (route.query.id) { // 有id 进行编辑
            updateCourse({
                ...form,
                avatar: form.avatar[0]?.url,
                imgList: form.imgList.map(item => (item.url)).join(','),
                tags: JSON.stringify(form.tags),
                id: route.query.id
            }).then((res) => {
                if (res.code == 200) {
                    ElMessage({ message: '更新成功', type: 'success' })
                }
            })
        } else {
            addCourse({
                ...form,
                avatar: form.avatar[0]?.url || '',
                imgList: form.imgList.map(item => (item.url)).join(','),
                tags: JSON.stringify(form.tags)
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

.smbit-btn {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 72px;
    border-top: 1px dashed #d7d8db;
    background: #fff;
    padding: 0 0 0 20px;
}
</style>