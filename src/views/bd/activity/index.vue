<template>
    <div class="app-container">
      <ProTable ref="proTable" :columns="columns" :request-api="listActivity" :init-param="initParam">
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button link type="primary" icon="Edit" @click="router.push({path:'/bd/activity/edit',query: {id: scope.row.id}})" ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row, delActivity)"></el-button>
          </el-tooltip>
        </template>
        <template #cover="scope">
          <el-image style="width: 200px; height: 80px" :src="scope.row.cover" fit="contain"></el-image>
        </template>
        <template #status="scope">
          <div>{{ convertStatus(scope.row.status) }}</div>
        </template>
        <template #tags="scope">
          <tabs-form-item :tags="compTags(scope.row)" onlyShow> </tabs-form-item>
        </template>
        <template #tableHeader="scope">
          <el-button type="primary" plain :icon="CirclePlus"
          @click="router.push({path:'/bd/activity/edit'})">添加新活动</el-button>
        </template>
      </ProTable>
  
    </div>
  </template>
  
  <script name="Order" setup lang="tsx">
  
  import {
    CirclePlus,
  } from "@element-plus/icons-vue";
  import { ref, reactive, toRaw, nextTick, computed } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { listActivity, delActivity } from "@api/bd";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const proTable = ref(null)
  
  const initParam = reactive({});
  
  const state = reactive({
    initData: {
  
    }
  })
  
  
  const compTags = (row) => {
    return typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
  }
  
  const columns = reactive([
    {
      prop: "name",
      label: "活动名称",
      search: { el: "input",  },
    },
   {
      prop: "cover",
      label: "封面",
    }, 
    {
      prop: "status",
      label: "状态",
    }, 
    {
      prop: "personMax",
      label: "报名人数",
    },
    {
      prop: "price",
      label: "价格",
    },
    { prop: "operation", label: "操作" },
  ]);


  const convertStatus = (e) =>{
    if(e == 0) return '未开始'
    if(e == 1) return '进行中'
    return '已结束'
  }
  
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
      updateCoach({ ...formData, tags: JSON.stringify(formData.tags) }).then((response) => {
        ElMessage({
          message: "修改成功",
          type: "success",
        });
  
      });
    } else {
      addCoach({ ...formData, tags: JSON.stringify(formData.tags) }).then((response) => {
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

<style>
.el-table__empty-block {
  height: 200px !important;
}
</style>