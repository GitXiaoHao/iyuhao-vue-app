<template>
  <div class="category-layout">
    <!-- HTML !-->
    <button class="button-89" role="button"
            @click="showChangeDialog(true,DT.add)"
    >新增分类
    </button>
    <Table :columns="columns"
           :show-pagination="true"
           :data-source="tableData"
           :fetch="loadDataList"
           :options="tableOptions"
           :init-fetch="false"
           class="category-table"
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
  </div>

  <Dialog
      @showChangeDialog="showChangeDialog"
      :dialogVisible="categoryDialog.dialogVisible"
      :title="categoryDialog.title"
      :width="categoryDialog.width"
      :buttons="categoryDialog.buttons"
  >
    <el-form
        :ref="categoryDialogForm.categoryDialogFormRuleFormRef"
        :model="categoryDialogForm.categoryDialogFormData"
        status-icon
        :rules="categoryDialogForm.categoryDialogFormRules"
        label-width="100px"
        label-position="left"
    >
      <el-form-item label="分类名称"
                    prop="blogCategoryName">
        <el-input v-model="categoryDialogForm.categoryDialogFormData.blogCategoryName"
                  placeholder="请输入分类名称"
                  type="text" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="封面"
                    prop="blogCategoryCover">
        <CoverUpload ref="coverUploadRef"
                     :files="coverUploadFile"
                     :dialogType="categoryDialog.dialogType"
        ></CoverUpload>
      </el-form-item>
      <el-form-item label="分类类型" prop="blogCategoryType">
        <el-select v-model="categoryDialogForm.categoryDialogFormData.blogCategoryType" placeholder="分类类型">
          <el-option label="Zone one" value="shanghai"/>
          <el-option label="Zone two" value="beijing"/>
        </el-select>
      </el-form-item>
      <el-form-item
          label="简介"
          prop="blogCategoryDesc">
        <el-input
            v-model="categoryDialogForm.categoryDialogFormData.blogCategoryDesc"
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
import {addCategory, deleteCategory, getCategory} from "@/apis/blog/category";
import {appearMessage, appearMessageBox} from "@/utils/elementUtils";
import Cover from "@/components/Cover.vue";
import { DialogType} from "@/types/dialog";
import Dialog from "@/components/Dialog.vue";
import {FormInstance, FormRules} from "element-plus";
import {BlogCategory, ButtonType, DT} from "@/types/blog";
import CoverUpload from "@/components/CoverUpload.vue";
import {globalInfo, MsgType} from "@/utils/constStr";

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
        label: '名称',
        prop: 'blogCategoryName',
        width: 120,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '简介',
        prop: 'blogCategoryDesc',
        align: 'left',
        width: 350,
        scopedSlots: false
      },
      {
        label: '博客数量',
        prop: 'blogCategoryEssayCount',
        width: 100,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '操作',
        prop: 'op',
        align: 'center',
        scopedSlots: "op"
      },
    ]
)

const tableData = reactive<DataSourceType<BlogCategory>>(
    {
      records: [

      ],
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
  selectType: "checkbox"
})

const getTableData = async (page: number = 1, pageSize: number = 5) => {
  const res: any = await getCategory(page, pageSize)
  if (res.code == 200) {
    Object.assign(tableData, res.data)
  } else {
    appearMessage.error('请求失败')
  }
}

const coverUploadRef = ref(null)
const coverUploadFile = reactive([])

//新增的弹窗
const categoryDialog = reactive<DialogType>({
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
        categoryDialogForm.resetForm(categoryDialogForm.categoryDialogFormRuleFormRef.value)
      }
    },
    {
      type: ButtonType.primary,
      name: '添加',
      click: () => {
        //添加数据
        const url = coverUploadRef.value.dialogImageUrl
        if(url){
          categoryDialogForm.categoryDialogFormData.blogCategoryCover = url
        }
        const res = categoryDialogForm.submitForm(categoryDialogForm.categoryDialogFormRuleFormRef.value)

      }
    },
  ],
  dialogType: DT.add,
  dialogVisible: false,
  title: "新增分类",
  width: "50%",
})
const deleteDialogData = () => {
  coverUploadRef.value.deletePic()
  showChangeDialog(false)
}
const showChangeDialog = (visible: boolean = false, dialogType?: DT, row?: BlogCategory) => {
  nextTick(() => {
    if (dialogType) {
      if (dialogType == DT.update) {
        categoryDialog.title = "修改分类"
        categoryDialog.dialogType = DT.update
        if (row) {
          coverUploadFile.length = 0
          coverUploadFile.push({
            url: globalInfo.imageUrl + row.blogCategoryCover,
            name: row.blogCategoryName
          })
          Object.assign(categoryDialogForm.categoryDialogFormData, row)
        }
      } else if (dialogType == DT.add) {
        categoryDialog.title = "新增分类"
        categoryDialog.dialogType = DT.add
      }
    }
    if (!visible) {
      //清空
      categoryDialogForm.resetForm(categoryDialogForm.categoryDialogFormRuleFormRef.value)
    }
  })
  categoryDialog.dialogVisible = visible
}


const categoryDialogForm = {
  categoryDialogFormRuleFormRef: ref<FormInstance>(),
  categoryDialogFormData: reactive<BlogCategory>({
    blogCategoryCover: "",
    blogCategoryDesc: "",
    blogCategoryName: "",
    blogCategoryType: "",
    userId: ""
  }),

  categoryDialogFormRules: reactive<FormRules<typeof this.categoryDialogFormData>>({
    blogCategoryCover: {required: true, message: "请上传封面", trigger: 'blur'},
    blogCategoryDesc: [
      {required: true, message: "请填写简介", trigger: 'blur'},
      {max: 250, message: '字数不能超过250个字', trigger: 'blur'}
    ],
    blogCategoryName: {required: true, message: '请输入分类名称', trigger: 'blur'},
    blogCategoryType: {required: true, message: '请选择分类类型', trigger: 'blur'},
  }),
  async submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return false
    await formEl.validate( async (valid) => {
      if (valid) {
        //添加
        const res:any = await addCategory(this.categoryDialogFormData)
        if (res.code == 200) {
          appearMessage.success(res.data)
          coverUploadRef.value.dialogImageUrl = null
          deleteDialogData()
          await getTableData()
        }else{
          appearMessage.error(res.message)
        }
        return true
      } else {
        return false
      }
    })
  },
  resetForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
    coverUploadFile.length = 0
  },
}



/**
 * 删除数据
 * @param row
 */
const deleteData =(row) => {
  appearMessageBox("您确定删除吗?", "提示", MsgType.error, '确认', '取消')
      .then(async () => {
        //删除
        const res:any = await deleteCategory(row)
        if(res.code == 200) {
          appearMessage.success(res.data)
          await getTableData()
        }else{
          appearMessage.error(res.message)
        }
      })
      .catch(() => {
        return
      })
}

onMounted(() => {
  //获取数据
  getTableData()

})

</script>

<style scoped lang="scss">
.category-layout {
  .category-table {
    //background-color: black;
    height: 100%;
    width: 100%;
  }
}

/* CSS */
.button-89 {
  --b: 3px; /* border thickness */
  --s: .45em; /* size of the corner */
  --color: #373B44;

  padding: calc(.5em + var(--s)) calc(.9em + var(--s));
  color: var(--color);
  --_p: var(--s);
  background: conic-gradient(from 90deg at var(--b) var(--b), #0000 90deg, var(--color) 0) var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2 * var(--_p));
  transition: .3s linear, color 0s, background-color 0s;
  outline: var(--b) solid #0000;
  outline-offset: .6em;
  font-size: 16px;

  border: 0;

  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-89:hover,
.button-89:focus-visible {
  --_p: 0px;
  outline-color: var(--color);
  outline-offset: .05em;
}

.button-89:active {
  background: var(--color);
  color: #fff;
}
</style>