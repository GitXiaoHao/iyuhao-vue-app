<template>
  <div class="cover">
    <img :src="globalInfo.imageUrl + cover" alt="" v-if="cover">
    <img src="@/assets/image/none.png" alt="" v-else>
  </div>
</template>

<script setup>
import {globalInfo} from '@/utils/constStr'
const props = defineProps({
  cover: {
    type: String,
    required: true
  }
})

</script>

<style scoped lang="scss">
.cover{
  display: flex;
  background-color: #ddd;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  img{
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    height: 80px;
    vertical-align: middle;
    background: #ebebeb url('@/assets/image/none.png') no-repeat center / contain;
  }
}
</style>