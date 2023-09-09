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
              <div class="header-image">
                <Cover
                    :cover="userInfo.userCover || ''"
                    borderRadios="50"
                    fit="cover"
                ></Cover>
              </div>
              <div class="header-info">
                <div class="info-name">{{ userInfo.userName }}</div>
                <div class="info-content">
                  <el-text>
                    <count-to :startVal="0" :endVal="3000"
                              style="color: red"
                              :decimals="0" :duration="3000">
                    </count-to>
                    总访问量
                  </el-text>
                  <el-divider direction="vertical"></el-divider>
                  <el-text>

                    原创
                  </el-text>
                  <el-divider direction="vertical"></el-divider>
                  <el-text>
                    排名
                  </el-text>
                  <el-divider direction="vertical"></el-divider>
                  <el-text>
                    <count-to :startVal="0" :endVal="userInfo.userFans"
                              :decimals="0" :duration="3000">
                    </count-to>
                    粉丝
                  </el-text>
                  <div class="content-right">
                    加入时间：{{ userInfo.userCreateTime }}
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
                  <el-input v-model.lazy.trim="userInfo.userName"/>
                </el-form-item>
                <el-form-item label="手机号" prop="userPhone">
                  <el-input v-model.number="userInfo.userPhone"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                  <el-input v-model="userInfo.userEmail"/>
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
                          v-model="userInfo.userAutograph"
                          type="textarea"></el-input>
              </label>
            </div>
            <div class="foot">
              <el-button size="large" type="warning" @click="cancel">取消</el-button>
              <el-button size="large" type="success" @click="saveInfo(userInfoRef)">保存</el-button>
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
      <el-form
          :model="dialogForm"
          :rules="dialogFormRules"
          ref="dialogFormRef"
          label-position="left"
      >
        <el-form-item label="当前密码" prop="initialPassword">
          <el-input v-model.lazy.trim="dialogForm.initialPassword"
                    type="password"
                    show-password
                    size="large"
          ></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="changePassword">
          <el-input v-model.lazy.trim="dialogForm.changePassword"
                    size="large"
                    show-password
                    type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model.lazy.trim="dialogForm.confirmPassword"
                    size="large"
                    show-password
                    type="password"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from 'vue'
import CoverUpload from "@/components/CoverUpload.vue";
import {FormInstance, FormRules} from "element-plus";
import Dialog from "@/components/Dialog.vue";
import {DialogType} from "@/types/dialog";
import {UserInfo} from "@/types/user";

const loading = ref(true)
import {CountTo} from 'vue3-count-to';
import {ButtonType, DT, globalInfo, MsgType} from "@/utils/constStr";
import {useUserStore} from "@/store/modules/user";
import Cover from "@/components/Cover.vue";
import {appearMessage, appearMessageBox} from "@/utils/elementUtils";
import {saveUserInfoApi} from "@/apis/blog/admin";
import {deleteFile} from "@/apis/common";
import md5 from "js-md5";
import {onBeforeRouteLeave} from "vue-router";
import {isObjectValueEqual} from "@/utils/common";


const userStore = useUserStore()
const coverUploadRef = ref(null)
const coverUploadFile = reactive([])
const userInfoRef = ref<FormInstance>()
let originalCover = null
const userInfo = reactive<UserInfo>({})
const validatePhone = (rule: any, value: any, callback: any) => {
  if (value !== '') {
    let phoneRep = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    if (!phoneRep.test(value)) {
      callback(new Error("请输入正确的手机号"))
    }
  }
  callback()
}

const validateCover = (rule: any, value: any, callback: any) => {
  if (coverUploadRef.value.dialogImageUrl == null) {
    callback(new Error("请上传头像"))
  } else {
    //保存之前头像
    if (!originalCover) {
      originalCover = userInfo.userCover
    }
    userInfo.userCover = coverUploadRef.value.dialogImageUrl
  }
}
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value !== '') {
    const userEmailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/
    if (!userEmailReg.test(value)) {
      return callback(new Error('邮箱格式不正确'))
    }
  }
  callback()
}


const userInfoRules = reactive<FormRules<typeof userInfo>>({
  userCover: [{validator: validateCover, trigger: 'blur'}],
  userPhone: [{validator: validatePhone, trigger: 'blur'}],
  userEmail: [{validator: validateEmail, trigger: 'blur'}],
  userName: {required: true, message: '请输入昵称', trigger: 'blur'},
})

/**
 * 取消保存
 */
const cancel = () => {
  initUserInfo()
}
/**
 * 保存用户信息
 */
const saveUserInfo = async () => {
  const res: any = await saveUserInfoApi(userInfo)
  if (res.code == 200) {
    //删除头像
    await deleteFile(originalCover)
    //滞空
    appearMessage.success("保存成功")
    userStore.setUserInfo(res.data)
    initUserInfo()
  }
}

const saveInfo = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      coverUploadRef.value
      saveUserInfo()
    } else {

      return false
    }
  })
}


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
      type: ButtonType.success,
      name: '修改',
      click: () => {
        dialogSubmitForm(dialogFormRef.value)
      }
    },
  ],
  dialogType: DT.update,
  dialogVisible: false,
  title: "修改密码",
  width: "40%"

})

const showChangeDialog = (visible: Boolean) => {
  //清空数据
  nextTick(() => {
    dialogFormRef.value?.resetFields()
  })
  dialog.dialogVisible = visible
}


const validateInitialPassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入当前密码'))
  }
}

const validateChangePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入修改后密码'))
  } else {
    const passwordReg = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/
    if (!passwordReg.test(value)) {
      //false
      return callback(new Error('密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊符号!'))
    }
    if (dialogForm.confirmPassword !== '') {
      if (!dialogFormRef.value) return
      //将确认密码栏清空
      dialogFormRef.value?.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== dialogForm.initialPassword) {
    callback(new Error("两个输入不匹配！"))
  } else {
    callback()
  }
}


const dialogFormRef = ref<FormInstance>()
const dialogForm = reactive({
  initialPassword: "",
  changePassword: "",
  confirmPassword: "",
})
const dialogFormRules = reactive<FormRules<typeof dialogForm>>({
  initialPassword: [{validator: validateInitialPassword, trigger: 'blur'}],
  changePassword: [{validator: validateChangePassword, trigger: 'blur'}],
  confirmPassword: [{validator: validateConfirmPassword, trigger: 'blur'}],
})
const dialogUpdate = async () => {
  if (md5(dialogForm.initialPassword) == userInfo.userPassword) {
    //密码正确
    userInfo.userPassword = md5(dialogForm.changePassword)
    const res: any = await saveUserInfo()
    if (res.code == 200) {
      appearMessage.success("修改成功")
    }
    return
  }
  appearMessage.error("当前密码输入错误!")
  await dialogFormRef.value?.validateField('initialPassword', () => null)
}
const dialogSubmitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      dialogUpdate()
    } else {
      console.log('error submit!')
      return false
    }
  })
}


/**
 * 初始化用户信息
 */
const initUserInfo = () => {
  Object.assign(userInfo, userStore.getUserInfo)
  //头像滞空
  originalCover = null
  coverUploadFile.length = 0
  coverUploadFile.push({
    url: globalInfo.imageUrl + userInfo.userCover,
    name: userInfo.userName
  })
}


onMounted(() => {
  initUserInfo()

  loading.value = false
})


onBeforeRouteLeave((to, from, next) => {
  //判断是否修改过
  const bool = isObjectValueEqual(userStore.getUserInfo, userInfo);
  if (bool) {
    next()
    return
  }
  appearMessageBox("您有未保存的数据，是否离开?", "提示", MsgType.warning)
      .then(() => {
        next();
      }).catch(() => {

  });
});


</script>

<style scoped lang="scss">
.skeleton-main {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  .box-card {
    width: 100%;
    height: auto;

    .user-card-header {
      display: flex;
      justify-content: normal;
      align-items: center;

      .header-image {
        margin-right: 20px;
        width: 100px;
        height: 100px;
      }

      .header-info {
        flex: 1;
        align-items: center;
        justify-content: start;

        .info-name {
          width: 120px;
          margin-bottom: 20px; /*一列布局块元素水平居中,宽度小于浏览器窗口宽度时需要设置*/
          font-size: 25px;
        }

        .info-content {
          float: bottom;
          display: flex;

          .content-right {
            display: flex;
            align-items: center;
            justify-content: right;
            width: 300px;
            font-size: 20px;
            margin-left: 90px;
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

    .info-main {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .main-form {
        width: 50%;
      }

      .autograph {
        width: 40%;
        top: 0;
        padding-bottom: 10px;
      }
    }

    .foot {
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