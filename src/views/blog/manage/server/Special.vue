<template>
  <div class="special-layout">
    <!-- HTML !-->
    <button class="button-28" role="button"
            @click="showChangeDialog(true,DT.add)"
    >新增专题
    </button>
    <div class="special-main row">
      <div class="col-lg-7">
        <el-card shadow="hover" body-class="special-list"
                 header="专题"
        >
          <Table :columns="columns"
                 :show-pagination="true"
                 :data-source="tableData"
                 :fetch="loadDataList"
                 :options="tableOptions"
                 :init-fetch="true"
                 class="special-table"
                 @rowClick="rowClick"
          >
            <template #cover="{index,row}">
              <div class="cover">
                <Cover :cover="row.blogSpecialCover"></Cover>
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
      <div class="col-lg-5 special-tree-main">
        <el-card shadow="hover" body-class="special-article"
                 header="专题文章"
                 class="row-cols-sm-1 special-article"
                 body-style="height:100%"
        >
          <el-empty description="点击行进行查看"
                    :image-size="100"
                    v-if="!blogArticleListByTree.length"
          />
          <div class="special-blog-tree" v-else>
            <div class="tree-title">
                <span>
                  {{rowSpecial.blogSpecialName}}
                </span>
              <a @click="addArticle">
                新增文章
              </a>
            </div>
            <el-tree
                :data="blogArticleListByTree"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
            >
              <template #default="{node,data}">
                <span class="custom-tree-node">
                    <span>{{ data.blogArticleTitle }}</span>
                    <span class="node-button">
                      <a @click="" disabled>预览</a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="update(data)">修改</a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="remove(data)">删除</a>
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
      :dialogVisible="specialDialog.dialogVisible"
      :title="specialDialog.title"
      :width="specialDialog.width"
      :buttons="specialDialog.buttons"
  >
    <el-form
        ref="specialDialogFormRuleFormRef"
        :model="specialDialogFormData"
        status-icon
        :rules="specialDialogFormRules"
        label-width="100px"
        label-position="left"
    >
      <el-form-item label="专题名称"
                    prop="blogSpecialName">
        <el-input v-model="specialDialogFormData.blogSpecialName"
                  placeholder="请输入专题名称"
                  type="text" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="封面"
                    prop="blogSpecialCover">
        <CoverUpload ref="coverUploadRef"
                     :files="coverUploadFile"
                     :dialogType="specialDialog.dialogType"
        ></CoverUpload>
      </el-form-item>
      <el-form-item label="专题标签" prop="articleTags">
        <el-tag
            v-for="tag in specialDialogFormData.articleTags"
            :key="tag"
            class="mx-1"
            closable
            :disable-transitions="false"
            @close="handleCloseTag(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-select
            v-model="currentTag"
            filterable
            @change="currentTagChange"
            placeholder="+添加专题标签">
          <el-option
              v-for="(item,index) in articleTagsByList"
              :key="index"
              :label="item.articleTagName"
              :value="item.articleTagName"
              :disabled="item.articleTagDisable == 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item
          label="简介"
          prop="blogSpecialBriefIntroduction">
        <el-input
            v-model="specialDialogFormData.blogSpecialBriefIntroduction"
            type="textarea"
            show-word-limit
            maxlength="250"
            :autosize="{maxRows:4,minRows:4}"></el-input>
      </el-form-item>

    </el-form>
  </Dialog>


  <UpdateBlog :title="blogStr"
              v-if="dialog"
              @closeDrawer="closeDrawer"
              :type="dialogType"
              :blogArticleData="blogArticleData"
              @selectBlogListByPage="selectBlogArticleListByTree"
  ></UpdateBlog>

</template>

<script setup lang="ts">

import Table from "@/components/Table.vue";
import {nextTick, onMounted, reactive, ref} from "vue";
import {ColumnType, DataSourceType, OptionsType} from "@/types/table";
import {appearMessage, appearMessageBox} from "@/utils/elementUtils";
import Cover from "@/components/Cover.vue";
import {DialogType} from "@/types/dialog";
import Dialog from "@/components/Dialog.vue";
import {FormInstance, FormRules} from "element-plus";
import CoverUpload from "@/components/CoverUpload.vue";
import {ButtonType, DT, globalInfo, MsgType} from "@/utils/constStr";
import {deleteSpecialApi, getSpecialListByPageApi, updateSpecialApi} from "@/apis/blog/special";
import {BlogSpecial} from "@/types/blog/special";
import {ArticleTag} from "@/types/blog/articleTag";
import {getArticleTagListApi} from "@/apis/blog/articleTag";
import {useUserStore} from "@/store/modules/user";
import {BlogArticleForm} from "@/types/blog/article";
import {deleteArticleApi, getArticle4SpecialApi, getArticleByPage} from "@/apis/blog/article";
import UpdateBlog from "@/views/blog/manage/server/components/UpdateBlog.vue";

const userStore = useUserStore()
const columns = reactive<ColumnType[]>(
    [
      {
        label: '封面',
        prop: 'blogSpecialCover',
        width: 120,
        align: 'center',
        scopedSlots: "cover"
      },
      {
        label: '名称',
        prop: 'blogSpecialName',
        width: 120,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '简介',
        prop: 'blogSpecialBriefIntroduction',
        align: 'left',
        width: 350,
        scopedSlots: false
      },
      {
        label: '博客数量',
        prop: 'blogSpecialEssayCount',
        width: 100,
        align: 'center',
        scopedSlots: false
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

const tableData = reactive<DataSourceType<BlogSpecial>>(
    {
      records: [],
      total: 0,
      size: 0,
      current: 1,
    }
)
const loadDataList = (page:Number, pageSize:Number) => {
  getTableData(page,pageSize)
}
const tableOptions = reactive<OptionsType>({
  border: false,
  stripe: true,
  extHeight: 900,
  showIndex: false,
  selectType: null
})

const getTableData = async (page: number = 1, pageSize: number = 5) => {
  const res: any = await getSpecialListByPageApi(page, pageSize)
  if (res.code == 200) {
    Object.assign(tableData, res.data)
  } else {
    appearMessage.error('请求失败')
  }
}

const coverUploadRef = ref(null)
const coverUploadFile = reactive([])

//新增的弹窗
const specialDialog = reactive<DialogType>({
  buttons: [
    {
      type: ButtonType.info,
      name: '返回',
      click() {
        //清除数据
        deleteDialogData()
      }
    },
    {
      type: ButtonType.warning,
      name: '清空',
      click: () => {
        //清空数据
        coverUploadRef.value.deletePic()
        resetForm(specialDialogFormRuleFormRef.value)
      }
    },
    {
      type: ButtonType.primary,
      name: '添加',
      click: () => {
        //添加数据
        const url = coverUploadRef.value.dialogImageUrl
        if (url) {
          specialDialogFormData.blogSpecialCover = url
        }
        submitForm(specialDialogFormRuleFormRef.value)
      }
    },
  ],
  dialogType: DT.add,
  dialogVisible: false,
  title: "新增专题",
  width: "50%",
})
const deleteDialogData = () => {
  coverUploadRef.value.deletePic()
  showChangeDialog(false)
}
const showChangeDialog = (visible: boolean = false, dialogType?: DT, row?: BlogSpecial) => {

  if (dialogType) {
    if (dialogType == DT.update) {
      specialDialog.title = "修改专题"
      specialDialog.dialogType = DT.update
      if (row) {
        coverUploadFile.length = 0
        coverUploadFile.push({
          url: globalInfo.imageUrl + row.blogSpecialCover,
          name: row.blogSpecialName
        })
        nextTick(() => {
          Object.assign(specialDialogFormData, row)
        })
      }
    } else if (dialogType == DT.add) {
      specialDialog.title = "新增专题"
      specialDialog.dialogType = DT.add
    }
  }
  if (!visible) {
    //清空
    resetForm(specialDialogFormRuleFormRef.value)
  }

  specialDialog.dialogVisible = visible
}

const validateTags = (rule: any, value: any, callback: any) => {
  if (specialDialogFormData.articleTags?.length == 0) {
    callback(new Error('请选择标签'))
  }
  callback()
}

const specialDialogFormRuleFormRef = ref<FormInstance>()
const specialDialogFormData = reactive<BlogSpecial>({
  articleTags: [],
  blogSpecialBriefIntroduction: "",
  blogSpecialCover: "",
  blogSpecialName: ""
})

const specialDialogFormRules = reactive<FormRules<typeof specialDialogFormData>>({
  blogSpecialCover: {required: true, message: "请上传封面", trigger: 'blur'},
  blogSpecialBriefIntroduction: [
    {required: true, message: "请填写简介", trigger: 'blur'},
    {max: 250, message: '字数不能超过250个字', trigger: 'blur'}
  ],
  blogSpecialName: {required: true, message: '请输入专题名称', trigger: 'blur'},
  articleTags: {required: true, validator: validateTags, trigger: 'blur'},

})

async function submitForm(formEl: FormInstance | undefined) {
  if (!formEl) return false
  await formEl.validate(async (valid) => {
    if (valid) {
      //添加
      let res: any
      const userinfo = userStore.getUserInfo
      if(specialDialog.dialogType == DT.add){
        if (userinfo.userId && userinfo.userName) {
          specialDialogFormData.userId = userinfo.userId
          specialDialogFormData.userName = userinfo.userName
        }
      }else if(specialDialog.dialogType == DT.update){
        if (userinfo.userId && userinfo.userName) {
          specialDialogFormData.blogSpecialLastUpdateUserId = userinfo.userId
          specialDialogFormData.blogSpecialLastUpdateUserName = userinfo.userName
        }
        specialDialogFormData.blogSpecialUpdateTime = null
      }
      res = await updateSpecialApi(specialDialogFormData)
      if (res.code == 200) {
        appearMessage.success("添加成功")
        coverUploadRef.value.dialogImageUrl = null
        deleteDialogData()
        await getTableData()
      } else {
        appearMessage.error(res.message)
      }
    } else {
      return false
    }
  })
}


function resetForm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl?.resetFields()
  //标签
  articleTagsByList.forEach(tag => tag.articleTagDisable = 0)
  coverUploadFile.length = 0
  Object.keys(specialDialogFormData).forEach(key => specialDialogFormData[key] = null)
}



/**
 * 删除数据
 * @param row
 */
const deleteData = (row) => {
  appearMessageBox("您确定删除吗?", "提示", MsgType.error, '确认', '取消')
      .then(async () => {
        //删除
        const res: any = await deleteSpecialApi(row)
        if (res.code == 200) {
          appearMessage.success(res.data)
          await getTableData()
        } else {
          appearMessage.error(res.message)
        }
      })
      .catch(() => {
        return
      })
}

//标签
const currentTag = ref("")
const articleTagsByList = reactive<ArticleTag[]>([])

/***
 * 当选择了一个标签的时候
 * @param value
 */
const currentTagChange = (value) => {
  if(!specialDialogFormData.articleTags){
    specialDialogFormData.articleTags = []
  }
  specialDialogFormData.articleTags.push(value)
  currentTag.value = ""
  //设置为disable
  articleTagsByList.forEach(tag => {
    if (tag.articleTagName == value) {
      tag.articleTagDisable = 1
    }
  })
}
/**
 * 删除一个标签的时候
 * @param value
 */
const handleCloseTag = (value: string) => {
  articleTagsByList.forEach(tag => {
    if (tag.articleTagName == value) {
      tag.articleTagDisable = 0
    }
  })
  specialDialogFormData.articleTags.splice(specialDialogFormData.articleTags.indexOf(value), 1)
}


//专题文章树
const blogArticleListByTree = reactive<BlogArticleForm[]>([])
const addArticle = () => {
  dialogType.value = DT.add
  Object.keys(blogArticleData).forEach(key => blogArticleData[key] = null)
  dialog.value = true
}
const rowClick = async (row: BlogSpecial) => {
  //保存row
  Object.assign(rowSpecial,row)
  //行点击
  //树形 获得专题下的所有文章
  if (row.blogSpecialId != null) {
    const res: any = await getArticle4SpecialApi(row.blogSpecialId)
    if(res.code == 200){
      blogArticleListByTree.length = 0
      blogArticleListByTree.push(...res.data)
    }
  }
}

const update = (data:BlogArticleForm) => {
  dialogType.value = DT.update
  Object.assign(blogArticleData,data)
  dialog.value = true
}

const remove = (data:BlogArticleForm) => {
  appearMessageBox("您确定要删除吗？", "提示", MsgType.error)
      .then(async () => {
        //删除
        const res: any = await deleteArticleApi(data)
        if (res.code == 200) {
          appearMessage.success("删除成功")
          await rowClick(rowSpecial)
        } else {
          appearMessage.error("删除失败")
        }
      }).catch(() => {
    return
  })
}

//树的操作
const blogArticleData = reactive<BlogArticleForm>({})
const rowSpecial = reactive<BlogSpecial>({})
const blogStr = ref("修改文章")
const dialog = ref(false)
const dialogType = ref(DT.add)
const closeDrawer = () => {
  dialog.value = false
}
const selectBlogArticleListByTree = async () => {
  await rowClick(rowSpecial)
}



const getArticleTagListData =async () => {
  const res: any = await getArticleTagListApi()
  if (res.code == 200) {
    articleTagsByList.length = 0
    articleTagsByList.push(...res.data)
  }
}
const getData = async () => {
  //标签列表
  await getArticleTagListData()
}

onMounted(() => {
  //获取数据
  // getTableData()
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

.special-layout {
  .special-table {
    //background-color: black;
    height: 100%;
    width: 100%;
  }

  .special-main {
    margin-top: 20px;

    .card-list {

    }

    .special-tree-main {
      overflow-y: auto;

      .special-article {
        overflow-y: auto;
        width: 100%;

        .special-blog-tree {
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