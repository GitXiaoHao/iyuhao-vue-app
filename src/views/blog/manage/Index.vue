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
          <div class="avatar">
            <el-avatar :size="50" :src="globalInfo.imageUrl +userInfo.userCover"></el-avatar>
          </div>
        </div>
      </el-header>
      <el-container class="el-container-body">
        <el-aside width="collapse" class="left-aside">
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
              <el-sub-menu :index="menuItem.id"
                           v-for="(menuItem) in menuList"
                           :disabled="menuItem.disabled"
                           class="sub-menu">
                <template #title>
                  <span :class="'iconfont ' + menuItem.icon" class="sub-icon"></span>
                  <span class="sub-title">{{ menuItem.title }}</span>
                </template>
                <el-menu-item-group >
                  <el-menu-item :index="menuChildrenItem.id"
                                v-for="(menuChildrenItem) in menuItem.children"
                                :disabled="menuChildrenItem.disabled || false">
                    <RouterLink class="sub-menu-link"
                                :to="menuChildrenItem.path"
                    >{{ menuChildrenItem.title }}</RouterLink>
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
import {ArrowDown, Delete, InfoFilled,} from '@element-plus/icons-vue'
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {useUserStore} from "@/store/modules/user";
import {useBlogStore} from "@/store/modules/blog";
import {globalInfo, userMenu} from "@/utils/constStr";
import {useRoute, useRouter} from "vue-router";
import {UserInfo} from "@/types/user";

const userInfo = reactive<UserInfo>({
  userName: null,
  userCover: null,
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
        disabled: false,
        path: '/administration',
      },

    ],
  },
  {
    id: '127',
    title: '分类',
    icon: 'icon-grouping',
    disabled: false,
    children: [
      {
        id: '1271',
        disabled: false,
        title: '分类管理',
        path: '/category',
      },
      {
        id: '1272',
        disabled: false,
        title: '分类类型',
        path: '/ct',
      }
    ]
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
        path: '/special',
      },
      {
        id: '1242',
        title: '状态管理',
        path: '/status',
      },
      {
        id: '1243',
        title: '标签管理',
        path: '/label',
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
        disabled: false,
        title: '个人信息',
        path: '/userInformation',
      },
      {
        id: '1252',
        disabled: true,
        title: '博客成员',
        path: '/member',
      },
      {
        id: '1253',
        disabled: true,
        title: '系统设置',
        path: '/member',
      },
    ],
  },
  {
    id: '126',
    title: '回收站',
    icon: 'icon-huishouzhan',
    disabled: true,
    children: [
      {
        id: '126',
        disabled: true,
        title: '分类',
        path: '/crb'
      }
    ]
  }
])
const exit =() => {
  userStore.setUserInfo({})
  userStore.setToken('')
  //跳转登录页
  router.push("/login")
}


const handleCommand = (command: string | number | object | userMenu) => {
  //点击下拉菜单
  if(command == userMenu.information){
    router.push('/userInformation')
  }else if(command == userMenu.exit){
    //退出
    exit()
  }
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
  Object.assign(userInfo,userStore.getUserInfo)
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
        margin: 8px;
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
.is-active{

}
.active{
  color: #f6e58d !important;
}
</style>