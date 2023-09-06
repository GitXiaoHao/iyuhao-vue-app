<template>
  <div class="container" :class="ifRegister ? 'sign-up-mode': '' "
       v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div class="forms-container">
      <div class="signin-signup">
        <el-form class="sign-in-form form
        animate__animated animate__fadeInRight
        animate__delay-1.9s"
                 v-if="!ifRegister"

                 :model="login.formData"
                 ref="login.ruleFormRef"
                 :rules="login.rules"
                 status-icon
                 @keyup.enter="login.submitForm(login.ruleFormRef)"
                 label-position="top">
          <h2 class="title">登录</h2>
          <el-form-item label="" prop="userName"
                        label-width="auto"
                        size="large">
            <el-input placeholder="请输入用户名" class="item-input"
                      v-model="login.formData.userName" size="large">
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="userPassword">
            <el-input placeholder="请输入密码"
                      class="item-input"
                      v-model="login.formData.userPassword" size="large"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <input value="登 录" type="submit" class="btn solid" @click="login.submitForm(login.ruleFormRef)"/>
          <p class="social-text">或者通过以下平台登录</p>
          <div class="social-media">
            <a href="#" class="social-icon">
              <span class="iconfont icon-weixin"></span>
            </a>
            <a href="#" class="social-icon">
              <span class="iconfont icon-QQ"></span>
            </a>
            <a href="#" class="social-icon">
              <span class="iconfont icon-weibo"></span>
            </a>
            <a href="#" class="social-icon">
              <span class="iconfont icon-github"></span>
            </a>
          </div>
        </el-form>
        <el-form class="sign-up-form form
        animate__animated animate__fadeInLeft
        animate__delay-1.9s"
                 v-else
                 label-position="top"
                 ref="register.ruleFormRef"
                 @keyup.enter="register.submitForm(register.ruleFormRef)"
                 :model="register.ruleForm"
                 status-icon
                 :rules="register.rules"
        >
          <h2 class="title">注册</h2>
          <el-form-item label="" prop="userName"
                        label-width="auto"
                        size="large">
            <el-input placeholder="请输入用户名" class="item-input"
                      v-model.lazy.trim="register.ruleForm.userName" size="large">
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="userPassword">
            <el-input placeholder="请输入密码"
                      v-model.lazy.trim="register.ruleForm.userPassword" size="large">
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="userCheckPassword">
            <el-input placeholder="请确认密码"
                      v-model.lazy.trim="register.ruleForm.userCheckPassword" size="large"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="userEmail">
            <el-input placeholder="请输入邮箱"
                      v-model.lazy.trim="register.ruleForm.userEmail" size="large"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="checkCode">
            <div class="check-code-panel">
              <el-input placeholder="请输入验证码"
                        class="item-input"
                        v-model.lazy.trim="register.ruleForm.checkCode" size="large"
              >
                <template #prefix>
                  <span class="iconfont icon-account"></span>
                </template>
              </el-input>
              <el-button type="primary"
                         class="check-code-text"
                         :disabled="register.checkCodeButtonDisabled"
                         @click="register.getCheckCode()"
              >{{ register.checkCodeButtonText }}
              </el-button>
            </div>
          </el-form-item>
          <input type="submit" value="注 册"
                 @click="register.submitForm(register.ruleFormRef)"
                 class="btn solid"/>
          <p class="social-text">或者通过以下平台登录</p>
          <div class="social-media">
            <a href="#" class="social-icon">
              <span class="iconfont icon-weixin"></span>
            </a>
            <a href="#" class="social-icon">
              <span class="iconfont icon-QQ"></span>
            </a>
            <a href="#" class="social-icon">
              <span class="iconfont icon-weibo"></span>
            </a>
            <a href="#" class="social-icon">
              <span class="iconfont icon-github"></span>
            </a>
          </div>
        </el-form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>新用户?</h3>
          <p>
            好兄弟,你来了,我们的网站就差你的加入了,点击下方注册按钮加入我们吧!!
          </p>
          <button class="btn transparent" id="sign-up-btn" @click="switchClick">
            注册
          </button>
        </div>
        <img src="@/assets/image/login.svg" class="image" alt=""/>
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>已经是我们自己人了吗?</h3>
          <p>
            那好兄弟,你直接点击登录按钮,登录到我们这优秀的系统里!!
          </p>
          <button class="btn transparent" id="sign-in-btn" @click="switchClick">
            登 录
          </button>
        </div>
        <img src="@/assets/image/register.svg" class="image" alt=""/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import {LoginUser, RegisterUser} from "@/types/user";
import {FormInstance, FormRules} from "element-plus";
import {appearMessage} from "@/utils/elementUtils";
import {useRouter} from "vue-router";
import {
  checkInformationApi,
  obtainVerificationCodeApi,
  registerUserApi,
  validateNameApi,
  verificationCodeMailApi
} from "@/apis/user";
import UserInfo from "@/types/store";
import {useUserStore} from "@/store/modules/user";

const fullscreenLoading = ref<boolean>(false)
const ifRegister = ref<boolean>(false)
const router = useRouter()
const userStore = useUserStore()

onBeforeMount(() => {
  fullscreenLoading.value = true
})

onMounted(() => {
  fullscreenLoading.value = false
})


class Login {
  formData = reactive<LoginUser>({
    userName: '',
    userPassword: ''
  })
  ruleFormRef = ref<FormInstance>()
  rules = reactive<FormRules<typeof this.formData>>({
    userName: [{validator: this.validateName, trigger: 'blur'}],
    userPassword: [{validator: this.validatePassword, trigger: 'blur'}],
  })

  validateName(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入用户名'))
    } else {
      callback()
    }
  }

  validatePassword(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  }

  //校验信息
  parity = async (): Promise<boolean> => {
    const res: any = await checkInformationApi(this.formData)
    if (res.code != 200) {
      appearMessage.error(res.data)
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
    return true
  }

  login() {
    // console.log('sd')
    // return false
    //验证用户名和密码
    if (this.parity()) {
      //正确
      setTimeout(() => {
        router.push('/')
      }, 1000)
      appearMessage.success('登陆成功')
      return true
    }
    return false
  }

  submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        return this.login()
      } else {
        return false
      }
    })
  }
  resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
}

const login = reactive<Login>(new Login())

class Register {
  ruleFormRef = ref<FormInstance>()
  checkCodeButtonDisabled = ref<Boolean>(false)
  checkCodeButtonText = ref<String>("获取验证码")
  doYouWantToObtainAVerificationCode = ref(false)
  waitTime = ref<number>(60)
  timer: NodeJS.Timeout
  ruleForm = reactive<RegisterUser>({
    checkCode: "",
    userCheckPassword: "",
    userEmail: "",
    userName: "",
    userPassword: ""
  })
  determineDuplicateUsername = async (value:any):Promise<Boolean> => {
    const res:any = validateNameApi(value)
    return res.data == null;
  }

  validateUserName = (rule: any, value: any, callback: any) => {
    if (!value) {
      return callback(new Error('请输入用户名'))
    } else {
      const res = this.determineDuplicateUsername(value)
      if(res){
        callback()
      }else{
        callback(new Error("用户名重复"))
      }
    }
  }

  validateUserPassword = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else {
      const passwordReg = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/
      if (!passwordReg.test(value)) {
        //false
        return callback(new Error('密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊符号!'))
      }
      if (this.ruleForm.userCheckPassword !== '') {
        if (!this.ruleFormRef.value) return
        //将确认密码栏清空
        this.ruleFormRef.value?.validateField('userCheckPassword', () => null)
      }
      callback()
    }
  }
  validateUserCheckPassword = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请重新输入密码'))
    } else if (value !== this.ruleForm.userPassword) {
      callback(new Error("两个输入不匹配!"))
    } else {
      callback()
    }
  }
  validateUserEmail = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入邮箱'))
    } else {
      const userEmailReg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/
      if (!userEmailReg.test(value)) {
        return callback(new Error('邮箱格式不正确'))
      }
      callback()
    }
  }
  validateCheckCode = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入验证码'))
    } else {
      callback()
    }
  }
  cleanUpTimer = () => {
    this.waitTime.value = 60
    this.checkCodeButtonDisabled.value = true
    this.doYouWantToObtainAVerificationCode.value = false
    this.checkCodeButtonText.value = "获取验证码"
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
  getCheckCode = async () => {
    //判断邮箱是否填了数据
    await this.ruleFormRef.value?.validateField('userEmail', errMsg => {
      if(errMsg){
        return
      }
    })
    //不能点击
    this.checkCodeButtonDisabled.value = false
    //计时器
    this.timer = setInterval(() => {
      if (this.waitTime.value == 0) {
        this.cleanUpTimer()
      }
      this.checkCodeButtonText.value = (this.waitTime.value--) + "后重新获取"
    }, 1000)
    //发送请求 获取验证码
    const res:any = await obtainVerificationCodeApi(this.ruleForm.userEmail)
    if(res.code == 200) {
      //弹窗
      appearMessage.success("验证码已发送至邮箱")
      this.doYouWantToObtainAVerificationCode.value = true
    }else{
      appearMessage.error(res.data)
    }
  }
  rules = reactive<FormRules<typeof this.ruleForm>>({
    userName: [{validator: this.validateUserName, trigger: 'blur'}],
    userPassword: [{validator: this.validateUserPassword, trigger: 'blur'}],
    userCheckPassword: [{validator: this.validateUserCheckPassword, trigger: 'blur'}],
    userEmail: [{validator: this.validateUserEmail, trigger: 'blur'}],
    checkCode: [{validator: this.validateCheckCode, trigger: 'blur'}],
  })
  getRegister = async () => {
    //注册
    //先判断验证码是否正确
    if(!this.doYouWantToObtainAVerificationCode){
      appearMessage.error("未获取验证码")
      return
    }
    const res:any = await verificationCodeMailApi(this.ruleForm.checkCode)
    if(res.code == 200){
      //验证码正确
      delete this.ruleForm['userCheckPassword']
      delete this.ruleForm['checkCode']
      const result:any = await registerUserApi(this.ruleForm)
      if(result.code == 200){
        appearMessage.success("注册成功")
      }else{
        appearMessage.error(result.data)
      }
    }else{
      appearMessage.error(res.data)
    }
  }
  submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        this.getRegister()
        return true
      } else {
        return false
      }
    })
  }
  resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

}

const register = reactive<Register>(new Register())


/**
 * 切换
 */
const switchClick = () => {
  //切换布局
  ifRegister.value = !ifRegister.value
  //注册的获取验证码监听器 清除
  register.cleanUpTimer()
  //将表格数据清空
  login.resetForm(login.ruleFormRef)
  register.resetForm(register.ruleFormRef)
}

</script>

<style scoped lang="scss">

* {

  box-sizing: border-box;
}

.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

:deep(.el-form-item) {
  margin-left: 0 !important;
  width: 300px;
  border-radius: 50px;
}

:deep(.el-input__wrapper) {
  background-color: transparent;
  height: 50px;
  font-size: 15px;
  border-radius: 40px;
}

:deep(.el-form-item__error) {
  margin-left: 10px;
  font-size: 15px;
}

.iconfont {
  font-size: 20px;
}

.check-code-panel {
  display: flex;
  width: 100%;
  align-items: center;

  .item-input {
    flex: 1;
  }

  .check-code-text {
    align-items: center;
    justify-content: center;
    //height: 30px;
    border-radius: 5px;
    width: 100px;
    margin-left: 5px;
    background-color: transparent;
    color: #a7aab1;
    border: 1px gray;
    cursor: pointer;
  }

  .check-code-text:hover {
    color: #ee7959;
  }

}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-45%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

.form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.sign-up-form {
  opacity: 0;
  z-index: 1;
}

.sign-in-form {
  z-index: 2;
  width: 500px;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 20px;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #4481eb;
  border-color: #4481eb;
}

.btn {
  width: 150px;
  background: #1D976C; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #93F9B9, #1D976C); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #93F9B9, #1D976C); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #4d84e2;
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background: #1D976C; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #93F9B9, #1D976C); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #93F9B9, #1D976C); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  transition: 1s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.5s ease-in-out;
    transition-delay: 0.4s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.5s ease-in-out;
    transition-delay: 1s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>