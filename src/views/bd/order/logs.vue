<template>
  <div class="app-container">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="listTransactionRecord"
      :init-param="initParam"
    >
    <template #occupySiteList="scope">
        <div v-for="item in scope.row.occupySiteList"> {{scope.row.reserveDate}} {{item.siteName+ item.occupyTime}}</div>
    </template>
    <template #reservePhone="scope">
          <div>{{scope.row.nickName}}<br/>{{scope.row.reservePhone}}</div>
    </template>
    
    <template #source="scope">
      <el-tag v-if="scope.row.source == 'site'" type="info">场地预定</el-tag>
      <el-tag v-if="scope.row.source == 'course'" type="danger">课程</el-tag>
      <el-tag v-if="scope.row.source == 'activity'" type="danger">活动</el-tag>
    </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button
          type="primary"
          link
        >-</el-button>
        <el-button v-if="['1'].includes(scope.row.status)"
          type="primary"
          link
        >取消订单</el-button>
      </template>
    </ProTable>
    <!-- 添加或修改订单对话框 -->
  </div>
</template>


<script name="Order" setup lang="tsx">
import { listTransactionRecord } from "@api/bd/order";
import { listUser } from "@api/system/user";

import {  reactive } from "vue";

const columns = reactive([
  {
    prop: "orderNo",
    label: "订单号",
    width: 250
  },
  {
    prop: "userId",
    label: "用户名",
    search: { el: "select", props:{placeholder: "请选择",  style:'width:80%;' }},
    enum: () => listUser({ pageSize: 1, pageNum: 100 }),
    fieldNames: { label: "nickName", value: "userId" },
    isShow: false,
  },
  {
    prop: "nickName",
    label: "用户",
  },
  {
    prop: "type",
    label: "交易类型",
    search: { el: "select", props:{placeholder: "请选择", style:'width:80%;' }},
    enum: [{label: '支出', value: 'out'},{label: '收入', value: 'in'}],
  },
  {
    prop: "source",
    label: "来源",
  },
  {
    prop: "remark",
    label: "备注",
    width: 250
  },
  {
    prop: "createBy",
    label: "创建人",
  },
  {
    prop: "createTime",
    label: "创建时间",
  },
]);

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)

</script>