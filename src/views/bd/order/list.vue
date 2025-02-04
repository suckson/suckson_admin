<template>
  <div class="app-container">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="listOrder"
      :init-param="initParam"
    >
    <template #occupySiteList="scope">
        <div v-for="item in scope.row.occupySiteList"> {{scope.row.reserveDate}} {{item.siteName+ item.occupyTime}}</div>
    </template>
    <template #reservePhone="scope">
          <div>{{scope.row.nickName}}<br/>{{scope.row.reservePhone}}</div>
    </template>
    
    <template #status="scope">
      <el-tag v-if="scope.row.status == -1" type="info">订单关闭</el-tag>
      <el-tag v-if="scope.row.status == 0" type="warning">待支付</el-tag>
      <el-tag v-if="scope.row.status == 1" type="success">支付成功</el-tag>
      <el-tag v-if="scope.row.status == 2" type="danger">支付失败</el-tag>
      <el-tag v-if="scope.row.status == 3" type="success">已完成</el-tag>
      <el-tag v-if="scope.row.status == 4" type="warning">退款中</el-tag>
      <el-tag v-if="scope.row.status == 5" type="success">退款成功</el-tag>
      <el-tag v-if="scope.row.status == 6" type="danger">退款失败</el-tag>
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
import { listOrder, getOrder } from "@api/bd/order";

import { ref, reactive } from "vue";

const initParam = reactive({ status: '', type: '',reserveDate: []});


const columns = reactive([
  {
    prop: "orderNo",
    label: "订单号",
    search: { el: "input", props: { placeholder: "输入订单号" }},
    fixed: 'left',
    width: 250
  },
  {
    prop: "reservePhone",
    label: "预定人手机",
    search: { el: "input", tooltip: "输入预定人手机号", props:{placeholder: "输入预定人手机号" }},
    fixed: 'left',
  
  },
  {
    prop: "reserveName",
    label: "预定人",
    search: { el: "input", tooltip: "输入预定人名称", props:{placeholder: "输入预定人名称" }},
    tooltip: "输入预定人名称",
    isShow: false,
  },
  {
    prop: "occupySiteList",
    label: "场地信息",
    width: 250
  },
  {
    prop: "shopName",
    label: "所属球馆",
  },
  {
    prop: "status",
    label: "订单状态",
  },
  {
    prop: "payTime",
    label: "支付时间",

  },
  { prop: "createTime", label: "添加时间",  width: 380},
  { prop: "operation", label: "操作",  width: 180, fixed: 'right' },
]);

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)

</script>