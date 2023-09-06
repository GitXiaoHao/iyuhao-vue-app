<template>
  <div class="layout" v-loading="loading">
    <el-container>
      <el-header class="header">
        <div class="header-logo">
          Iyuhao
        </div>
        <div class="header-user-info">
          <el-dropdown type="primary" @command="handleCommand">
            <span class="el-dropdown-link">
              <span class="link-name">欢迎回来，{{ userInfo.userName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="userMenu.information" :icon="InfoFilled">{{ userMenu.information }}</el-dropdown-item>
                <el-dropdown-item :command="userMenu.exit" :icon="Delete">{{ userMenu.exit }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!--          <div class="avatar"><img :src="userInfo.avatar"></div>-->
          <div class="avatar"><img src="@/assets/image/github.png" alt=""></div>
        </div>
      </el-header>
      <el-container class="el-container-body">
        <el-aside width="200px" class="left-aside">
          <div class="left-div">
            <el-button class="post-btn">发布</el-button>


            <el-menu
                active-text-color="#ffd04b"
                background-color="#545c64"
                class="el-menu"
                text-color="#fff"
                :default-active="menuList[0].children[0].id"
                @open="handleOpen"
                @close="handleClose"

            >
              <el-sub-menu :index="menuItem.id" v-for="(menuItem) in menuList" class="sub-menu">
                <template #title>
                  <span :class="'iconfont ' + menuItem.icon" class="sub-icon"></span>
                  <span class="sub-title">{{ menuItem.title }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item :index="menuChildrenItem.id" v-for="(menuChildrenItem) in menuItem.children">
                    <RouterLink class="sub-menu-link"
                                :to="menuChildrenItem.path"
                                :class="activePath === menuChildrenItem.path ? 'link-active': ''"
                    >{{ menuChildrenItem.title }}</RouterLink>
                    <!--                    {{ menuChildrenItem.title }}-->
                  </el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
            </el-menu>
          </div>
        </el-aside>
        <el-main class="right-main">
            <RouterView/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {
  Delete,
  InfoFilled,
  ArrowDown
} from '@element-plus/icons-vue'
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import UserInfo from "@/types/store";
import {useUserStore} from "@/store/modules/user";
import {useBlogStore} from "@/store/modules/blog";
import {userMenu} from "@/utils/constStr";
import {useRoute, useRouter} from "vue-router";

let userInfo = reactive<UserInfo>({
  userName: '小豪',
  userId: '1', userCover: "", userEmail: "", userPassword: ""
})
const loading = ref(false)
const activePath = ref<string>()
const userStore = useUserStore()
const blogStore = useBlogStore()
const router = useRouter()
const route = useRoute()
const menuList = reactive([
  {
    id: '123',
    title: '博客',
    icon: 'icon-xieboke',
    disabled: false,
    children: [
      {
        id: '1231',
        title: '博客管理',
        path: '/blog/manage/administration',
      },
      {
        id: '1232',
        title: '分类管理',
        path: '/blog/manage/category',
      }
    ],
  },
  {
    id: '124',
    title: '专题',
    icon: 'icon-zhuanti',
    disabled: false,
    children: [
      {
        id: '1241',
        title: '专题管理',
        path: '/blog/manage/special',
      },
    ],
  },
  {
    id: '125',
    title: '设置',
    icon: 'icon-shezhi',
    disabled: false,
    children: [
      {
        id: '1251',
        title: '个人信息',
        path: '/blog/manage/userInformation',
      },
      {
        id: '1252',
        title: '博客成员',
        path: '/blog/manage/member',
      },
      {
        id: '1253',
        title: '系统设置',
        path: '/blog/list',
      },
    ],
  },
  {
    id: '126',
    title: '回收站',
    icon: 'icon-huishouzhan',
    disabled: false,
    children: [
      {
        id: '126',
        title: '回收站',
        path: ''
      }
    ]
  }

])

const handleCommand = (command: string | number | object | userMenu) => {
  console.log(command)
}
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}



watch(route,(newValue: any,oldValue: any) => {
  activePath.value = newValue.path
},{immediate:true,deep: true})


onBeforeMount(() => {
  loading.value = true
})
onMounted(async () => {
  //获取用户信息
  // userInfo.value = userStore.getUsrInfo
  activePath.value = menuList[0].children[0].path
  loading.value = false

})
</script>

<style scoped lang="scss">
.layout {
  .header {
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-logo {
      font-size: 30px;
    }
    .header-user-info{

      display: flex;
      .el-dropdown-link {
        font-size: 18px;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--el-color-primary);
        .link-name {
          margin-right: 8px;
        }
      }
      .avatar{
        width: 60px;
        img{
          cursor: pointer;
          border-radius: 30px;
          width: 100%;
        }
      }
    }
  }

  .el-container-body {
    background-color: #545c64;
    height: calc(100vh - 60px);

    .left-aside {
      width: 220px;
      padding: 10px 5px;

      .post-btn {
        background: green;
        height: 40px;
        color: #fff;
        width: 100%;
        margin: 15px 15px 8px 0;
      }

      .el-menu {
        .sub-menu {
          padding-bottom: 20px;
          flex: 1;

          .sub-icon {
            font-size: 20px;
            margin-right: 20px;
          }

          .sub-title {

          }
          .sub-menu-link{
            text-decoration: none;
            color: white;
            font-size: 15px;
          }
          .link-active{
            color: #ffd04b;
          }
        }

      }
    }

    .right-main {
      background-color: #fff;
    }
  }
}

</style>