<template>
    <div class="container">
      <div class="store_box">
        <el-avatar
          class="hidden-xs-only"
          shape="square"
          :size="120"
          :src="store.avatar"
        />
        <div class="store_head_main">
          <p class="store_name">
            {{ store.name }}
            <el-tag>运营中</el-tag>
          </p>
          <p class="store_tips">已使用浙教羽毛球馆平台运营{{ serverDay }}天</p>
          <div class="business_grid">
            <el-row :gutter="20">
              <el-col
                :sm="8"
                :xs="24"
                v-for="(item, index) in testData1"
                :key="index"
                ><div class="grid_card">
                  <div class="flex-box-space-between">
                    <div>{{ item.text }}</div>
                    <div>{{ item.value }}</div>
                  </div>
                </div></el-col
              >
            </el-row>
          </div>
        </div>
      </div>
  
      <div class="business_main">
        <el-row :gutter="40" class="bottom-gap">
          <el-col :sm="16" :xs="24">
            <div class="order_box">
              <p class="flex-box-space-between">
                <span>今日订单</span>
                <el-button link type="primary" @click="toOrder()"
                  >查看更多</el-button
                >
              </p>
              <el-table :data="tableData" style="width: 100%; height: 320px">
                <el-table-column type="expand">
                  <template #default="props">
                    <div class="order_detail">
                      <p>场地预约明细</p>
                      <el-table
                        :data="getSiteData(props.row)"
                        style="width: 100%"
                      >
                        <el-table-column type="index" width="50" />
                        <el-table-column label="场地" width="150">
                          <template #default="scope">
                            <span>{{ scope.row.name }}</span>
                          </template>
                        </el-table-column>
  
                        <el-table-column label="时间">
                          <template #default="scope">
                            <span>{{ scope.row.time }}</span>
                          </template>
                        </el-table-column>
  
                        <el-table-column label="价格" width="180">
                          <template #default="scope">
                            <span
                              >￥{{ (scope.row.price / 100).toFixed(2) }}</span
                            >
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="reserve_name" label="预定人" />
                <el-table-column prop="reserve_phone" label="手机号" />
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag
                      size="small"
                      :type="statusEnum[scope.row.status]?.type"
                      >{{ statusEnum[scope.row.status]?.text }}</el-tag
                    >
                  </template>
                </el-table-column>
  
                <el-table-column prop="remark" label="备注" />
              </el-table>
            </div>
          </el-col>
          <el-col :sm="8" :xs="0">
            <div class="business_chart">
              <OrderChart :data="siteMoney"></OrderChart></div
          ></el-col>
        </el-row>
  
        <el-row :gutter="40">
          <el-col :sm="24" :xs="24">
            <div class="site_box">
              <p class="flex-box-space-between">
                <span>当前场地使用情况</span>
                <el-button link type="primary" @click="toBook()"
                  >去预定</el-button
                >
              </p>
              <div class="site_info">
                <div class="site_use_box" v-for="item in sites">
                  <p class="flex-box-space-between">
                    <span>{{ item.site_name }}</span>
                    <el-tag size="small" effect="dark">{{ item.status }}</el-tag>
                  </p>
                  <el-image
                    style="width: 100px; height: 50px"
                    :src="getImage(item.status)"
                    fit="contain"
                  />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { onBeforeMount, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import OrderChart from './chart/orderChart.vue'
  // import { getOperationalData, getShopDetail } from '@api/shop'
  // import { getOrderList } from '@api/order'
  // import { useEnumStore, statusEnum } from '@stores/enum.ts'
  import dayjs from 'dayjs'
  // import { GetImage } from '@/utils/image'
  
  const router = useRouter()
  
  const siteMoney = ref([])
  const siteCount = ref([])
  const lineCount = ref([] as any)
  const store = ref({ name: '', avatar: '' })
  const serverDay = ref(0)
  const testData1 = ref([
    { text: '今日营业额', value: '' },
    { text: '今日订单数', value: 0 },
    { text: '今日场地使用场次', value: '' },
  ])
  
  const sites = ref<any>([])
  
  const tableData = ref<any>([])
  
  onBeforeMount(() => {

  })
  
  const getImage = (status: string) => {

  }
  
  const getApiOrderList = async () => {
  
  }
  
  const getSiteData = (order: any) => {
    let tableData = []
    return tableData
  }
  
  
  const toOrder = () => {
    router.push('order')
  }
  
  const toBook = () => {
    router.push('book')
  }
  </script>
  
  <style scoped>
  .container {
    margin: 20px;
    .store_box {
      border-radius: 12px;
      background-color: #f8f8ff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      .store_head_main {
        margin: 0 20px;
        width: 85%;
        .store_name {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        .store_tips {
          font-size: 14px;
          line-height: 30px;
        }
      }
    }
  
    .business_main {
      margin: 20px 0;
      .order_box {
        border-radius: 12px;
        background-color: #f8f8ff;
        padding: 20px;
        height: 400px;
        overflow-y: auto;
        p {
          margin-top: 0;
        }
      }
      .site_box {
        border-radius: 12px;
        background-color: #f8f8ff;
        padding: 20px;
        p {
          margin-top: 0;
        }
        .site_info {
          /* height: 120px; */
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 20px;
          .site_use_box {
            font-size: 13px;
            width: 140px;
            text-align: center;
            background-color: #fff;
            padding: 10px 20px;
            border-radius: 10px;
          }
        }
      }
    }
  
    .business_grid {
      border-radius: 12px;
      font-size: 14px;
      .grid_card {
        font-size: 14px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px;
        gap: 8px;
        flex-grow: 1;
        align-self: stretch;
        background: #ffffff;
      }
    }
  
    .business_chart {
      margin-top: 10px;
  
      border-radius: 6px;
      background-color: #fff;
      width: 100%;
      height: 360px;
    }
  
    .business_chart2 {
      background-color: #f6f8fa;
      margin-top: 10px;
      /* border-radius: 6px; */
      width: 100%;
      height: 400px;
    }
  }
  </style>