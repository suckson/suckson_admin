<template>
  <div class="app-container">
    <ProTable ref="proTable" :columns="columns" :request-api="listCourseLogs" :init-param="initParam">
      <!-- 表格操作 -->
      <template #status="scope">
        <el-tag v-if="scope.row.status==0" type="primary"> 未核销</el-tag>
        <el-tag v-if="scope.row.status==1" type="success"> 已核销</el-tag>
      </template>
      <template #operation="scope">
        <el-tooltip content="添加上课备注" placement="top">
          <el-button link type="primary" icon="Edit" @click="" ></el-button>
        </el-tooltip>
      </template>
      <template #avatar="scope">
        <el-image style="width: 200px; height: 45px" :src="scope.row.avatar" fit="contain"></el-image>
      </template>
      <template #tags="scope">
        <tabs-form-item :tags="compTags(scope.row)" onlyShow> </tabs-form-item>
      </template>
    </ProTable>

  </div>
</template>

<script name="Order" setup lang="tsx">

import {
  CirclePlus,
} from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { listCourseLogs, listCourse } from "@api/bd";
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
    prop: "courseIngTime",
    label: "上课时间",
  
  },
  {
    prop: "userName",
    label: "学员名称",
    search: { el: "input",  },
  },
  {
    prop: "time",
    label: "授课时间",
  },
  {
    prop: "courseId",
    label: "所属课程",
    search: { el: "select",  },
    enum: () => listCourse({ pageSize: 1, pageNum: 100 }),
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "coachName",
    label: "授课教练",
    search: { el: "select",  },
    enum: () => listCourse({ pageSize: 1, pageNum: 100 }),
    fieldNames: { label: "name", value: "id" }
  },
  {
    prop: "status",
    label: "状态",
    search: { el: "select", style: "width:100%;"  },
    enum: [{label: '已核销', value: '1'},{label: '未核销', value: '0'}],
  },
  {
    prop: "remark",
    label: "上课备注",
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