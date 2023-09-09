<template>
  <div class="cover">
    <el-image
        v-if="cover"
        :src="globalInfo.imageUrl + cover" alt="" :fit="fit"
        :style="{'border-radius' : borderRadios + '%'}"
        :preview-src-list="[globalInfo.imageUrl + cover]"
        preview-teleported
    >
      <template #error>
        <div class="image-slot">
          <el-icon>
            <icon-picture/>
          </el-icon>
        </div>
      </template>
    </el-image>
    <el-image v-else alt="" :fit="fit" :style="{'border-radius' : borderRadios + '%'}">
      None
    </el-image>
  </div>
</template>

<script setup>
import {globalInfo} from '@/utils/constStr'
import {Picture as IconPicture} from '@element-plus/icons-vue'

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
.cover {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
  overflow: hidden;

  .el-image {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    height: 80px;
    vertical-align: middle;
  }
}
</style>