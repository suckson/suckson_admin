<template>
    <div class="info_main">
        <el-form ref="formRef" style="max-width: 1000px" size="large" :model="form" :rules="rules" label-width="auto"
            label-position="top">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="隐私协议" prop="value1">
                        <WangEditor style="width: 100%" v-model:value="form.value1" placeholder="课程详情"
                            height="400px" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="活动报名协议" prop="value2">
                        <WangEditor style="width: 100%" v-model:value="form.value2" placeholder="课程详情"
                            height="400px" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="关于我们" prop="value3">
                        <WangEditor style="width: 100%" v-model:value="form.value2" placeholder="课程详情"
                            height="400px" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="smbit-btn">
            <el-button @click="submit" type="primary" size="large">提交</el-button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElInput, avatarEmits } from 'element-plus'
import { objKeySetVal } from '@/utils/common'
import { getAgreement, updateAgreement } from '@api/bd'


const route = useRoute()

const router = useRouter()

const { proxy } = getCurrentInstance();



const form = reactive({
    value1: '',
    value2: '',
    value3: ''
})

const rules = reactive({
    value2: [{ required: true, message: "不能为空", trigger: "blur" }],
    value1: [{ required: true, message: "不能为空", trigger: "blur" }],
    value3: [{ required: true, message: "不能为空", trigger: "blur" }],
})

onMounted(() => {
    getDetail()
})




const getDetail = () => {
    getAgreement(1).then((res) => {
            form.value2 = res.data.value2
            form.value1 = res.data.value1
            form.value3 = res.data.value3
        })
}

const submit = () => {
    proxy.$refs.formRef.validate(valid => {
        if (!valid) {
            ElMessage({ message: '请完善资料', type: 'warning' })
            return
        }
        updateAgreement({
            ...form,
            id: 1
        }).then((res) => {
            if (res.code == 200) {
                ElMessage({ message: '更新成功', type: 'success' })
            }
        })
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