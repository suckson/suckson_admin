<template>
  <div>
    <svg-icon icon-class="ashbin" @click="change" />
  </div>
</template>

<script setup>
import { refreshCache } from "@api/system/dict/type";
import useDictStore from '@store/modules/dict'
const { proxy } = getCurrentInstance();
function change(){
  proxy.$modal.loading("正在设置布局大小，请稍候...");
  refreshCache().then(() => {
    proxy.$modal.closeLoading()
    proxy.$modal.msgSuccess("刷新成功");
    useDictStore().cleanDict();
  });
}
</script>

<style lang='scss' scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>