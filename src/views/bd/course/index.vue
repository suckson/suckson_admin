<template>
  <div class="app-container">
    <ProTable ref="proTable" :columns="columns" :request-api="listCourse" :init-param="initParam">
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-tooltip content="编辑" placement="top">
          <el-button link type="primary" icon="Edit" @click="router.push({path:'/bd/training/course/edit',query: {id: scope.row.id}})" ></el-button>
          
        </el-tooltip>
        <el-tooltip content="删除" placement="top">
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row, delCourse)"></el-button>
        </el-tooltip>
      </template>
      <template #coachName="scope">
          <el-tooltip content="查看预约记录" placement="top">
            <div link type="primary"  >{{scope.row?.ballUserCoachVo?.coachName || '-'}}</div>
          </el-tooltip>
      </template>
      <template #avatar="scope">
        <el-image style="width: 200px; height: 45px" :src="scope.row.avatar" fit="contain"></el-image>
      </template>
      <template #tags="scope">
        <tabs-form-item :tags="compTags(scope.row)" onlyShow> </tabs-form-item>
      </template>
      <template #tableHeader="scope">
        <el-button type="primary" plain :icon="CirclePlus"
        @click="router.push({path:'/bd/training/course/edit'})">添加新课程</el-button>
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
import { listCourse, updateCourse, addCourse, delCourse } from "@api/bd";
import { listCoach, listShop } from "@api/bd";
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
    prop: "avatar",
    label: "首图",
  },
  {
    prop: "name",
    label: "课程名字",
    search: {el: 'input'}
  },
  {
    prop: "shopId",
    label: "所属球馆",
    search: { el: "select",  },
    enum: () => listShop({ pageSize: 1, pageNum: 100 }),
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "coachName",
    label: "所属教练",
  },
  {
    prop: "tags",
    label: "标签",
  }, {
    prop: "price",
    label: "价格",
  },
  , {
    prop: "includeTime",
    label: "包含课时",
  },
  { prop: "operation", label: "操作" },
]);



const openDrawer = (type, row) => {
  const { tags } = row
  if (typeof tags === 'string') {
    row.tags = JSON.parse(row.tags)
  } else {
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