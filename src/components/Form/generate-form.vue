<!-- 表单生成组件 -->
<template>
	<el-form ref="form" class="generate-form" :model="model" label-align="right">
		<template v-for="item in columns" :key="item.name || item.prop">
			<slot v-if="item.customization && item.show" :name="item.name || item.prop" v-bind="item"></slot>
			<div v-else-if="item.showValue && item.show" :style="item.itemStyle" :class="item.itemClass" class="value-show">
				<span class="label">{{ item.label }}</span>
				<slot v-if="item.input === 'slot'" :name="item.name || item.prop" :item="item" :value="model"></slot>
				<upload-image v-if="item.input === 'upload-images' && countValue(item)" :value="countValue(item)" :only-show="false" :upload-image-params="{ previewMask: false }"></upload-image>
				<span class="value" v-else>{{ countValue(item) }}</span>
			</div>
			<el-form-item v-else-if="item.show" v-bind="item" :style="item.itemStyle" :class="item.itemClass">
				<template #label><slot :name="`${item.name || item.prop}Label`" v-bind="item"></slot></template>
				<slot v-if="item.input === 'slot'" :name="item.name || item.prop" :item="item" :value="model"></slot>
				<e ltextarea v-else-if="item.input === 'textarea'" v-model:value="model[item.name || item.prop]" placeholder="请输入" v-bind="item.inputBind" v-on="item.inputEmit || {}" />
				<el-radio-group v-else-if="item.input === 'radio'" v-model:value="model[item.name || item.prop]" v-bind="item.inputBind" v-on="item.inputEmit || {}" />
				<el-checkbox-group v-else-if="item.input === 'checkbox'" v-model:value="model[item.name || item.prop]" v-bind="item.inputBind" v-on="item.inputEmit || {}" />
				<el-range-picker v-else-if="item.input === 'range-picker'" v-model:value="model[item.name || item.prop]" v-bind="item.inputBind" v-on="item.inputEmit || {}"></el-range-picker>
				<el-date-picker v-else-if="item.input === 'date-picker'" v-model:value="model[item.name || item.prop]" allow-clear placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-bind="item.inputBind" v-on="item.inputEmit || {}"></el-date-picker>
				<el-select v-else-if="item.input === 'select'" v-model:value="model[item.name || item.prop]" allow-clear placeholder="请选择" v-bind="item.inputBind" v-on="item.inputEmit || {}" />
				<el-tree-select v-else-if="item.input === 'tree-select'" v-model:value="model[item.name || item.prop]" allow-clear placeholder="请选择" v-bind="item.inputBind" v-on="item.inputEmit || {}" />
				<cascader-site v-else-if="item.input === 'cascader-site' || item.input === 'cascader'" v-model:value="model[item.name || item.prop]" allow-clear v-bind="item.inputBind" v-on="item.inputEmit || {}" />
				<el-input-number v-else-if="item.input === 'input-number'" v-model:value="model[item.name || item.prop]" placeholder="请输入" style="width: 100%" v-bind="item.inputBind" v-on="item.inputEmit || {}"></el-input-number>
				<WangEditor v-else-if="item.input === 'edit'" v-model:value="model[item.name || item.prop]" style="width: 100%" v-bind="item.inputBind" v-on="item.inputEmit || {}" height="400px" />
				<el-input v-else v-model="model[item.label]" v-model:value="model[item.name || item.prop]" placeholder="请输入" v-bind="item.inputBind" v-on="item.inputEmit || {}" />
			</el-form-item>
		</template>
	</el-form>
</template>
<script setup>
import { ref, watch } from 'vue'

/* eslint-disable */
const emit = defineEmits(['update:model'])

const form = ref(null)

const props = defineProps({
	columns: {
		type: Array,
		default: () => [],
	},
	model: {
		type: Object,
		default: () => ({}),
	},
	needIcon: {
		type: Boolean,
		default: false,
	},
})
let columns = ref([])

watch(
	() => props.columns,
	async val => {
		let arr = []
		for (let item of val) {
			if (item.customization) item.name = item.customization
			if (item.input == 'select' && item?.inputBind?.options instanceof Promise) {
				let promise = item.inputBind.options
				item.inputBind.options = []
				promise.then(res => (item.inputBind.options = res))
			}
			item.show = item.show === undefined ? true : item.show
			arr.push(item)
		}
		columns.value = arr
	},
	{
		deep: true,
		immediate: true,
	}
)
const resetFields = () => {
	form.value.resetFields()
}

function countValue(item) {
	let val = props.model[item.name]
	if (item.renderShowValue) return item.renderShowValue({ ...props.model })
	if (item.input == 'select' || item.input == 'radio') {
		let list = [...item?.inputBind?.options]
		let field = item?.inputBind?.fieldNames
		if (field) list = list.map(it => ({ label: it[field.label], value: it[field.value] }))
		let row = list.find(it => it.value == val)
		return row ? row.label : val
	} else {
		if (Array.isArray(val)) return val.join(',')
		return val
	}
}
defineExpose({
	form
})
</script>
<style lang="scss" scoped>
.config_icon {
	width: 85px;
	height: 95px;
	background-image: url('/img/edit_top.png');
	background-repeat: no-repeat;
	background-size: 100%, 100%;
	cursor: pointer;
}
.uplaod-btn {
	background: transparent;
	color: rgba(86, 152, 149, 1);
}
</style>
