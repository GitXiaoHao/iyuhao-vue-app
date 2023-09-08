<template>
  <div class="layout">
    <!-- HTML !-->
    <button class="button-28" role="button"
            @click="showChangeDialog(true,DT.add)"
    >新增专题
    </button>
    <div class="main row">
      <div class="col-lg-7">
        <el-card shadow="hover" body-class="list"
                 header="标签"
        >
          <Table :columns="columns"
                 :show-pagination="true"
                 :data-source="tableData"
                 :fetch="loadDataList"
                 :options="tableOptions"
                 :init-fetch="false"
                 class="table"
                 @rowClick="rowClick"
          >
            <template #topLevel="{index,row}">
              <div v-if="row.articleTagParentId">否</div>
              <div v-else>是</div>
            </template>
            <template #disabled="{index,row}">
              <div v-if="row.articleTagDisable == 1"
                   style="color:red;"
              >是
              </div>
              <div v-else>否</div>
            </template>
            <template #create="{index,row}">
              <div v-if="row.articleTagCreateUserName">
                <div>创建人:{{row.articleTagCreateUserName}}</div>
                <div>创建时间:{{row.articleTagAddTime}}</div>
              </div>
            </template>
            <template #update="{index,row}">
              <div v-if="row.articleTagLastUpdateUserName">
                <div>修改人:{{row.articleTagLastUpdateUserName}}</div>
                <div>修改时间:{{row.articleTagUpdateTime}}</div>
              </div>
            </template>
            <template #op="{index,row}">
              <el-button type="success" @click="showChangeDialog(true,DT.update,row)">修改</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="warning" @click="deleteData(row)">删除</el-button>
            </template>
          </Table>
        </el-card>
      </div>
      <div class="col-lg-5 tree-main">
        <el-card shadow="hover" body-class="article"
                 header="标签列表"
                 class="row-cols-sm-1 article"
                 body-style="height:100%"
        >
          <el-empty description="点击行进行查看"
                    :image-size="100"
                    v-if="!dataSourceTree.length"
          />
          <div class="blog-tree" v-else>
            <el-tree
                :data="dataSourceTree"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
            >
              <template #default="{node,data}">
                <span class="custom-tree-node">
                    <span>{{ data.articleTag.articleTagName }}</span>
                    <span class="node-button">
                      <a @click="showChangeDialog(true,DT.update, data.articleTag)">修改</a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="deleteData( data.articleTag)">删除</a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="append(data.articleTag)">新增下级文章</a>
                    </span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-card>
      </div>
    </div>
  </div>

  <Dialog
      @showChangeDialog="showChangeDialog"
      :dialogVisible="articleTagDialog.dialogVisible"
      :title="articleTagDialog.title"
      :width="articleTagDialog.width"
      :buttons="articleTagDialog.buttons"
  >
    <el-form
        ref="articleTagDialogFormRuleFormRef"
        :model="articleTagDialogFormData"
        status-icon
        :rules="articleTagDialogFormRules"
        label-width="100px"
        label-position="left"
    >
      <el-form-item label="标签名称"
                    prop="articleTagName">
        <el-input v-model="articleTagDialogFormData.articleTagName"
                  placeholder="请输入标签名称"
                  type="text" autocomplete="off"/>
      </el-form-item>
      <el-form-item
          label="父级标签">
        <el-select v-model="articleTagDialogFormData.articleTagParentName">
          <el-option :label="item.articleTagName" v-for="item in listData"
            @change="parentChange"
                     :value="item.articleTagName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="blogCategoryTypeDisable">
        <el-radio-group v-model="articleTagDialogFormData.articleTagDisable">
          <el-radio :label="1">禁用</el-radio>
          <el-radio :label="0">不禁用</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
  </Dialog>
</template>

<script setup lang="ts">

import Table from "@/components/Table.vue";
import {nextTick, onMounted, reactive, ref} from "vue";
import {ColumnType, DataSourceType, OptionsType} from "@/types/table";
import {appearMessage, appearMessageBox} from "@/utils/elementUtils";
import {DialogType} from "@/types/dialog";
import Dialog from "@/components/Dialog.vue";
import {FormInstance, FormRules} from "element-plus";
import {ButtonType, DT,  MsgType} from "@/utils/constStr";
import {ArticleTag, ArticleTagListByPage} from "@/types/blog/articleTag";
import {
  addArticleTagApi,
  deleteArticleTagApi, getArticleTagListApi,
  getArticleTagListByPageApi, getArticleTagListByTreeApi,
  updateArticleTagApi
} from "@/apis/blog/articleTag";
import {useUserStore} from "@/store/modules/user";

const userStore = useUserStore()

const columns = reactive<ColumnType[]>(
    [
      {
        label: '名称',
        prop: 'articleTagName',
        width: 120,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '是否为顶级',
        prop: 'topLevel',
        align: 'center',
        width: 150,
        scopedSlots: 'topLevel'
      },
      {
        label: '是否被禁用',
        prop: 'disabled',
        align: 'center',
        width: 150,
        scopedSlots: 'disabled'
      },
      {
        label: '创建',
        prop: 'create',
        width: 250,
        align: 'center',
        scopedSlots: 'create'
      },
      {
        label: '修改',
        prop: 'update',
        width: 250,
        align: 'center',
        scopedSlots: 'update'
      },
      {
        label: '操作',
        prop: 'op',
        align: 'center',
        width: 200,
        scopedSlots: "op",
        fixed: 'right'
      },
    ]
)
const listData = reactive<Array<ArticleTag>>([])
const tableData = reactive<DataSourceType<ArticleTag>>(
    {
      records: [],
      total: 0,
      size: 0,
      current: 1,
    }
)
const loadDataList = () => {

}
const tableOptions = reactive<OptionsType>({
  border: false,
  stripe: true,
  extHeight: 900,
  showIndex: false,
  selectType: null
})


/**
 * 获取树形数据
 */
const getTreeData = async () => {
  const res: any = await getArticleTagListByTreeApi()
  if (res.code == 200) {
    dataSourceTree.length = 0
    dataSourceTree.push(...res.data)
  }
  console.log(res.data)
}
const getTableData = async (page: number = 1, pageSize: number = 5) => {
  const res: any = await getArticleTagListByPageApi(page, pageSize)
  if (res.code == 200) {
    Object.assign(tableData, res.data)
  } else {
    appearMessage.error('请求失败')
  }
}
const getListData = async () => {
  const res: any = await getArticleTagListApi()
  if (res.code == 200) {
    listData.length = 0
    listData.push(...res.data)
  } else {
    appearMessage.error('请求失败')
  }
}

const getData = async () => {
  await getTreeData()
  await getTableData()
  await getListData()
}
//新增的弹窗
const articleTagDialog = reactive<DialogType>({
  buttons: [
    {
      type: ButtonType.info,
      name: '返回',
      click() {
        //清除数据
        showChangeDialog(false)
      }
    },
    {
      type: ButtonType.primary,
      name: '添加',
      click: () => {
        submitForm(articleTagDialogFormRuleFormRef.value)
      }
    },
  ],
  dialogType: DT.add,
  dialogVisible: false,
  title: "新增专题",
  width: "50%",
})
const showChangeDialog = (visible: boolean = false, dialogType?: DT, row?: ArticleTag) => {
  if (dialogType) {
    if (dialogType == DT.update) {
      articleTagDialog.title = "修改标签"
      articleTagDialog.dialogType = DT.update
      if (row) {
        nextTick(() => {
          Object.assign(articleTagDialogFormData, row)
        })
      }
    } else if (dialogType == DT.add) {
      articleTagDialog.title = "新增标签"
      articleTagDialog.dialogType = DT.add
    }
  }
  if (!visible) {
    //清空
    resetForm(articleTagDialogFormRuleFormRef.value)
  }
  articleTagDialog.dialogVisible = visible
}



const articleTagDialogFormRuleFormRef = ref<FormInstance>()
const articleTagDialogFormData = reactive<ArticleTag>({})

const articleTagDialogFormRules = reactive<FormRules<typeof articleTagDialogFormData>>({
  articleTagName: {required: true, message: '请输入标签名称', trigger: 'blur'},
})

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) return false
  await formEl.validate(async (valid) => {
    if (valid) {
      //添加
      //修改parent id
      if(articleTagDialogFormData.articleTagParentName != null){
        //不等于空
        listData.forEach(item => {
          if(item.articleTagName == articleTagDialogFormData.articleTagParentName){
            articleTagDialogFormData.articleTagParentId = item.articleTagId
            return
          }
        })
      }
      let res
      const userinfo = userStore.getUserInfo
      if(articleTagDialog.dialogType == DT.add){
        articleTagDialogFormData.articleTagCreateUserId = userinfo.userId
        articleTagDialogFormData.articleTagCreateUserName = userinfo.userName
        res = await addArticleTagApi(articleTagDialogFormData)
      }else if(articleTagDialog.dialogType == DT.update){
        articleTagDialogFormData.articleTagLastUpdateUserId = userinfo.userId
        articleTagDialogFormData.articleTagLastUpdateUserName = userinfo.userName
        articleTagDialogFormData.articleTagUpdateTime = null
        res = await updateArticleTagApi(articleTagDialogFormData)
      }
      if (res.code == 200) {
        appearMessage.success("success")
        showChangeDialog(false)
        await getData()
      } else {
        appearMessage.error("fail")
      }
      return true
    } else {
      return false
    }
  })
}


function resetForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl?.resetFields()
  Object.keys(articleTagDialogFormData).forEach(key => articleTagDialogFormData[key] = null)
}


/**
 * 删除数据
 * @param row
 */
const deleteData = (row) => {
  appearMessageBox("您确定删除吗?", "提示", MsgType.error, '确认', '取消')
      .then(async () => {
        //删除
        const res: any = await deleteArticleTagApi(row)
        if (res.code == 200) {
          appearMessage.success(res.data)
          await getData()
        } else {
          appearMessage.error(res.message)
        }
      })
      .catch(() => {
        return
      })
}


const parentChange = (value) => {
  console.log(value)
  articleTagDialogFormData.articleTagParentName = value
}
//专题文章树
const blogSpecialArticleList = reactive([])
const rowClick = (row) => {
  //行点击

}
//获取专题文章
const loadBlogSpecialArticleList = () => {

}



const append = (data) => {
  console.log(data)
  //增加下级文章
  articleTagDialogFormData.articleTagParentId = data.articleTagId
  articleTagDialogFormData.articleTagParentName = data.articleTagName
  showChangeDialog(true,DT.add)
}


const dataSourceTree = reactive<ArticleTagListByPage[]>([])


onMounted(() => {
  //获取数据
  getData()
})

</script>

<style scoped lang="scss">
a {
  color: #6e9bc5 !important;
  cursor: pointer;
}

a:hover {
  color: #cb5c83 !important;
}

.layout {
  .table {
    //background-color: black;
    height: 100%;
    width: 100%;
  }

  .main {
    margin-top: 20px;

    .card-list {

    }

    .tree-main {
      overflow-y: auto;

      .article {
        overflow-y: auto;
        width: 100%;

        .blog-tree {
          .tree-title {
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
              margin-right: 25px;
            }
          }
        }
      }
    }
  }
}

/* CSS */
.button-28 {
  appearance: none;
  background-color: transparent;
  border: 2px solid #1A1A1A;
  border-radius: 15px;
  box-sizing: border-box;
  color: #3B3B3B;
  cursor: pointer;
  display: inline-block;
  font-family: Roobert, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
  margin: 0;
  min-height: 60px;
  min-width: 0;
  outline: none;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: 200px;
  will-change: transform;
}

.button-28:disabled {
  pointer-events: none;
}

.button-28:hover {
  color: #fff;
  background-color: #1A1A1A;
  box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
  transform: translateY(-2px);
}

.button-28:active {
  box-shadow: none;
  transform: translateY(0);
}


.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .node-button {
    display: flex;
  }
}
</style>