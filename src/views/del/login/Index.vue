<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form :model="formData"
               ref="ruleFormRef"
               :rules="rules"
               @keyup.enter="submitForm(ruleFormRef)">
        <el-form-item label="" prop="userName">
          <el-input placeholder="请输入用户名"
                    v-model="formData.userName" size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="userPassword">
          <el-input placeholder="请输入密码" size="large"
                    v-model="formData.userPassword" type="password">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="checkCode">
          <div class="check-code-panel">
            <el-input placeholder="请输入验证码" size="large"
                      class="input-panel"
                      v-model="formData.checkCode" type="text">
              <template #prefix>
                <span class="iconfont icon-verify"></span>
              </template>

            </el-input>
            <img :src="checkCodeUrl" alt=""
                 @click="getVerify"
                 class="check-code">
          </div>
        </el-form-item>

        <div class="login-reg">
          <el-form-item label="">
            <el-checkbox v-model="formData.remember" :label="false">记住我</el-checkbox>
          </el-form-item>
          <el-form-item label=""><RouterLink to="/register" class="register">注册</RouterLink></el-form-item>
        </div>
        <el-form-item label="">
          <el-button type="primary" :style="{width: '100%'}"  @click="submitForm(ruleFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue"
import {FormInstance, FormRules} from 'element-plus'
import {checkInformationApi, equalsVerifyApi, getVerifyString} from "@/apis/user";
import {appearMessage} from "@/utils/elementUtils"
import VueCookies from "vue-cookies";
import {useRouter} from "vue-router";
import {accessTokenStr, loginInfoStr} from "@/utils/constStr";
import {useUserStore} from "@/store/modules/user";
import {UserInfo} from "@/types/store";
import {LoginUser} from "@/types/user";

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const userStore = useUserStore()


//验证码路径
let checkCodeUrl = ref<string>()

const formData = reactive<LoginUser>({
  userName: '',
  userPassword: '',
  checkCode: '',
  remember: false
});

const initUserInformation = (): boolean => {

  const loginInfo = VueCookies.get(loginInfoStr)
  if (!loginInfo) {
    return false
  }
  Object.assign(formData, loginInfo)
  return true
}
//获取验证码
const getVerify = () => {
  checkCodeUrl.value = getVerifyString()
}
//验证验证码
const equalsVerify = async (checkCode: string): Promise<boolean> => {
  const res: any = (await equalsVerifyApi(checkCode))
  if (res.code !== 200) {
    appearMessage.error(res.data)
    return false
  }
  return true
}
//校验信息
const parity = async (): Promise<boolean> => {
  //删除验证码
  delete formData['checkCode']
  const res: any = await checkInformationApi(formData)
  if (res.code != 200) {
    appearMessage.error(res.data)
    //错误之后 验证码刷新
    getVerify()
    return false
  }
  //用户信息 永不过期
  // VueCookies.set('userInfo',res.data,0)
  //登录成功 获取token值
  let accessToken = res.data.token;//从后台返回的token
  //存储用户信息
  let info: UserInfo = new UserInfo();
  Object.assign(res.data, info)

  userStore.setUserInfo(info)
  userStore.setToken(accessToken)

  //如果选择记住我 则要进行操作
  if (formData.remember) {
    const loginInfo = {
      userName: formData.userName,
      userPassword: formData.userPassword,
      remember: formData.remember
    }

    VueCookies.set(loginInfoStr, loginInfo, '7d')
  }
  return true
}
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}
const validateCheckCode = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<typeof formData>>({
  userName: [{validator: validateName, trigger: 'blur'}],
  userPassword: [{validator: validatePassword, trigger: 'blur'}],
  checkCode: [{validator: validateCheckCode, trigger: 'blur'}],
})

const login = (): boolean => {
  // console.log('sd')
  // return false
  //判断验证码是否正确
  if (equalsVerify(formData.checkCode)) {
    return false
  }
  //验证码正确
  //验证用户名和密码
  if (parity()) {
    //正确
    setTimeout(() => {
      router.push('/')
    },1000)
    appearMessage.success('登陆成功')
    return true
  }
  return false
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      return login()
    } else {

      return false
    }
  })
}
onMounted(() => {
  //看之前是否登录时 记住用户
  initUserInformation()
  //获取验证码
  getVerify()
})

</script>

<style scoped lang="scss">
.login-body {

  width: 100%;
  height: calc(100vh);
  background-image: url("@/assets/image/login-bg.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .login-panel {
    margin-top: 15%;
    width: 350px;
    float: right;
    margin-right: 150px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 2px 2px 10px #aed0ee;
    background: #e7e7eb;

    .login-title {
      font-size: 18px;
      text-align: center;
      margin-bottom: 10px;
    }

    .login-reg {
      display: flex;
      justify-content: space-between;

      .register {
        cursor: pointer;
      }

      .register:hover {
        color: #99bcac;
      }
    }

    .check-code-panel {
      display: flex;
      width: 100%;
      align-items: center;

      .input-panel {
        flex: 1;
        margin-right: 5px;
      }

      .check-code {
        align-items: center;
        justify-content: center;
        //height: 30px;
        border-radius: 5px;
        cursor: pointer;
      }
    }
  }
}


</style>