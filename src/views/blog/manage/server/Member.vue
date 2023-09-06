<script setup lang="ts">
import Table from "@/components/Table.vue";
import {onMounted, reactive, ref} from "vue";
import {
  MemberSearchDataType
} from "@/types/blog";

import {ColumnType, DataSourceType, OptionsType} from "@/types/table";
import Cover from "@/components/Cover.vue";
import {getMemberByPageApi} from "@/apis/user";
import {UserInfo} from "@/types/user";
//搜索部分
const addMemberStr = ref("新增账号")
const dialog = ref(false)

const searchFormData = reactive<MemberSearchDataType>({})

/**
 * 查找用户成员
 * @param page
 * @param pageSize
 */
const selectBlogListByPage = async (page: Number = 1, pageSize: Number = 5) => {
  const res: any = await getMemberByPageApi(page, pageSize, searchFormData)
  if (res.code == 200) {
    Object.assign(tableData, res.data)
  }
}
const search = () => {
  selectBlogListByPage()
}
const addBlog = () => {
  dialog.value = true
}
//表格内容
const tableData = reactive<DataSourceType<UserInfo>>({
  records: [
    {}
  ],
  total: 1,
  size: 1,
  current: 1,
})
const loadDataList = () => {

}
const tableOptions = reactive<OptionsType>({
  border: false,
  stripe: true,
  extHeight: 900,
  showIndex: false,
  selectType: null
})
//列表
const columns = reactive<ColumnType[]>(
    [
      {
        label: '头像',
        prop: 'userCover',
        width: 120,
        align: 'center',
        scopedSlots: "cover"
      },
      {
        label: '用户信息',
        prop: 'userInfo',
        width: 200,
        align: 'center',
        scopedSlots: "userInfo"
      },
      {
        label: '角色',
        prop: 'useRole',
        align: 'left',
        width: 100,
        scopedSlots: false
      },
      {
        label: '状态',
        prop: 'userStatus',
        width: 100,
        align: 'center',
        scopedSlots: 'userStatus'
      },
      {
        label: '时间',
        prop: 'time',
        align: 'center',
        width: 300,
        scopedSlots: 'time'
      },
      {
        label: '操作',
        prop: 'op',
        width: 250,
        align: 'center',
        scopedSlots: "op",
        fixed: 'right'
      }
    ]
)

const closeDrawer = () => {
  dialog.value = false
}
onMounted(() => {
  //博客状态
  // selectStatusList()
  //分类类型
  // selectCategoryList()
  //博客列表
  // selectBlogListByPage()
})

</script>

<template>
  <div class="member-body">
    <!--    查询框-->
    <div class="top-panel">
      <el-form
          :model="searchFormData"
          label-width="60px"
      >
        <div class="row">
          <div class="col-md-3">
            <el-form-item label="昵称">
              <el-input placeholder="支持模糊搜索" v-model="searchFormData.nameFuzzy"></el-input>
            </el-form-item>
          </div>
          <div class="col-md-3">
            <el-form-item label="手机号">
              <el-input placeholder="支持模糊搜索" v-model.number="searchFormData.phone"></el-input>
            </el-form-item>
          </div>
          <div class="col-md-1">
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
          <div class="col-md-2 offset-md-2 offset-sm-2">
            <el-button type="primary" @click="addBlog">{{ addMemberStr }}</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <Table :columns="columns"
           :show-pagination="true"
           :data-source="tableData"
           :fetch="loadDataList"
           :options="tableOptions"
           :init-fetch="false"
           class="admin-table"
    >
      <template #cover="{index,row}">
        <div class="cover" v-if="row.userCover">
          <Cover :cover="row.userCover"></Cover>
        </div>
      </template>
      <!--      文章信息-->
      <template #blogInfo="{index,row}">
        <div class="col">
          <div>昵称：{{ row.userName }}</div>
          <div>手机号：{{ row.blogCategoryName }}</div>
          <div>邮箱：{{ row.userPhone }}</div>
        </div>
      </template>
      <template #userStatus="{index,row}">
        <div class="col">
          {{row.userStatus}}
        </div>
      </template>
      <!--      文章时间-->
      <template #time="{index,row}">
        <div class="col">
          <div>创建时间：{{ row.userCreateTime }}</div>
          <div>最后登录时间：{{ row.userLastLoginTime }}</div>
        </div>
      </template>
      <template #op="{index,row}">
        <el-button type="success" @click="">修改</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="warning" @click="">禁用</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="danger" @click="">删除</el-button>
      </template>
    </Table>

  </div>
</template>


<style lang="scss">
.member-body {
  .admin-table {
    width: 100%;
    height: 100%;
  }

  .window {

  }
}
</style>