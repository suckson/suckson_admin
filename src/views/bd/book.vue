<template>
  <el-row class="app-container">
    <el-col :span="18" class="order-left-content">
      <div class="flex gap-2 margin-vertical-2">
        <el-select v-model="queryParams.shopId" placeholder="请输入场地名称">
          <el-option v-for="item in listShopData" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.disabled">{{ item.name }}</el-option>
        </el-select>
        <el-tag v-for="item in legends" :key="item.name" :type="item.type"
          :class="[item.type === 'pink' ? 'el-tag-pink' : '']" effect="dark" size="large">
          {{ item.name }}
        </el-tag>
        <el-check-tag>可预定</el-check-tag>
        <el-check-tag checked>已选择</el-check-tag>
      </div>
      <div class="left-main">
        <el-radio-group v-model="queryParams.occupyDate">
          <el-radio-button v-for="item in selectDate" :label="item.long" :value="item.long"></el-radio-button>
        </el-radio-group>
        <el-table class="my_table" header-align="center" :data="tableData" style="width: 100%">
          <el-table-column fixed prop="time" header-align="center" align="center" label="时间" width="120">
          </el-table-column>
          <el-table-column v-for="(column, index) in colNames" :label="column" :key="index"
            :highlight-current-row="true" header-align="center" width="130">
            <template #default="scope">
              <div class="table-item">
                <el-check-tag v-if="scope.row[column].status" type="success" class="el-check-box"
                  :checked="scope.row[column].checked" @change="onTagChange(scope.row[column], scope.row)">{{
                    formatPrice(scope.row[column].price)}}</el-check-tag>
                <el-tag v-else-if="scope.row[column].type == 3" class="el-check-box" type="info" disabled effect="dark"
                  size="large">
                  不可预定
                </el-tag>
                <el-tag v-else-if="scope.row[column].type == 1" class="el-check-box" closable
                  @close="() => handleCancel(scope.row, scope.row[column])" disabled type="warning" effect="dark"
                  size="large">
                  已锁场
                </el-tag>
                <el-tooltip v-else-if="scope.row[column].type == 0" :content="scope.row[column].userPhone || ''"
                  class="item">
                  <el-tag class="el-check-box" closable disabled  @close="() => handleCancel(scope.row, scope.row[column])" 
                    :class="[scope.row[column].type == 0 ? 'el-tag-pink' : '']" effect="dark" size="large">
                    小程序
                  </el-tag>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
    <el-col :span="6" v-if="showSeletSiteDrawer" class="order-right-content">
      <h3 class="order-right-content-header">后台锁场 <p>(请选择你需要锁定的场地)</p>
      </h3>
      <div class="order-right-content-container">
        <el-alert :title="`${item.occupyDate}${item.siteName}`" type="info" style="width: 100%;" :closable="false"
          v-for="item in seletSite">
          <p class="order-right-content-container-p"><span>{{ item.time }}</span> <span>{{ item.price + '￥' }}</span></p>
        </el-alert>
      </div>
      <div>
        <div class="order-right-content-footer" style="flex: auto">
          <span>{{ plusOne }}</span> <el-button type="primary" @click="submit">后台锁场</el-button>
        </div>
      </div>
    </el-col>
  </el-row>

</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { FormInstance, FormRules, ElMessage, ElMessageBox } from 'element-plus'
import { listSiteInfo, listShop, addOrderReserve, cancelOrderReserve } from "@api/bd"

const listShopData = ref<any>([])


const showSeletSiteDrawer = ref(false)

/** 查询列表 */
const getListShop = () => {
  listShop({ pageSize: 100, pageNum: 1 }).then(res => {
    listShopData.value = res.rows || []
  });
};

const queryParams = reactive({
  shopId: 1,
  occupyDate: dayjs().format('YYYY-MM-DD'),
})

const colNames = ref<any>([])

const tableData = ref<any>([])

const seletSite = ref<any>([])

const selectDate = computed(() => {
  const allday = listShopData.value.find(i => i?.id === queryParams.shopId)?.reserveDay || 7
  let today = dayjs()
  let result: Array<any> = []
  for (let i = 0; i < allday; i++) {
    let futureDate = today.add(i, 'day')
    result.push({
      short: futureDate.format('MM-DD'),
      long: futureDate.format('YYYY-MM-DD')
    })
  }
  return result
})//选择的日期

const legends = [
  { name: '已预定', type: 'pink' },
  { name: '已锁场', type: 'warning' },
]

const ruleFormRef = ref<FormInstance>()

let form = reactive({
  name: '',
  phone: '',
  remark: '',
})


const rules = reactive({
  name: [
    { required: true, message: '请输入预定人姓名', trigger: 'blur' },
    { min: 1, max: 15, message: '最长输入15个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { min: 11, max: 11, message: '电话格式不正确', trigger: 'blur' },
  ],
})

// 获取未来七天日期
const initSevenDays = () => {

}

onMounted(() => {
  seletSite.value = []
  initSevenDays()
  getListShop()
})

const plusOne = computed(() => {
  let num = 0
  seletSite.value.forEach(item => {
    num = num + item.price
  })
  return '￥' + num.toFixed(2);
})

const handleCancel = (item, column) => {
  ElMessageBox.confirm(' 确认要取消预定吗', '请确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(({ value }) => {
      cancelOrderReserve({
        shopId: queryParams.shopId,
        occupyDate: queryParams.occupyDate,
        siteId: column.siteId,
        timeLabel: item.time,
        remark: value,
        refundPrice: column.price
      }).then(res => {
        if (res.code == 200) {
        ElMessage.success('预定成功')
        updateData()
      }
      })
    })
}


const onTagChange = (item: any, row, scope) => {
  item.checked = !item.checked
  if (item.checked) {
    seletSite.value.push({ ...item, time: row.time, siteId: item.siteId, occupyDate: queryParams.occupyDate })
  } else {
    seletSite.value.splice(seletSite.value.indexOf(item), 1)
  }
}

// 刷新数据
const updateData = () => {
  const timesValue = {}
  tableData.value = []
  colNames.value = []
  seletSite.value = []
  listSiteInfo(queryParams).then((res) => {
    // 数据清空
    (res.data || []).forEach(element => {
      colNames.value = [...colNames.value, element.siteName];
      (Object.keys(element?.price) || []).forEach(item => {
        console.log(element?.price[item].phone);

        timesValue[item] = {
          ...timesValue[item],
          [element.siteName]: {
            siteName: element.siteName,
            siteId: element.siteId,
            price: element?.price[item].price,
            status: element?.price[item].status,
            type: element?.price[item].type,
            userPhone: element?.price[item].userPhone
          }
        }
      })
    })
    //  console.log(timesValue);
    // 拼装 tableDate
    tableData.value = Object.keys(timesValue).map(item => {
      return {
        time: item,
        siteId: timesValue[item],
        ...timesValue[item]
      }
    })
  })
}


watch(() => queryParams, (val) => {
  updateData()
  seletSite.value = []
}, { deep: true, immediate: true })


// 价格格式化
const formatPrice = (price: number) => {
  return '￥' + (price).toFixed(2)
}



watch(seletSite, (newValue) => {
  console.log(
    newValue
  );
  if (newValue.length > 0) {
    showSeletSiteDrawer.value = true
  } else {
    showSeletSiteDrawer.value = false
  }
}, { deep: true, immediate: true })

const submit = async () => {
  addOrderReserve({
    shopId: queryParams.shopId,
    occupyDate: queryParams.occupyDate,
    isPay: '0',
    occupyTimes: seletSite.value.map(item => {
      return ({ siteId: item.siteId, timeLabel: item.time })
    })

  }).then(res => {
    if (res.code == 200) {
      ElMessage.success('预定成功')
      updateData()
    }
  })
}
</script>

<style lang="scss" scoped>
.order-left-content {
  .el-tag-pink {
    background: #ff7e95;
    border: 1px solid #ff7e95;
  }
}

.order-right-content {
  position: relative;
  max-height: 85vh;

  .order-right-content-header {
    padding: 10px 8px 0px 8px;
    color: #0086ff;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin: 0;

    p {
      color: #909399;
      font-size: 12px;
      font-weight: 400;
      margin-left: 4px;
    }
  }

  flex-direction: column;
  background: #f5f5f5;
  color: #000;
  border: 1px solid #409EFF;
  border-radius: 10px;

  .order-right-content-container {
    padding: 0px 8px 0px 8px;
    overflow-y: auto;

    .order-right-content-container-p {
      margin: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span:nth-child(1) {
        font-size: 14px;
      }

      span:nth-child(2) {
        font-size: 18px;
        float: right;
        color: #ff3131;
      }
    }

    max-height: calc(85vh - 95px);

    .el-alert {
      margin: 15px 0px;
      border-color: #409EFF;
      background: #d6e5ff;
    }
  }

  .order-right-content-footer {
    border-top: 1px solid #d6e5ff;
    padding: 10px 20px 0px 20px;
    position: absolute;
    width: 100%;
    height: 52px;
    bottom: 0;
    left: 0;

    span {
      color: #ff3131;
      font-size: 24px;
    }

    button {
      float: right;
    }
  }
}

.el-check-box {
  width: 90px;
  height: 48px;
  line-height: 35px;
  text-align: center;
}

:deep(.el-table__body-wrapper) {
  user-select: none !important;
}

:deep(.el-check-tag) {
  transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
}

.left-main {
  margin: 10px 0px;

  .my_table {
    padding: 10px 0;
    --el-table-border-color: '#FFFFFF' !important;
    --el-table-row-hover-bg-color: #fff;
    height: calc(100vh - 220px);
  }

  .table-item {
    display: flex;
    justify-content: center;
  }
}

:deep(.el-table) {
  .cell {
    padding: 0 !important;
  }
}

:deep(.el-alert__content) {
  width: 100%;
}

.book_info {
  background-color: #f6f6f6;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  height: calc(100vh - 110px);

  .book_site_list {
    overflow-y: auto;
    flex-grow: 1;

    .book-site-box {
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      background-color: #eff3ff;
      line-height: 2rem;
      margin-bottom: 10px;
    }
  }

  .book_total {
    margin-top: auto;
    padding: 10px;
  }
}

.flex_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>