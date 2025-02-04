
<template>
    <div class="app-container">
       <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="名称" prop="name">
             <el-input
                v-model="queryParams.name"
                placeholder="输入名称"
                clearable
                style="width: 240px"
             > </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
             <el-input
                v-model="queryParams.phone"
                placeholder="输入名称"
                clearable
                style="width: 240px"
             > </el-input>
          </el-form-item>
          <el-form-item>
             <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
             <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
       </el-form>
 
       <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
             <el-button
                type="primary"
                plain
                icon="Plus"
                @click="router.push({path:'/bd/edit/'})"
             >新增门店</el-button>
          </el-col>
          <el-col :span="1.5">
             <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
             >删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
       </el-row>
       <el-table v-loading="loading" :data="shopList"  @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" :selectable="selectableChange"/>
          <el-table-column label="门店头像" align="center" key="avatar" prop="avatar" >
            <template #default="scope">
               <el-image :src="scope.row.avatar" style="width: 75px;height: 75px; border-radius: 50%;" />
             </template>
          </el-table-column>
          <el-table-column label="门店名称" align="center" key="name" prop="name" />
          <el-table-column label="门店电话" align="center" key="phone" prop="phone" :show-overflow-tooltip="true" />
          <el-table-column label="营业时间" align="center" key="workTime" prop="workTime" :show-overflow-tooltip="true" />
          <el-table-column label="可预约天数" align="center" key="reserveDay" prop="reserveDay" :show-overflow-tooltip="true" />
          <el-table-column label="位置" align="center" prop="address"  width="300"/>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
             <template #default="scope">
                <el-tooltip content="修改" placement="top" >
                   <el-button link type="primary" icon="Edit" @click="router.push({path:'/bd/shop/edit',query: {id: scope.row.id}})" ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                   <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']"></el-button>
                </el-tooltip>
             </template>
          </el-table-column>
       </el-table>
       <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
       />
    </div>
 </template>
 <script setup>
 import { listShop,  delShop} from "@api/system/shop";
 const router = useRouter();
 const { proxy } = getCurrentInstance();
 
 const shopList = ref([]);
 const loading = ref(true);
 const showSearch = ref(true);
 const ids = ref([]);
 const single = ref(true);
 const multiple = ref(true);
 const total = ref(0);
 const dateRange = ref([]);


 /** 选择条数  */
 function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.userId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
 };

 const data = reactive({
   form: {},
   timeDataItemTitle: '添加时间段信息',
   queryParams: {
     pageNum: 1,
     pageSize: 10,
     name: undefined,
     phone: undefined,
   },

 });
 
 const { queryParams, form, rules, timeDataItemModel, timeDataItemRules, timeDataItemTitle} = toRefs(data);
 
 /** 查询列表 */
 function getList() {
   loading.value = true;
   listShop(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
     loading.value = false;
     shopList.value = res.rows;
     total.value = res.total;
   });
 }

 /** 搜索按钮操作 */
 function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
 }
 /** 重置按钮操作 */
 function resetQuery() {
   dateRange.value = [];
   proxy.resetForm("queryRef");
   handleQuery();
 }

 /** 删除按钮操作 */
 function handleDelete(row) {
   const userIds = row.userId || ids.value;
   proxy.$modal.confirm('是否确认删除编号为"' + userIds + '"的数据项？').then(function () {
     return delShop(userIds);
   }).then(() => {
     getList();
     proxy.$modal.msgSuccess("删除成功");
   }).catch(() => {});
 }

 getList();
 </script>
 