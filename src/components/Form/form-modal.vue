<template>
	<el-dialog v-model="visible" :title="type" :class="modalBodyClass" :size="drawerSize" @close="handleClose">
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
				v-if="['input', 'select', 'input-number', 'date-picker', 'radio-group'].includes(field.type)"
				:is="field?.render ?? `el-${field.type}`"
				v-model="formData[field.prop]"
				allow-clear
				:placeholder="field.placeholder"
				v-bind="field.bind"
				:disabled= "type !== '查看' ? false : true"
				v-on="field.event"
				>
				<template v-if="field.type === 'select'">
					<component
						:is="`el-option`"
						v-for="(col, index) in field.options"
						:key="index"
						v-bind="col"
					></component>
				</template>
				<template v-if="field.type === 'radio-group'">
					<component
						:is="`el-radio`"
						v-for="(col, index) in field.options"
						:key="index"
						v-bind="col"
						:value="col.label"
					>{{ col.label }}</component>
				</template>
			</component>
				<image-upload v-model:modelValue="formData[field.prop]" v-bind="field.bind"  v-if="field.type === 'image-upload'"></image-upload>
				<tabs-form-item v-model:tags="formData[field.prop]" v-bind="field.bind"  v-if="field.type === 'tabs'"></tabs-form-item>
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
	</el-dialog>
</template>

<script setup>
import { reactive, useSlots, ref, watch } from 'vue'

const emit = defineEmits(["submit"]);
// 类型（新增/编辑/查看）
const type = ref('');
const visible = ref(false);
const formData = ref();
const formRef = ref(null);

const computedRules = computed(() => props.rules);



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
})

let operateColumns = {}
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

// 关闭时重置表单
const handleClose = () => {
  // 重置表单
  if (formRef.value)formRef.value.resetFields();
  formData.value = {};
  visible.value = false;
};

// 打开
const open = (value, row = {}) => {
  if(value) type.value = value
  formData.value = { ...props.initialData, ...row }
  visible.value = true;
};


defineExpose({open, handleClose, formData, formRef, ...operateColumns})
</script>
<style lang="scss">
.drawer-form {
	.ant-drawer-footer {
		text-align: right;
	}
}
</style>
