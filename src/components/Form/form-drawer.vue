<template>
  <el-drawer
    v-model="drawerVisible"
    :title="type"
    direction="rtl"
    :size="drawerSize"
    @close="handleClose"
  >   
    <slot name="table"></slot>
    <el-form :model="formData" :rules="computedRules" ref="formRef" :style="formStyle">
      <el-form-item
        v-for="(field, index) in formFields"
        :key="index"
        v-bind="field"
        :label="field.label"
        :prop="field.prop"
        :style="field.itemStyle"
      >
        <component
          v-if="['input', 'select'].includes(field.type)"
          :is="`el-${field.type}`"
          v-model="formData[field.prop]"
          allow-clear
          :placeholder="field.placeholder"
           v-bind="field.bind"
          :disabled= "type !== '查看' ? false : true"
           v-on="field.event"
        >
        <el-option v-if="field.bind.options" v-for="item in field.bind.options" v-bind="item" />
      </component>
        <image-upload v-model:modelValue="formData[field.prop]" v-bind="field.bind"  v-else-if="field.type === 'image-upload'"></image-upload>
        <tabs-form-item v-model:tags="formData[field.prop]" v-bind="field.bind"  v-else-if="field.type === 'tabs'"></tabs-form-item>
        <WangEditor v-if="field.type === 'rich-text'"
          style="width: 100%"
          v-model:value="formData[field.prop]"
          :placeholder="field.placeholder"
          :disabled= "type !== '查看' ? false : true"
          height="400px"
        />
      </el-form-item>
    </el-form>
    <template v-if="type !== '查看'" #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  formFields: {
    type: Array,
    required: true,
  },
  drawerSize: {
    type: String,
    default: "45%",
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  rules: {
    type: Object,
    default: () => ({}),
  },
  formStyle:{
    type: Object,
    default: () => ({}),
  }
});

const emit = defineEmits(["submit"]);
// 类型（新增/编辑/查看）
const type = ref('');
const drawerVisible = ref(false);
const formData = ref();
const formRef = ref(null);

// 计算表单验证规则
const computedRules = computed(() => props.rules);

const operateColumns  = {}

// 提交表单
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit("submit", formData.value);
    } else {
      ElMessage.error("请完善表单");
    }
  });
};

// 关闭抽屉时重置表单
const handleClose = () => {
  // 重置表单
  if (formRef.value)formRef.value.resetFields();
  formData.value = {};
  drawerVisible.value = false;
};

// 打开抽屉
const openDrawer = (value, row = {}) => {
  if(value) type.value = value
  formData.value = { ...props.initialData, ...row }
  drawerVisible.value = true;
};

defineExpose({ openDrawer, handleClose, formData, formRef, ...operateColumns });
</script>

