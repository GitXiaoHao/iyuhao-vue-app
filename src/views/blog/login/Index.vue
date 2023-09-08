<template>
  <div class="login-main">
    <div class="login-card">
      <div class="card-right">
        <img src="@/assets/image/login-image-1.png" alt="...">
      </div>
      <div class="card-left">
          <div class="left-title">
            <img src="@/assets/image/github.png" alt="...">
            <div class="title">个人博客</div>
          </div>
          <div class="left-form">
            <el-form
                :model="loginForm"
                ref="loginFormRef"
                :rules="loginFormRule"
            >
              <el-form-item prop="userName">
                <el-input v-model="loginForm.userName" autofocus>
                  <template #prefix>
                    <span class="iconfont icon-user"></span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="userPassword">
                <el-input v-model="loginForm.userPassword" type="password" show-password>
                  <template #prefix>
                    <span class="iconfont icon-password"></span>
                  </template>
                </el-input>
              </el-form-item>
              <el-button class="form-button" @click="submitForm(loginFormRef)">登录</el-button>
            </el-form>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {reactive, ref} from "vue";
import {UserInfo} from "@/types/user";
import {FormInstance, FormRules} from "element-plus";
import {loginApi} from "@/apis/blog/admin";
import {appearMessage} from "@/utils/elementUtils";
import {accessInfoStr, accessTokenStr} from "@/utils/constStr";
import {useUserStore} from "@/store/modules/user";
import {useRouter} from "vue-router";


const userStore = useUserStore()
const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loginForm = reactive<UserInfo>({})
const loginFormRule = reactive<FormRules<typeof loginForm>>({
  userName:{required: true, message: "请输入用户名", trigger: 'blur'},
  userPassword:{required: true, message: "请输入密码", trigger: 'blur'},
})


const login = async () :Promise<Boolean>=> {
  const res: any = await loginApi(loginForm)
  if(res.code == 200){
    //如果成功
    const data = eval('(' + JSON.stringify(res.data) + ')')
    //管理员数据
    const adminInfo = data[accessInfoStr]
    //token
    const token = data[accessTokenStr]
    //存储
    userStore.setToken(token)
    //存放管理员信息
    userStore.setUserInfo(adminInfo)
    //成功
    //跳转
    appearMessage.success("登陆成功")
    setTimeout(() => {
      router.push("/")
    },2000)
  }else{
    appearMessage.error(res.data)
    return false
  }
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

</script>

<style scoped lang="scss">
.login-main {
  width: 100vw;
  height: calc(100vh);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/image/login-image-bg.png") ;
  background-size: cover;
  .login-card {
    width: 70%;
    height: 60%;
    display: flex;
    border-radius: 20px;
    padding: 0;
    position:relative;
    /* 盒子阴影 */
    box-shadow: 15px 15px 10px rgba(33,45,58,0.3);
    .card-right {
      display: flex;
      height: 100%;
      z-index: 0;
      img {
        width: 100%;
        height: auto;
        border-radius: 10px 0 0  10px;
      }
    }
    .card-left {
      width: 40%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      display: flex;
      border-radius: 0 10px 10px 0;
      background-color: white;
      .left-title{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 60px;
        img{
          width: 100px;
          height: auto;
        }
        .title{
          text-align: center;
          color: #707070;
          font-size: 25px;
        }
      }
      .left-form{
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 20px;
        .form-button{
          width: 100%;
          border-radius: 30px;
          margin-top: 20px;
          background-color: #091B29;
          color: white;
          font-size: 20px;
          height: 40px;
        }
        .form-button:hover{
          background-color: #b1d5c8;
        }
      }

    }
  }
}
:deep(.el-input__wrapper) {
  border: 0 !important;
  box-shadow: none;
  border-bottom: 1px solid #e9e9e8 !important;
  border-radius: 0;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  height: 32px;
  line-height: 32px;
}

:deep(.el-input__inner){
  border: 0;
  border-radius: 0;
  font-size: 14px;
  font-weight: 400;
  height: 32px;
  line-height: 32px;
}

</style>