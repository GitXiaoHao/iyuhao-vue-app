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
              v-model="loginForm"
          >
            <el-form-item>
              <el-input></el-input>
            </el-form-item>
            <el-form-item>
              <el-input></el-input>
            </el-form-item>
            <el-button>登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Picture as IconPicture} from '@element-plus/icons-vue'
import {reactive} from "vue";
const loginForm = reactive({})
</script>

<style scoped lang="scss">
.login-main {
  width: 100vw;
  height: calc(100vh);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #333;
  .login-card {
    width: 80%;
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
      height: auto;
      z-index: 1;
      display: flex;
      align-items: center;
      background-color: white;
      justify-content: center;
      border-radius: 0 10px 10px 0;
      .left-title{
        width: 200px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
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

      }
    }
  }
}
</style>