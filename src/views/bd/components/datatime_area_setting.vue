<template>
         <el-drawer direction="rtl"  title="分配场地时间段" size="50%" v-model="timeDataVisible">
         <div>
         <el-radio-group v-model="chooseDataValue" @change="handleGroupChange" style="margin:0 0 20px 0 ;">
               <el-radio-button v-for="item in dataChoose" :label="item.value" :value="item.value">{{item.name}}</el-radio-button>
         </el-radio-group>
         <el-table :data="dataSource[`${chooseDataValue}`]" size="small"  :pagination="false">
            <el-table-column property="startTime" label="开始时间" width="150" >
                <template #default="scope">
                    <el-time-select size="mini"  v-if="dataSource[chooseDataValue][scope.$index].isEdit" v-model="dataSource[chooseDataValue][scope.$index].startTime" start="00:00"  step="01:00" end="24:00" placeholder="选择时间"/>
                    <span v-else="">{{dataSource[chooseDataValue][scope.$index].startTime}}</span>
                </template>
            </el-table-column>
            <el-table-column property="endTime" label="结束时间" width="200">
                <template #default="scope">
                    <el-time-select  size="mini"  v-if="dataSource[chooseDataValue][scope.$index].isEdit" v-model="dataSource[chooseDataValue][scope.$index].endTime" start="00:00"  step="01:00" end="24:00" placeholder="选择时间"/>
                    <span v-else="">{{dataSource[chooseDataValue][scope.$index].endTime}}</span>
                </template>
            </el-table-column>
            <el-table-column property="price" label="单价" align="center" >
                <template #default="scope">
                    <el-input-number size="mini" v-if="dataSource[chooseDataValue][scope.$index].isEdit" v-model="dataSource[chooseDataValue][scope.$index].price" :min="1" :max="150" style="width: 120px;"  />
                    <span v-else="">{{dataSource[chooseDataValue][scope.$index].price }}</span>
                </template>
            </el-table-column>
            <el-table-column property="isLook" label="锁场" align="center" >
                <template #default="scope">
                    <el-switch  size="mini"  v-if="dataSource[chooseDataValue][scope.$index].isEdit" v-model="dataSource[chooseDataValue][scope.$index].isLook"/>
                    <span v-else="">{{dataSource[chooseDataValue][scope.$index].isLook ? '是' : '否'}}</span>
                </template>
            </el-table-column>
    
            <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
               <template #default="scope">
                <el-tooltip content="保存" placement="top" v-if="scope.row.isEdit">
                     <el-button link type="primary" icon="CircleCheck" @click="handleEdit(scope.row, scope)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="修改" placement="top" v-else>
                     <el-button link type="primary" icon="Edit" @click="handleEdit(scope.row, scope)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                     <el-button link type="primary" icon="Delete" @click="handleDel(scope.row, scope)" ></el-button>
                  </el-tooltip>
               </template>
            </el-table-column>
	   	</el-table>
         <div style="text-align: center;"><el-button type="primary"   style="width: 90%; margin: 8px auto;" plain icon="Plus" @click="handleAddTimeDataItem">新增时间段</el-button></div>
      </div>
      <template #footer>
         <div style="flex: auto">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="sumbitTimeData">保存</el-button>
         </div>
         </template>
      </el-drawer>
</template>
<script setup>
import { reactive, toRaw} from 'vue';
const emit = defineEmits(['close', 'ok'])

const { proxy } = getCurrentInstance();

const props = defineProps({
    id: String,
    requestHTTP: Function
})

const dataChoose = reactive([{value: 'Monday', name: '周一'},{value: 'Tuesday', name: '周二'},{value: 'Wednesday', name: '周三'},{value: 'Thursday', name: '周四'},{value: 'Friday', name: '周五'},{value: 'Saturday', name: '周六'},{value: 'Sunday', name: '周日'}])

const chooseDataValue = ref('Monday')

const dataSource = reactive({
    Monday:[]
})

const timeDataVisible = ref(false)

const open = (data) => {
    timeDataVisible.value = true
    Object.keys(data).forEach(item => {
        dataSource[item] = data[item]
    })

}
const close = () => {
    emit('close')
    timeDataVisible.value = false
}
const handleGroupChange = (val) => {
    dataSource[val] = dataSource[val] ||[]
}
const  handleAddTimeDataItem = () => {
    dataSource[`${chooseDataValue.value}`] = [...dataSource[`${chooseDataValue.value}`], { startTime: '00:00', endTime: '00:00', price: '30', isLook: false, isEdit: true }]
}

const handleEdit = (row, scope) => {
    dataSource[`${chooseDataValue.value}`][scope.$index].isEdit = !row.isEdit
}

const handleDel = (row, scope) => {
    dataSource[`${chooseDataValue.value}`] =  dataSource[`${chooseDataValue.value}`].filter((item, index) => index !== scope.$index)
}

const sumbitTimeData = () => {
    Object.keys(dataSource).forEach(i => {
        dataSource[i].forEach(item => {
            if(item.isEdit){
                proxy.$modal.msgError("您还有为保存的时间段，请确认");
                return
            }
        })
    })
    props.requestHTTP({id: props.id, priceJson: JSON.stringify(dataSource)  }).then(res => {
        proxy.$modal.msgSuccess("保存时间时间配置成功");
        timeDataVisible.value = false
        emit('ok')
    })
}

defineExpose({ open })
</script>
