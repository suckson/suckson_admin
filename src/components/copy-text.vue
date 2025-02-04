<template>
	<el-button class="copy-text" type="link" primary  v-debounce  @click.stop="handleCopy">复制</el-button>
</template>

<script setup>
import handleClipboard from '@/utils/clipboard.js'
const props = defineProps({
	value: {
		type: String,
		default: '',
	},
})
const handleCopy = ($event) => {
	handleClipboard(props.value, $event)
}


</script>
<style lang="scss" scoped>
.copy-text {
    color: rgba(94, 255, 212, 1);
    padding: 4px 8px;
}
</style>
