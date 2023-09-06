<template>
  <div>
    <el-dialog :model-value="dialogVisible"
               :width="width"
               draggable
               lock-scroll
               modal
               :before-close="close"
               :close-on-click-modal="false"
               :title="title"
               class="custom-dialog"
    >
      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="buttons && buttons.length" #footer>
        <el-button v-for="(button) in buttons"
                   @click="button.click"
                   :type="button.type"
        >{{ button.name }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

const emits = defineEmits(['showChangeDialog'])
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    required: true,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: "30%"
  },
  buttons: {
    type: Array
  }
})
const close = () => {
  emits('showChangeDialog', false)
}

</script>

<style scoped lang="scss">
.custom-dialog {
  :deep(.el-dialog__body) {
    border-top: 1px solid #ddd;
  }

}
</style>