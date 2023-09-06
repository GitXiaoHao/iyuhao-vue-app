<template>
  <div class="register-body">
    <div class="register-title">注册</div>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="" prop="userName">
        <el-input v-model.lazy="ruleForm.userName" type="text" autocomplete="off" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="" prop="userPassword">
        <el-input
            v-model.lazy.trim="ruleForm.userPassword"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="" prop="userCheckPassword">
        <el-input
            v-model.lazy.trim="ruleForm.userCheckPassword"
            type="password"
            autocomplete="off"
            placeholder="请确认密码"
        />
      </el-form-item>

      <el-form-item label="" prop="userEmail">
        <el-input v-model.lazy.trim="ruleForm.userEmail" type="email" placeholder="请输入邮箱"/>
      </el-form-item>
      <el-form-item label="" prop="checkCode">
        <div class="check-code-panel">
          <el-input placeholder="请输入验证码" size="large"
                    class="input-panel"
                    v-model.lazy="ruleForm.checkCode" type="text">
            <template #prefix>
              <span class="iconfont icon-verify"></span>
            </template>
            <el-button type="primary" @click="getCheckCode" :disabled="checkCodeButtonDisabled">
              {{ checkCodeButtonText }}
            </el-button>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
        >注册
        </el-button
        >
        <el-button @click="resetForm(ruleFormRef)">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import {RegisterUser} from "@/types/user";
import {appearMessage} from "@/utils/elementUtils";

const ruleFormRef = ref<FormInstance>()
const checkCodeButtonDisabled = ref<Boolean>(false)
const checkCodeButtonText = ref<String>("获取验证码")
const waitTime = ref<number>(60)
let timer: NodeJS.Timeout
const validateUserName = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入年龄'))
  } else {
    callback()
  }
}

const validateUserPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const passwordReg = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/
    if (!passwordReg.test(value)) {
      //false
      return callback(new Error('密码最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊符号!'))
    }
    if (ruleForm.userCheckPassword !== '') {
      if (!ruleFormRef.value) return
      //将确认密码栏清空
      ruleFormRef.value?.validateField('userCheckPassword', () => null)
    }
    callback()
  }
}
const validateUserCheckPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请重新输入密码'))
  } else if (value !== ruleForm.userPassword) {
    callback(new Error("两个输入不匹配!"))
  } else {
    callback()
  }
}
const validateUserEmail = (rule: any, value: any, callback: any) => {
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
const validateCheckCode = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入验证码'))
  } else {
    callback()
  }
}
const ruleForm = reactive<RegisterUser>({
  checkCode: "", userCheckPassword: "", userEmail: "", userName: "", userPassword: ""
})

const rules = reactive<FormRules<typeof ruleForm>>({
  userName: [{validator: validateUserName, trigger: 'blur'}],
  userPassword: [{validator: validateUserPassword, trigger: 'blur'}],
  userCheckPassword: [{validator: validateUserCheckPassword, trigger: 'blur'}],
  userEmail: [{validator: validateUserEmail, trigger: 'blur'}],
  checkCode: [{validator: validateCheckCode, trigger: 'blur'}],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const getCheckCode = () => {
  //不能点击
  checkCodeButtonDisabled.value = false
  //计时器
  timer = setInterval(() => {
    if (waitTime.value == 0) {
      waitTime.value = 60
      checkCodeButtonDisabled.value = true
      clearInterval(timer)
    }
    checkCodeButtonText.value = (waitTime.value--) + "后重新获取"
  }, 1000)
  //发送请求 获取验证码

  //弹窗
  appearMessage.success("验证码已发送至邮箱")

}
</script>

<style scoped>
.register-body {
  width: 100%;
  height: calc(100vh);
  background-image: url("@/assets/image/login-bg.png");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
</style>