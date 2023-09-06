<template>
  <div class="container">
    <el-upload
        v-bind:file-list="dialogType === DT.add ? [] : files"
        ref="upload"
        :action="globalInfo.imageUpload"
        list-type="picture-card"
        :show-file-list="true"
        :limit="1"
        :multiple="false"
        :before-upload="beforeUpload"
        :on-success="handleAvatarSuccess"
        :on-exceed="handleExceed"
        :auto-upload="true">
      <el-icon><Plus /></el-icon>

      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
        </div>
      </template>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%"/>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {globalInfo} from '@/utils/constStr'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import {genFileId, UploadRequestOptions} from 'element-plus'
import type { UploadFile,UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import {appearMessage} from "@/utils/elementUtils";
import {deleteFile} from "@/apis/common";
import {DT} from "@/types/blog";

const upload = ref<UploadInstance>()
const dialogImageUrl = ref<String>(null)
const dialogVisible = ref(false)
const disabled = ref(false)

const props = defineProps({
  files: {
    type: Array,
    default: [
      {
        url: globalInfo.imageUrl + '408cf900-4457-4d87-826e-93fe73bfb9eb.png',
        name: '408cf900-4457-4d87-826e-93fe73bfb9eb.png'
      }
    ]
  },
  dialogType: {
    type: String
  }
})




const deletePic = async (file?:UploadFile) => {
  //同时后端删除
  if(dialogImageUrl.value && props.dialogType == DT.add){
    const res = await deleteFile(dialogImageUrl.value)
  }
  upload.value!.clearFiles()
  dialogImageUrl.value = null
}
const beforeUpload  = (file)=> {
  if(file){
    const suffix = file.name.split('.')[1]
    const size = file.size / 1024 / 1024
    if(['png','jpeg','jpg'].indexOf(suffix) < 0){
      appearMessage.error('上传图片只支持 png、jpeg、jpg 格式！')
      return false
    }
    if(size > 10){
      appearMessage.error('上传文件大小不能超过 2MB!')
      return false
    }
    return file
  }
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  deletePic()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}



//上传完成之后
const handleAvatarSuccess =  (response, file, fileList) =>{
  const res = response.data
  //后缀名
  if(!res.substring(res.lastIndexOf("."))){
    appearMessage.error("上传失败")
    return
  }
  dialogImageUrl.value = response.data
}
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
      dialogVisible.value = true
}


const handleRemove = (file: UploadFile) => {
  deletePic(file)
}
const handleDownload = (file: UploadFile) => {
  let a = document.createElement('a');
  let event = new MouseEvent('click');
  a.download = file.name;
  a.href = file.url;
  a.dispatchEvent(event);
}

defineExpose({
  deletePic,
  dialogImageUrl
})







</script>

<style scoped>

</style>