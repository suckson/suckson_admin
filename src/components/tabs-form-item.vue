<template>
<div class="flex gap-2">
    <el-tag v-for="tag in tags" :key="tag" :closable="!onlyShow" :disable-transitions="false" @close="handleClose(tag)" >{{ tag }} </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag ml-1"
      size="default"
      @click="showInput"
      v-show="!onlyShow"
    >
      + 添加新标签
    </el-button>
  </div>
</template>
<script  setup>
import { nextTick, ref } from 'vue'

const emit = defineEmits();
const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  onlyShow: {
    type: Boolean,
    default: false
  }
})



const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
  emit("update:tags", props.tags.filter(item => item!== tag));
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    emit("update:tags",[...props.tags, inputValue.value]);
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>
