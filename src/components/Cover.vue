<template>
  <div class="cover">
    <el-image
        v-if="cover"
        :src="globalInfo.imageUrl + cover" alt="" :fit="fit"
      :style="{'border-radius' : borderRadios + '%'}"
              :preview-src-list="[globalInfo.imageUrl + cover]"
    >
      <template #error>
        <div class="image-slot">
          <el-icon><icon-picture /></el-icon>
        </div>
      </template>
    </el-image>
    <el-image v-else alt="" :fit="fit" :style="{'border-radius' : borderRadios + '%'}">
      User
    </el-image>
  </div>
</template>

<script setup>
import {globalInfo} from '@/utils/constStr'
import { Picture as IconPicture } from '@element-plus/icons-vue'
const props = defineProps({
  cover: {
    type: String,
    required: true
  },
  borderRadios: {
    type: String,
    default: "0"
  },
  fit: {
    type: String,
    default: 'cover'
  }
})

</script>

<style scoped lang="scss">
.cover{
  display: flex;
  align-items: center;

  width: 100%;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  .el-image{
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    height: 80px;
    vertical-align: middle;
  }
}
</style>