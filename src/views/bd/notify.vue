<template>
  <div class="app-container">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="listNotice"
      :init-param="initParam"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button
          type="primary"
          plain
          :icon="CirclePlus"
          @click="openDrawer('新增', null)"
          >新增通告</el-button
        >
      </template>
      <template #url="scope">
        <el-image :src="scope.row.url" style="width: 170px; border-radius: 4px;" />
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button
          type="primary"
          link
          :icon="View"
          @click="openDrawer('查看', scope.row)"
        ></el-button>
        <el-button
          type="primary"
          link
          :icon="EditPen"
          @click="openDrawer('编辑', scope.row)"
        ></el-button>
        <el-button
          type="primary"
          link
          :icon="Delete"
          @click="deleteNotify(scope.row)"
        ></el-button>
      </template>
    </ProTable>
    <FormDrawer
      ref="drawerRef"
      :formFields="formFields"
      :initialData="state.initData"
      :rules="formRules"
      @submit="handleSubmit"
    />
  </div>
  <!-- 表单渲染 -->
</template>
<script setup lang="tsx">
import { ref, reactive, toRaw, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  CirclePlus,
  Delete,
  EditPen,
  View,
} from "@element-plus/icons-vue";

import { listNotice, delNotice, updateNotice, addNotice } from "@api/bd";

const deleteNotify = (row) => {
  ElMessageBox.confirm("是否确认删除该条数据？", "提示", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  }).then(() => {
    delNotice(row.id).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      proTable.value?.getTableList();
    });
  });
};
// ProTable 实例
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({  });

// 表格配置项
const columns = reactive([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "url",
    label: "banner",
  },
  {
    prop: "title",
    label: "标题",
    search: { el: "input", tooltip: "我是搜索提示" },
  },
  {
    prop: "linkUrl",
    label: "跳转连接",
  },
  { prop: "createTime", label: "添加时间" },
  { prop: "operation", label: "操作" },
]);



const formFields = ref([
  { label: "标题", prop: "title", type: "input", placeholder: "请输入标题" },
  { prop: "url", label: "封面", type: "image-upload", placeholder: "请输入标题", bind: {limit: 1}},
  { prop: "linkUrl",label: "链接",type: "input"},
  { label: "内容", prop: "content", type: "rich-text", placeholder: "请输入内容",},
]);

const formRules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
};

const state = reactive({
  initData: {

  }
})

const drawerRef = ref();

const openDrawer = (type, row) => {
  drawerRef.value.openDrawer(type, row);
};

const handleSubmit = (formData) => {
  if (formData.id != undefined) {
    updateNotice({...formData, url: formData?.url[0].url}).then((response) => {
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      proTable.value?.getTableList();
    });
  } else {
    addNotice({...formData, url: formData?.url[0].url || ''}).then((response) => {
      ElMessage({
        message: "新增成功",
        type: "success",
      });
      proTable.value?.getTableList();
    });
  }
  drawerRef.value.handleClose();
};

const resetInitData = () => {
  state.initData = {}
}
</script>
