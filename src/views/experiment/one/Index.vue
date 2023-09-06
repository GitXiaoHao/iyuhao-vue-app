<template>
  <el-container>
    <el-header>
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          unique-opened
          @select="handleSelect"
      >
        <el-menu-item index="0">LOGO</el-menu-item>
        <div class="comment">
          <div class="search-box">
            <input type="text" class="search-txt" placeholder="想搜啥?"/>
            <a class="search-btn">
              <Search/>
            </a>
          </div>

        </div>

        <div class="flex-grow"/>
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Workspace</template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="login">登录</el-menu-item>
        <el-menu-item index="register">注册</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">

      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {Search} from "@element-plus/icons-vue";
import {useUserStore} from "@/store/modules/user";
const userStore = useUserStore()
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped lang="scss">
.el-header {
  --el-header-padding: 0;

  .flex-grow {
    flex-grow: 1;
  }

  .comment {
    .search-box {
      /* 绝对定位 水平垂直居中 */
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #2f3640;
      height: 40px;
      padding: 10px;
      border-radius: 40px;

      .search-txt {
        border: none;
        background: none;
        outline: none;
        float: left;
        padding: 0;
        color: #fff;
        font-size: 16px;
        line-height: 20px;
        width: 0;
        /* 动画过渡 */
        transition: 0.4s;
      }

      .search-btn {
        color: #e84118;
        float: right;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #2f3640;
        /* 弹性布局 水平垂直居中 */
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        /* 动画过渡 */
        transition: 0.4s;
      }
    }

    .search-box:hover .search-txt {
      width: 200px;

    }

    .search-box:hover .search-btn {
      //background-color: #fff;
    }
  }
}
</style>