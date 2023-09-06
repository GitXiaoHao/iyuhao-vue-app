<template>
  <div class="skeleton-main">
    <el-skeleton
        :loading="loading"
        animated
        :throttle="500"
        style="--el-skeleton-circle-size: 100px"
    >
      <template #template>
        <el-card class="box-card-skeleton">
          <el-skeleton-item variant="circle"/>
          <el-skeleton-item variant="p" style="width: 50%;"/>
          <el-skeleton-item variant="rect" style="margin-top: 50px"/>
          <el-skeleton-item variant="rect" style="margin-top: 50px"/>
          <el-skeleton-item variant="rect" style="margin-top: 50px"/>
          <el-skeleton-item variant="rect" style="margin-top: 50px"/>
        </el-card>
      </template>
      <template #default>
        <el-card class="box-card"
                 shadow="hover"
        >
          <template #header>
            <div class="user-card-header">
              <el-avatar :size="100" @error="errorHandler" fit="cover" class="header-image">
                user
              </el-avatar>
              <div class="header-info">
                <div class="info-name">haoprivate</div>
                <div class="info-content">
                  <el-text>
                    <count-to :startVal="0" :endVal="3000"
                              :decimals="0" :duration="3000"></count-to>
                    总访问量
                  </el-text>
                  <el-divider direction="vertical"></el-divider>
                  <el-text>原创</el-text>
                  <el-divider direction="vertical"></el-divider>
                  <el-text>排名</el-text>
                  <el-divider direction="vertical"></el-divider>
                  <el-text>粉丝</el-text>
                  <div class="content-right">
                    加入时间：
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <div class="info-main">
              <el-form
                  ref="userInfoRef"
                  label-position="right"
                  :rules="userInfoRules"
                  label-width="100px"
                  :model="userInfo"
                  class="main-form"
                  style="max-width: 500px"
              >
                <el-form-item label="头像" prop="userCover">
                  <CoverUpload ref="coverUploadRef"
                               :files="coverUploadFile"
                               :dialogType="DT.update"
                  ></CoverUpload>
                </el-form-item>
                <el-form-item label="昵称" prop="userName">
                  <el-input v-model="userInfo.userName"/>
                </el-form-item>
                <el-form-item label="手机号" prop="userPhone">
                  <el-input v-model.number="userInfo.userPhone"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model.number="userInfo.userEmail"/>
                </el-form-item>
                <el-form-item label="密码">
                  <el-button text @click="showChangeDialog(true)"
                             type="warning"
                  >
                    修改密码
                  </el-button>
                </el-form-item>
              </el-form>
              <label class="autograph">
                我的个性签名
                <el-input placeholder="设置您的签名- ( ゜- ゜)つロ"
                          :autosize="{ minRows: 4, maxRows: 6 }"
                          :rows="10"
                          show-word-limit
                          :maxlength="250"
                          type="textarea"></el-input>
              </label>
            </div>
            <div class="foot">
              <el-button size="large" type="success">保存</el-button>
            </div>
          </template>
        </el-card>
      </template>
    </el-skeleton>


    <Dialog
        @showChangeDialog="showChangeDialog"
        :dialogVisible="dialog.dialogVisible"
        :title="dialog.title"
        :width="dialog.width"
        :buttons="dialog.buttons"
    >

    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, reactive, ref} from 'vue'
import CoverUpload from "@/components/CoverUpload.vue";
import {ButtonType, DT} from "@/types/blog";
import {FormInstance, FormRules} from "element-plus";
import Dialog from "@/components/Dialog.vue";
import {DialogType} from "@/types/dialog";
import {UserInfo} from "@/types/user";
const loading = ref(true)
import { CountTo } from 'vue3-count-to';


const coverUploadRef = ref(null)
const coverUploadFile = reactive([])
const userInfoRef = ref<FormInstance>()
const userInfo = reactive<UserInfo>({
  userCover: "", userEmail: "", userId: "", userName: "", userPassword: ""
})
const userInfoRules = reactive<FormRules<typeof userInfo>>({
  userCover: {required: true, message: "请上传图像", trigger: 'blur'},
  userPhone: {required: true, message: "请填写手机号", trigger: 'blur'},
  userEmail: [{required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'],}],
  userName: {required: true, message: '请输入昵称', trigger: 'blur'},
})
const errorHandler = () => true

//修改密码弹框
const dialog = reactive<DialogType>({
  buttons: [
    {
      type: ButtonType.info,
      name: '返回',
      click() {
        //清除数据
        showChangeDialog(false)
      }
    },
    {
      type: ButtonType.primary,
      name: '修改',
      click: () => {

      }
    },
  ],
  dialogType: DT.update,
  dialogVisible: false,
  title: "修改密码",
  width: "30%"

})

const showChangeDialog  = (visible:Boolean) => {
  dialog.dialogVisible = visible
}

onBeforeMount(() => {

})
onMounted(() => {
  loading.value = false
})
</script>

<style scoped lang="scss">
.skeleton-main {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .box-card {
    width: 100%;
    height: 800px;

    .user-card-header {
      display: flex;
      justify-content: normal;
      align-items: center;

      .header-image {
        margin-right: 20px;
      }

      .header-info {
        flex: 1;
        align-items: center;
        justify-content: start;

        .info-name {
          margin-bottom: 20px; /*一列布局块元素水平居中,宽度小于浏览器窗口宽度时需要设置*/
          float: top;
          font-size: 25px;
        }

        .info-content {
          //width: 100%;
          float: bottom;
          margin-right: 50px;
          display: flex;
          .content-right{
            font-size: 20px;
            margin-left: 200px;
          }
          .el-text {
            font-size: 20px;
          }

          .el-divider--vertical {
            margin: 0 50px;
            height: auto;
          }
        }
      }
    }
    .info-main{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .main-form{
        width: 50%;
      }
      .autograph{
        width: 40%;
        top: 0;
        padding-bottom: 10px;
      }
    }
    .foot{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .box-card-skeleton {
    width: 100%;
    height: 800px;
    padding: 20px;
  }
}
</style>