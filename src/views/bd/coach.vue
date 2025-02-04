<template>
  <div class="app-container">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="listCoach"
      :init-param="initParam"
    >
      <!-- 表格操作 -->
      <template #operation="scope">
              <el-tooltip content="编辑" placement="top" >
                 <el-button link type="primary" icon="Edit" @click="() => openDrawer('编辑', scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                 <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row, delCoach)"></el-button>
              </el-tooltip>
      </template>
      <template #coachAvatar="scope">
            <div class="flex" style="align-items: center; justify-content: center;">
              <el-avatar :size="50" :src="scope.row.coachAvatar" />
            </div>
      </template>
      <template #coachName="scope">
            <div class="flex" style="align-items: center; justify-content: center;">
              <span style="margin-left: 12px;">{{ scope.row.coachName }}</span>
            </div>
      </template>
      
      <template #tags="scope">
         <tabs-form-item :tags="compTags(scope.row)" onlyShow> </tabs-form-item>
      </template>
      <template #tableHeader="scope">
        <el-button type="primary" plain :icon="CirclePlus" @click="() => drawerRef.openDrawer('新增', null)">新增教练</el-button>
      </template>
    </ProTable>
    <FormDrawer
      ref="drawerRef"
      :formFields="formFields"
      :initialData="state.initData"
      :rules="formRules"
      @submit="handleSubmit"
      :formStyle="{display:'flex', flexWrap: 'wrap', justifyContent:'space-between'}"
    />
  </div>
</template>

<script name="Order" setup lang="tsx">

import { listCoach, updateCoach, addCoach, delCoach } from "@api/bd";
import {
  CirclePlus,
} from "@element-plus/icons-vue";
import { ref, reactive, toRaw, nextTick, computed } from "vue";
import { listShop,  delShop} from "@api/system/shop";
import { listUser } from "@api/system/user";
import { ElMessage, ElMessageBox } from "element-plus";

const proTable = ref(null)

const initParam = reactive({});

const state = reactive({
  initData: {

  }
})

const drawerRef = ref();

const compTags = (row) => {
  return typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
}

const formFields = ref([
{ label: "头像",  prop: "coachAvatar",type: "image-upload",bind: {limit: 1}, placeholder: "请输入标题", itemStyle: {width: "80%"}, }, 
{ label: "名称",  prop: "coachName",  type: "input", placeholder: "请输入标题", itemStyle: {width: "30%"},event: {}},
{ label: "所属球馆",  prop: "shopId",  type: "select", placeholder: "请输入标题", bind: {options: []}, itemStyle: {width: "30%"},event: {
    focus: () => {
      listShop({pageSize: 100,pageNum: 1}).then(res => {
        formFields.value[2].bind.options = res.rows.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      })
    }
  }},
  { label: "关联用户",  prop: "userId",  type: "select", placeholder: "请输入标题",itemStyle: {width: "30%"} , bind: {option:[]},
  event: {
    focus: () => {
      listUser({pageSize: 100,pageNum: 1}).then(res => {
        formFields.value[3].bind.options = res.rows.map(item => {
          return {
            label: item.userName,
            value: item.userId
          }
        })
      })
    }
  }
},
  { label: "标签", itemStyle: {width: "100%"},  prop: "tags",  type: "tabs", placeholder: "请输入标题", bind: {limit: 1}},
  { label: "详情", prop: "content", type: "rich-text", placeholder: "请输入内容",},
]);

const formRules = {
  coachName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  coachAvatar: [{ required: true, message: "头像必须上传", trigger: "blur" }],
};


const columns = reactive([
{
    prop: "coachAvatar",
    label: "首图",
    search: { el: "input" },
    align: 'center',
  },
  {
    prop: "coachName",
    label: "姓名",
    search: { el: "input" },
    align: 'center',
  },
  {
    prop: "userPhone",
    label: "手机号",
  },
  {
    prop: "shopName",
    label: "所属球馆",
  },
  {
    prop: "tags",
    label: "标签",
    algin: "center"
  },
  { prop: "operation", label: "操作" },
]);


const openDrawer = (type, row) => {
  const { tags } = row
  if(typeof tags === 'string') {
    row.tags = JSON.parse(row.tags)
  }else{
    row.tags = row.tags
  }
  drawerRef.value.openDrawer(type, row);
};

const handleDelete = (row, api) => {
  ElMessageBox.confirm("是否确认删除该条数据？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    api(row.id).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      proTable.value?.getTableList();
    });
  });
};
    
const handleSubmit = (formData) => {
  if (formData.id != undefined) {
    updateCoach({...formData, tags:JSON.stringify(formData.tags), coachAvatar: typeof formData.coachAvatar !== 'string' ? formData.coachAvatar[0].url : formData.coachAvatar  }).then((response) => {
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    });
  } else {
    addCoach({...formData, tags: JSON.stringify(formData.tags), coachAvatar: typeof formData.coachAvatar !== 'string' ? formData.coachAvatar[0].url : formData.coachAvatar}).then((response) => {
      ElMessage({
        message: "新增成功",
        type: "success",
      });
    });
  }
  proTable.value?.getTableList();
  drawerRef.value.handleClose();
};

</script>