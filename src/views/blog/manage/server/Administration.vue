<script setup lang="ts">
import Table from "@/components/Table.vue";
import {nextTick, onMounted, reactive, ref} from "vue";
import {useBlogStore} from "@/store/modules/blog";
import {getCategoryList} from "@/apis/blog/category";
import {ColumnType, DataSourceType, OptionsType} from "@/types/table";
import Cover from "@/components/Cover.vue";
import {deleteArticleApi, getArticleByPage} from "@/apis/blog/article";
import {getStatusListApi} from "@/apis/blog/status";
import {DT, MsgType} from "@/utils/constStr";
import UpdateBlog from "@/views/blog/manage/server/components/UpdateBlog.vue";
import {AdministrationSearchDataType, AdministrationTableDataType} from "@/types/blog/administration";
import {BlogCategory} from "@/types/blog/category";
import {BlogArticleForm, ArticleType} from "@/types/blog/article";
import {BlogStatus} from "@/types/blog/status";
import {appearMessage, appearMessageBox} from "@/utils/elementUtils";
import {getSpecialListApi} from "@/apis/blog/special";
import {BlogSpecial} from "@/types/blog/special";
//搜索部分
const addBlogStr = ref("新增博客")
const blogTitle = ref("新增博客")
const dialog = ref(false)
const dialogType = ref(DT.add)
const blogArticleData = ref<BlogArticleForm>({})
const blogStore = useBlogStore()
const searchFormData = reactive<AdministrationSearchDataType>({})
const categoryList = ref<Array<BlogCategory>>(blogStore.getCategoryList)
const statusList = ref<Array<BlogStatus>>(blogStore.getStatusList)
const specialList = ref<Array<BlogSpecial>>(blogStore.getSpecialList)

const selectCategoryList = async () => {
  const res: any = await getCategoryList()
  if (res.code == 200) {
    blogStore.setCategoryList(res.data)
  }
}
const selectSpecialList = async () => {
  const res: any = await getSpecialListApi()
  if (res.code == 200) {
    blogStore.setSpecialList(res.data)
  }
}
const selectStatusList = async () => {
  const res: any = await getStatusListApi()
  if (res.code == 200) {
    blogStore.setStatusList(res.data)
  }
}
const selectBlogListByPage = async (page: Number = 1, pageSize: Number = 5) => {
  const res: any = await getArticleByPage(page, pageSize, searchFormData)
  if (res.code == 200) {
    Object.assign(tableData, res.data)
  }
}
const search = () => {
  selectBlogListByPage()
}
const addBlog = () => {
  dialog.value = true
  blogTitle.value = "新增博客"
  dialogType.value = DT.add
}
//表格内容
const tableData = reactive<DataSourceType<AdministrationTableDataType>>({
  records: [
    {}
  ],
  total: 0,
  size: 0,
  current: 1,
})
const loadDataList = async (page: Number, pageSize?: Number) => {
  await selectBlogListByPage(page, pageSize)
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
        label: '封面',
        prop: 'blogCategoryCover',
        width: 120,
        align: 'center',
        scopedSlots: "cover"
      },
      {
        label: '文章信息',
        prop: 'blogInfo',
        width: 200,
        align: 'center',
        scopedSlots: "blogInfo"
      },
      {
        label: '编辑器',
        prop: 'blogArticleEditorType',
        align: 'left',
        width: 100,
        scopedSlots: false
      },
      {
        label: '类型',
        prop: 'typeName',
        width: 300,
        align: 'center',
        scopedSlots: 'typeName'
      },
      {
        label: '专题',
        prop: 'blogSpecialName',
        width: 120,
        align: 'center',
        scopedSlots: 'blogSpecialName'
      },
      {
        label: '评论',
        prop: 'blogArticleAllowComment',
        align: 'center',
        width: 100,
        scopedSlots: 'comment'
      },
      {
        label: '状态',
        prop: 'status',
        align: 'center',
        width: 100,
        scopedSlots: 'status'
      },
      {
        label: '创建人',
        prop: 'userName',
        align: 'center',
        width: 100,
        scopedSlots: false
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

//文章操作
const updateArticle = (blogArticle: BlogArticleForm) => {
  dialogType.value = DT.update
  blogTitle.value = "修改博客"
  Object.assign(blogArticleData.value, blogArticle)
  nextTick(() => {
    dialog.value = true
  })
}
const deleteArticle = async (blogArticle) => {
  appearMessageBox("您确定要删除吗？", "提示", MsgType.error)
      .then(async () => {
        //删除
        const res: any = await deleteArticleApi(blogArticle)
        if (res.code == 200) {
          appearMessage.success("删除成功")
          await selectBlogListByPage()
        } else {
          appearMessage.error("删除失败")
        }
      }).catch(() => {
    return
  })
}

onMounted(async () => {
  //博客专题
  await selectSpecialList()
  //博客状态
  await selectStatusList()
  //分类类型
  await selectCategoryList()
  //博客列表
  await selectBlogListByPage()
})

</script>

<template>
  <div class="admin-body">
    <!--    查询框-->
    <div class="top-panel">
      <el-form
          :model="searchFormData"
          label-width="50px"
      >
        <div class="row">
          <div class="col-md-2">
            <el-form-item label="标题" prop="titleFuzzy">
              <el-input placeholder="请输入名称" v-model="searchFormData.titleFuzzy"></el-input>
            </el-form-item>
          </div>
          <div class="col-md-2">
            <el-form-item label="状态" prop="searchStatus">
              <el-select clearable placeholder="请选择状态" v-model="searchFormData.searchStatus">
                <el-option :label="status.blogStatusName"
                           :disabled="status.blogStatusDisable == 1"
                           :value="status.blogStatusName"
                           v-for="status in statusList"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-2">
            <el-form-item label="分类" prop="searchCategoryName">
              <el-select clearable placeholder="请选择分类" v-model="searchFormData.searchCategoryName">
                <el-option :label="category.blogCategoryName" :value="category.blogCategoryName"
                           v-for="category in categoryList"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-md-1">
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
          <div class="col-md-2 offset-md-2 offset-sm-2">
            <el-button type="primary" @click="addBlog">{{ addBlogStr }}</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <Table :columns="columns"
           :show-pagination="true"
           :data-source="tableData"
           :fetch="loadDataList"
           :options="tableOptions"
           :init-fetch="true"
           class="admin-table"
    >
      <template #cover="{index,row}">
        <div class="cover" v-if="row.blogArticleCover">
          <Cover :cover="row.blogArticleCover"></Cover>
        </div>
      </template>
      <!--      文章信息-->
      <template #blogInfo="{index,row}">
        <div class="col">
          <div>标题：{{ row.blogArticleTitle }}</div>
          <div>分类：{{ row.blogCategoryName }}</div>
          <div>作者：{{ row.userName }}</div>
        </div>
      </template>
      <!--      文章类型-->
      <template #typeName="{index,row}">
        <div class="col">
          <div>类型：{{ row.blogArticleType }}</div>
          <div v-if="row.blogArticleType == ArticleType.reprint">转载地址：<a
              :href="row.blogArticleReprintUrl">{{ row.blogArticleReprintUrl }}</a></div>
        </div>
      </template>
      <template #blogSpecialName="{index,row}">
        <template v-for="item in specialList">
          <div v-if="item.blogSpecialId == row.blogSpecialId">
            {{ item.blogSpecialName }}
          </div>
        </template>
      </template>
      <template #status="{index,row}">
        <template v-for="item in statusList">
          <div v-if="item.blogStatusName == row.blogStatusName"
               :style="{'color': item.blogStatusColor}"
          >
            {{ row.blogStatusName }}
          </div>
        </template>
      </template>
      <!--      文章评论-->
      <template #comment="{index,row}">
        <div class="col">
          <div>{{ row.blogArticleAllowComment === 1 ? "允许" : "禁止" }}</div>
        </div>
      </template>

      <!--      文章时间-->
      <template #time="{index,row}">
        <div class="col">
          <div>创建时间：{{ row.blogArticleAddTime }}</div>
          <div>更新时间：{{ row.blogArticleUpdateTime }}</div>
        </div>
      </template>
      <template #op="{index,row}">
        <el-button type="success" @click="updateArticle(row)">修改</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="warning" @click="deleteArticle(row)">删除</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" @click="" disabled>预览</el-button>
      </template>
    </Table>

    <UpdateBlog :title="blogTitle"
                v-if="dialog"
                @closeDrawer="closeDrawer"
                :type="dialogType"
                :blogArticleData="blogArticleData"
                @selectBlogListByPage="selectBlogListByPage"
    ></UpdateBlog>
  </div>
</template>


<style lang="scss">
.admin-body {
  .admin-table {
    width: 100%;
    height: 100%;
  }

  .window {

  }
}
</style>