
<template>
  <div class="app-container">
     <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="auto">
      <el-form-item label="场馆:" prop="shopId">
        <el-select v-model="queryParams.shopId" placeholder="请输入场地名称" clearable @keyup.enter.native="handleQuery">
          <el-option v-for="item in listShopData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled" >{{item.name}}</el-option>
        </el-select>
      </el-form-item>
        <el-form-item>
           <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        </el-form-item>
     </el-form>

     <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
           <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
           >新增场地</el-button>
        </el-col>
        <el-col :span="1.5">
           <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:user:edit']"
           >修改</el-button>
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
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
     </el-row>
     <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" :selectable="selectableChange"/>
        <el-table-column label="场地名称" align="center" key="name" prop="name"  :show-overflow-tooltip="true" />
        <el-table-column label="所属场馆" align="center" key="shopName" prop="shopName"  :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
           <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
           </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
           <template #default="scope">
              <el-tooltip content="修改" placement="top" >
                 <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                 <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="分配时间段" placement="top">
                 <el-button link type="primary" icon="CircleCheck" @click="handleEditTime(scope.row)"></el-button>
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
     <!-- 添加或修改用户配置对话框 -->
     <el-dialog :title="title" v-model="open" width="460px" append-to-body>
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
         <el-form-item label="场地名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入场地名称" maxlength="30" style="width: 300px;" />
         </el-form-item>
         <el-form-item label="所属场馆" prop="shopId">
            <el-select v-model="form.shopId" placeholder="请选择所属场馆" style="width: 300px;">
                  <el-option v-for="item in listShopData" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled" >{{item.name}}</el-option>
            </el-select>
         </el-form-item>
        </el-form>
        <template #footer>
           <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
           </div>
        </template>
     </el-dialog>
     <datatimeAreaSetting  ref="datatimeArea" :requestHTTP="updateSite" :id="form.id" @close="reset()" @ok="getList()" />
  </div>
</template>
<script setup>


import { listSite, getSite, delSite, addSite, updateSite} from "@api/bd";
import { listShop,  delShop} from "@api/system/shop";
import datatimeAreaSetting from './components/datatime_area_setting.vue'
const { proxy } = getCurrentInstance();
const datatimeArea = ref(null)

const tableList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");


const listShopData = ref([])


const data = reactive({
 form: {},
 timeDataItemTitle: '添加时间段信息',
 queryParams: {
   pageNum: 1,
   pageSize: 10,
   shopId: 1,
   phonenumber: undefined,
   status: undefined,
 },
 rules: {
   name: [{ required: true, message: "名称不能为空", trigger: "blur" }, { min: 2, max: 20, message: "名称长度必须介于 2 和 20 之间", trigger: "blur" }],
   shopId: [{ required: true, message: "所属场馆不能为空", trigger: "blur" }],
 }
});

const { queryParams, form, rules} = toRefs(data);

/** 查询列表 */
function getList() {
 loading.value = true;
 listSite(proxy.addDateRange(queryParams.value)).then(res => {
   loading.value = false;
   tableList.value = res.rows;
   total.value = res.total;
 });
};

/** 查询列表 */
const getListShop = () => {
 listShop({pageSize:100, pageNum: 1}).then(res => {
    listShopData.value = res.rows || []
 });
};


/** 搜索按钮操作 */
function handleQuery() {
 queryParams.value.pageNum = 1;
 getList();
};

/** 删除按钮操作 */
function handleDelete(row) {
 const id = row.id || ids.value;
 proxy.$modal.confirm('是否确认删除编号为"' + id + '"的数据项？').then(function () {
   return delSite(id);
 }).then(() => {
   getList();
   proxy.$modal.msgSuccess("删除成功");
 }).catch(() => {});
};

/** 用户状态修改  */
function handleStatusChange(row) {
 let text = row.status === "0" ? "启用" : "停用";
 proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
   return changeUserStatus(row.userId, row.status);
 }).then(() => {
   proxy.$modal.msgSuccess(text + "成功");
 }).catch(function () {
   row.status = row.status === "0" ? "1" : "0";
 });
};
/** 配置数据是否能被选中 */
function selectableChange(row,index){
  if(row.userId === 1 && row.admin === true){
     return false
  }
  return true
};
/** 场地时间段设置 */
const handleEditTime = (row) => {
  form.value = row
  proxy.$refs.datatimeArea.open(JSON.parse(row.priceJson || "{}"));
};

/** 选择条数  */
function handleSelectionChange(selection) {
 ids.value = selection.map(item => item.userId);
 single.value = selection.length != 1;
 multiple.value = !selection.length;
};
/** 重置操作表单 */
function reset() {
 form.value = {
   id: undefined,
   name: ''
 };
 proxy.resetForm("userRef");
};
/** 取消按钮 */
function cancel() {
 open.value = false;
 reset();
};
/** 新增按钮操作 */
function handleAdd() {
 reset();
 open.value = true
};
/** 修改按钮操作 */
function handleUpdate(row) {
 reset();
 const userId = row.id || ids.value;
 getSite(userId).then(response => {
   form.value = response.data;
   open.value = true;
   title.value = "修改场地";
 });
};
/** 提交按钮 */
function submitForm() {
 proxy.$refs["formRef"].validate(valid => {
   if (valid) {
     if (form.value.id != undefined) {
       updateSite(form.value).then(response => {
         proxy.$modal.msgSuccess("修改成功");
         open.value = false;
         getList();
       });
     } else {
       addSite(form.value).then(response => {
         proxy.$modal.msgSuccess("新增成功");
         open.value = false;
         getList();
       });
     }
   }
 });
};

getListShop()
getList();

</script>
