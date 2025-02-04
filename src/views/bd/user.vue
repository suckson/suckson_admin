<template>
   <div class="app-container">
      <ProTable ref="proTable" :columns="columns" :request-api="listUser" :init-param="initParam">
         <template #nickName="scope">
            <el-avatar :size="40" :src="scope.row.avatar" />
         </template>
         <template #avatar="scope">
            <div class="user-info">
               <div class="avatar"></div>
               <div class="info">
                  <p>姓名: {{ scope.row.userName || '--' }}</p>
                  <p>昵称: {{ scope.row.nickName || '--' }}</p>
                  <p>电话: {{ scope.row.phonenumber || '--' }}</p>
               </div>
            </div>
         </template>
         <template #balance="scope">
            <span class="price">{{ scope.row.balance }}￥</span>
         </template>
         <template #bdLevel="scope">
            <dict-tag :options="bd_user_level" :value="scope.row.bdLevel" />
         </template>
         <template #bdPosition="scope">
            <dict-tag :options="bd_user_position" :value="scope.row.bdPosition" />
         </template>
         <template #vipExpiresTime>
            <router-link to="/bd/training/course_logs">
               <el-link :underline="false" type="primary">查看</el-link>
            </router-link>
         </template>
         <template #createTime="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
         </template>
         <template #operation="scope">
            <el-tooltip content="修改" placement="top">
               <el-button link type="primary" icon="Edit" @click="openBase('编辑', scope.row)">编辑</el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
               <el-button link type="primary" icon="Money" @click="open('编辑', {userId: scope.row.userId})">充值</el-button>
            </el-tooltip>
         </template>
      </ProTable>
      <FormModal
        ref="modalRef"
        style="width: 450px;"
        :formFields="formFields"
        :initialData="state.initData"
        :rules="rules"
        @submit="handleMoney"
      >
       </FormModal>
       <FormModal
        ref="modalBaseRef"
        style="width: 450px;"
        :formFields="formBaseFields"
        :initialData="state.initData"
        :rules="rules"
        @submit="handleBase"
      >
       </FormModal>
   </div>
</template>

<script setup name="User">
import { changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser } from "@api/system/user";
import { changeUserMoney } from "@api/bd";

const { proxy } = getCurrentInstance();
const { bd_user_position, bd_user_level } = proxy.useDict("bd_user_position", "bd_user_level");
import { ElMessage, ElMessageBox } from 'element-plus'

const proTable = ref()
const modalRef = ref()
const modalBaseRef = ref()

const rules = {
   bdUserLevel: [{ required: true, message: "羽球等级不能为空", trigger: "blur" }, { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
   bdUserPosition: [{ required: true, message: "羽球定位不能为空", trigger: "blur" }],
   type:  [{ required: true, message: "类型不能为空", trigger: "blur" }],
   num:  [{ required: true, message: "金额不能为空", trigger: "blur" }],
}

const state = reactive({
  initData: {
    type: 'add',
    num: 0.00,
    remark: '',
    bdPosition: '',
    bdLevel: ''
  }
})

const formFields = ref([
  { label: "充值类型", prop: "type", type: "radio-group", options: [{label: 'add', value: "add"},{label: 'sub', value: 'sub'} ]},
  { label: "金额", prop: "num", type: "input-number", bind: {type: 'number', style: 'width:100%;'}},
  { label: "备注",prop: "remark", type: "input", bind: {type: "textarea",style: 'width:100%;'}},
]);

const formBaseFields = ref([
  { label: "羽球等级", prop: "bdLevel", type: "select", bind: { style: 'width:100%;'}, options: bd_user_level},
  { label: "羽球定位",prop: "bdPosition", type: "select", bind: {style: 'width:100%;'}, options: bd_user_position},
]);
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});



const open = (type, row) => {
    modalRef.value.open(type, row);
  };
  const openBase = (type, row) => {
   modalBaseRef.value.open(type, row);
  };

const handleMoney = (data) => {
   changeUserMoney(data).then(res => {
      if(res.code == 200) {
         ElMessage.success('操作成功')
         modalRef.value.handleClose()
         proTable.value?.getTableList();
      }else{
         ElMessage.error(res.message || '操作失败')
      }
   })
}
const handleBase = (data) => {
   updateUser(data).then(res => {
      if(res.code == 200) {
         ElMessage.success('操作成功')
         modalBaseRef.value.handleClose()
         proTable.value?.getTableList();
      }else{
         ElMessage.error(res.message || '操作失败')
      }
   })
}


// 表格配置项
const columns = reactive([
   { type: "selection", fixed: "left", width: 70 },
   {
      prop: "nickName",
      label: "昵称",
      search: { el: 'input' },
   },
   {
      prop: "phonenumber",
      label: "电话",
      search: { el: 'input' },
      isShow:false
   },
   {
      prop: "avatar",
      label: "基本信息",
   },
   {
      prop: "balance",
      label: "会员余额",
   },
   {
      prop: "bdLevel",
      label: "等级",
   },
   {
      prop: "bdPosition",
      label: "定位",
   },
   {
      prop: "vipExpiresTime",
      label: "上课记录",
   },
   {
      prop: "vipExpiresTime",
      label: "报课信息",
   },
   {
      prop: "createTime",
      label: "创建时间",
   },
   { prop: "operation", label: "操作" },
]);



</script>
<style scoped>
.user-info {
   .info {
      p {
         padding: 0 0 0 0;
         margin: 2px 0 2px 0;
      }
   }
}
</style>