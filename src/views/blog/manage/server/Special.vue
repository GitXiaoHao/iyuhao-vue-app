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
                 :init-fetch="false"
                 class="special-table"
                 @rowClick="rowClick"
          >
            <template #cover="{index,row}">
              <div class="cover">
                <Cover :cover="row.blogCategoryCover"></Cover>
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
                    v-if="!dataSource.length"
          />
          <div class="special-blog-tree" v-else>
            <div class="tree-title">
                <span>
                  标题
                </span>
              <a>
                新增文章
              </a>
            </div>
            <el-tree
                :data="dataSource"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
            >
              <template #default="{node,data}">
                <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span class="node-button">
                      <a @click="remove(node, data)"> 预览 </a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="remove(node, data)">修改</a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="remove(node, data)">删除</a>
                      <el-divider direction="vertical"></el-divider>
                      <a @click="append(data)">新增下级文章</a>
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
              v-for="(item,index) in articleTags"
              :key="index"
              :label="item.value"
              :value="item.value"
              :disabled="item.disabled"
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
      total: 1,
      size: 1,
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
  nextTick(() => {
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
          Object.assign(specialDialogFormData, row)
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
  })
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
      const res: any = await updateSpecialApi(specialDialogFormData)
      if (res.code == 200) {
        appearMessage.success(res.data)
        coverUploadRef.value.dialogImageUrl = null
        deleteDialogData()
        await getTableData()
      } else {
        appearMessage.error(res.message)
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
  //标签
  articleTags.forEach(tag => tag.disabled = false)
  coverUploadFile.length = 0
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
const articleTags = reactive([
  {
    value: "12",
    disabled: true
  }, {
    value: "11s",
    disabled: false
  },
  {
    value: "13",
    disabled: false
  }
])

/***
 * 当选择了一个标签的时候
 * @param value
 */
const currentTagChange = (value) => {
  specialDialogFormData.articleTags?.push(value)
  currentTag.value = ""
  //设置为disable
  articleTags.forEach(tag => {
    if (tag.value == value) {
      tag.disabled = true
    }
  })
}
/**
 * 删除一个标签的时候
 * @param value
 */
const handleCloseTag = (value: string) => {
  articleTags.forEach(tag => {
    if (tag.value == value) {
      tag.disabled = false
    }
  })
  specialDialogFormData.articleTags.splice(specialDialogFormData.articleTags.indexOf(value), 1)
}


//专题文章树
const blogSpecialArticleList = reactive([])
const rowClick = (row) => {
  //行点击

}
//获取专题文章
const loadBlogSpecialArticleList = () => {

}


const treeProps = {
  children: 'children',
  label: 'title',
  value: 'blogId',
}
//树拖拽排序
const blogDrag = () => {

}
let id = 1000
const append = (data) => {
  const newChild = {id: id++, label: 'testtest', children: []}
  if (!data.children) {
    data.children = []
  }
  data.children.push(newChild)
  dataSource.value = [...dataSource.value]
}

const remove = (node: Node, data) => {
  const parent = node.parent
  const children: Tree[] = parent.data.children || parent.data
  const index = children.findIndex((d) => d.id === data.id)
  children.splice(index, 1)
  dataSource.value = [...dataSource.value]
}

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: 'Level one 1',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',
        children: [
          {
            id: 9,
            label: 'Level three 1-1-1',
          },
          {
            id: 10,
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Level one 2',
    children: [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 6,
        label: 'Level two 2-2',
      },
    ],
  },
  {
    id: 3,
    label: 'Level one 3',
    children: [
      {
        id: 7,
        label: 'Level two 3-1',
      },
      {
        id: 8,
        label: 'Level two 3-2',
      },
    ],
  },
])


onMounted(() => {
  //获取数据
  // getTableData()

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
  .node-button{
    display: flex;
  }
}
</style>