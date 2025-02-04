<template>
    <div class="app-container">
      <ProTable ref="proTable" :columns="columns" :request-api="listCourseUser" :init-param="initParam">
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-tooltip content="查看预约记录" placement="top">
            <el-button link type="primary" icon="View" @click="openMyCourseLog(scope.row)" ></el-button>
          </el-tooltip>
        </template>
        <template #tableHeader="scope">
        <el-button type="primary" plain :icon="CirclePlus"
        @click="open('新增', null)">新建预约</el-button>
      </template>
      </ProTable>
      <FormModal
        ref="modalRef"
        style="width: 450px;"
        :formFields="formFields"
        :initialData="state.initData"
        :rules="formRules"
          @submit="handleSubmit"
      >
       </FormModal>
    <FormDrawer
      ref="drawerRef"
    >
    <template #table>
            <ProTable ref="proTableDrawer" :columns="columnsLogs" :request-api="listCourseLogs" :init-param="state.courseLogsParams">
              <!-- 表格操作 -->
              <template #status="scope">
              <el-tag v-if="scope.row.status==0" type="primary"> 未核销</el-tag>
              <el-tag v-if="scope.row.status==1" type="success"> 已核销</el-tag>
            </template>
            </ProTable>
          </template>
      </FormDrawer>
    </div>
  </template>
  
  <script name="Order" setup lang="tsx">
  
  import {
    CirclePlus,
  } from "@element-plus/icons-vue";
  import { ref, reactive } from "vue";
  import { listCourseUser, creatCourseLogs,listCourseLogs } from "@api/bd";
  import { ElMessage, ElMessageBox } from "element-plus";

  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const proTable = ref(null)
  
  const initParam = reactive({});

  const modalRef = ref();
  const drawerRef = ref();
  const proTableDrawer = ref();

  const state = reactive({
  initData: {
    time: 1.5,
    courseIngTime: new Date(),
    courseUserId: ''
  },
  courseLogsParams: {
    courseUserId: ''
  }
})


const formRules = {
  courseUserId: [{ required: true, message: "请选择所属课程", trigger: "blur", }],
  time: [{ required: true, message: "耗费课程", trigger: "blur" }],
  courseIngTime: [{ required: true, message: "选择课程预约时间", trigger: "blur" }]
};
  
const formFields = ref([
  { label: "所属课程", prop: "courseUserId", type: "select", placeholder: "请选择可预约的课程", options: [], event: {
    focus: () => {
       listCourseUser({ pageSize: 1, pageNum: 100 }).then(res => {
        formFields.value[0].options = (res.rows || []).map(item => {
          return {
            value: item.id,
            label: item.userName + '的' +item.courseName,
          }
        })
       })
    }
  } },
  { label: "授课时长", prop: "time", type: "input-number", bind: {type: 'number', style: 'width:100%;'}},
  { prop: "courseIngTime", label: "上课时间",type: "date-picker", bind: {type: "datetime",style: 'width:100%;', defaultTime: new Date(2000, 1, 1, 12, 0, 0)}},
]);

  const columns = reactive([
  {
      prop: "createTime",
      label: "报课时间",
    },
    {
      prop: "userName",
      label: "学员名称",
    },
    {
      prop: "courseName",
      label: "课程名称",
    },
    {
      prop: "shopName",
      label: "所属球馆",
    },
    {
      prop: "coachName",
      label: "授课教练",
      search: { el: "input",  },
    },
    {
      prop: "price",
      label: "成交价格",
    },
    {
      prop: "includeTime",
      label: "总课时",
    },
    {
      prop: "restTime",
      label: "已消耗课时",
    },
    { prop: "operation", label: "操作" },
  ]);

  const columnsLogs = reactive([
  {
    prop: "courseIngTime",
    label: "预约时间",
  },

  {
    prop: "coachName",
    label: "授课教练",
  },
  {
    prop: "userName",
    label: "学员名称",
  },
  {
    prop: "time",
    label: "授课时间",
  },
  {
    prop: "status",
    label: "状态",
  },
  {
    prop: "remark",
    label: "上课备注",
  }])
  
  const open = (type, row) => {
    modalRef.value.open(type, row);
  };

  const openMyCourseLog = (row  ) => {
    state.courseLogsParams.courseUserId = row.id
    drawerRef.value.openDrawer('查看预约记录', null)
  }
  
  const handleSubmit = (formData) => {
    creatCourseLogs({...formData || ''}).then((response) => {
    ElMessageBox.confirm(
    '是否要查看预约?',
    '新建预约成功',
    {
      confirmButtonText: '去查看',
      cancelButtonText: '取消',
      type: 'Success',
    }
    ).then(() => {
      router.push({path:'/bd/training/course_logs'})
    })
    .catch(() => {
      modalRef.value.handleClose();
    })
    modalRef.value.handleClose();
    proTable.value?.getTableList();
    });
};

  
  </script>