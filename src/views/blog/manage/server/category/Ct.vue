<template>
  <div class="layout">
    <!-- HTML !-->
    <button class="button-86" role="button"
            @click="showChangeDialog(true,DT.add)"
    >新增分类类型
    </button>
    <Table :columns="columns"
           :show-pagination="true"
           :data-source="tableData"
           :fetch="loadDataList"
           :options="tableOptions"
           :init-fetch="true"
           class="table"
    >
      <template #disabled="{index,row}">
        <div v-if="row.blogCategoryTypeDisable == 1"
             style="color:red;"
        >是
        </div>
        <div v-else>否</div>
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
      :dialogVisible="ctDialog.dialogVisible"
      :title="ctDialog.title"
      :width="ctDialog.width"
      :buttons="ctDialog.buttons"
  >
    <el-form
        ref="ctDialogFormRuleFormRef"
        :model="ctDialogFormData"
        icon
        :rules="ctDialogFormRules"
        label-width="100px"
        label-position="left"
    >
      <el-form-item label="状态名称" prop="blogCategoryTypeName">
        <el-input placeholder="请输入状态名称"
                  v-model="ctDialogFormData.blogCategoryTypeName">
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="blogCategoryTypeDisable">
        <el-radio-group v-model="ctDialogFormData.blogCategoryTypeDisable">
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
import {ButtonType, DT, MsgType} from "@/utils/constStr";

import {CategoryType} from "@/types/blog/categoryType";
import {
  addCategoryTypeApi,
  deleteCategoryTypeApi,
  getCategoryTypeByPageApi,
  updateCategoryTypeApi
} from "@/apis/blog/categoryType";
import {useUserStore} from "@/store/modules/user";


const userStore = useUserStore()
const columns = reactive<ColumnType[]>(
    [
      {
        label: '名称',
        prop: 'blogCategoryTypeName',
        width: 120,
        align: 'center',
        fixed: 'left',
        scopedSlots: false
      },
      {
        label: '禁用',
        prop: 'blogCategoryTypeDisable',
        width: 200,
        align: 'center',
        scopedSlots: 'disabled'
      },
      {
        label: '创建人',
        prop: 'blogCategoryCreateUserName',
        width: 200,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '修改人',
        prop: 'blogCategoryLastUpdateUserName',
        width: 200,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '添加时间',
        prop: 'blogCategoryTypeAddTime',
        width: 200,
        align: 'center',
        scopedSlots: false
      },

      {
        label: '更新时间',
        prop: 'blogCategoryTypeUpdateTime',
        width: 200,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '操作',
        prop: 'op',
        align: 'center',
        fixed: "right",
        width: 200,
        scopedSlots: "op"
      },
    ]
)

const tableData = reactive<DataSourceType<CategoryType>>(
    {
      records: [],
      total: 1,
      size: 1,
      current: 1,
    }
)
const loadDataList = async (page:Number,pageSize?:Number) => {
  await getTableData(page,pageSize)
}
const tableOptions = reactive<OptionsType>({
  border: false,
  stripe: true,
  extHeight: 900,
  showIndex: false,
  selectType: null,
})

const getTableData = async (page: Number = 1, pageSize: Number = 5) => {
  const res: any = await getCategoryTypeByPageApi(page, pageSize)
  if (res.code == 200) {
    Object.assign(tableData, res.data)
  }
}


//新增的弹窗
const ctDialog = reactive<DialogType>({
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
        //添加数据
        submitForm(ctDialogFormRuleFormRef.value)
      }
    },
  ],
  dialogType: DT.add,
  dialogVisible: false,
  title: "新增分类类型",
  width: "50%",
})


const showChangeDialog = (visible: boolean = false, dialogType?: DT, row?: CategoryType) => {
  if (dialogType) {
    if (dialogType == DT.update) {
      ctDialog.title = "修改状态"
      ctDialog.dialogType = DT.update
      if (row) {
        nextTick(() => {
          Object.assign(ctDialogFormData, row)
        })
      }
    } else if (dialogType == DT.add) {
      ctDialog.title = "新增状态"
      ctDialog.dialogType = DT.add
    }
  }
  if (!visible) {
    //清空
    resetForm(ctDialogFormRuleFormRef.value)
  }
  ctDialog.dialogVisible = visible
}


const ctDialogFormRuleFormRef = ref<FormInstance>()
const ctDialogFormData = reactive<CategoryType>({
})
const ctDialogFormRules = reactive<FormRules<typeof ctDialogFormData>>({
  blogCategoryTypeName: {required: true, message: "请输入名称", trigger: 'blur'},
  blogCategoryTypeDisable: [{required: true, message: "请选择是否禁用", trigger: 'blur'},],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false
  await formEl.validate(async (valid) => {
    if (valid) {
      //添加
      let res
      let info = userStore.getUserInfo
      if (ctDialog.dialogType == DT.add) {
        if(info.userId && info.userName){
          ctDialogFormData.blogCategoryCreateUserId = info.userId
          ctDialogFormData.blogCategoryCreateUserName = info.userName
        }
        res = await addCategoryTypeApi(ctDialogFormData)
      } else if (ctDialog.dialogType == DT.update) {
        //修改
        if(info.userId && info.userName) {
          ctDialogFormData.blogCategoryLastUpdateUserId = info.userId
          ctDialogFormData.blogCategoryLastUpdateUserName = info.userName
        }
        res = await updateCategoryTypeApi(ctDialogFormData)
      }
      if (res.code == 200) {
        appearMessage.success("success")
        showChangeDialog(false)
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
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  Object.keys(ctDialogFormData).forEach(key => ctDialogFormData[key] = null)
}


/**
 * 删除数据
 * @param row
 */
const deleteData = (row) => {
  appearMessageBox("您确定删除吗?", "提示", MsgType.error, '确认', '取消')
      .then(async () => {
        //删除
        const res: any = await deleteCategoryTypeApi(row)
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

onMounted(() => {
  //获取数据
  getTableData()
})

</script>

<style scoped lang="scss">
.layout {
  .table {
    //background-color: black;
    height: 100%;
    width: 100%;

    .color-show {
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      .show-main {
        display: flex;
        width: 20px;
        height: 20px;
      }
    }
  }
}


/* CSS */
.button-86 {
  all: unset;
  width: 100px;
  height: 30px;
  font-size: 16px;
  background: transparent;
  border: none;
  position: relative;
  color: #f0f0f0;
  cursor: pointer;
  z-index: 1;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-86::after,
.button-86::before {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: -99999;
  transition: all .4s;
}

.button-86::before {
  transform: translate(0%, 0%);
  width: 100%;
  height: 100%;
  background: #28282d;
  border-radius: 10px;
}

.button-86::after {
  transform: translate(10px, 10px);
  width: 35px;
  height: 35px;
  background: #ffffff15;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 50px;
}

.button-86:hover::before {
  transform: translate(5%, 20%);
  width: 110%;
  height: 110%;
}

.button-86:hover::after {
  border-radius: 10px;
  transform: translate(0, 0);
  width: 100%;
  height: 100%;
}

.button-86:active::after {
  transition: 0s;
  transform: translate(0, 5%);
}


.color-main {
  display: flex;
  align-items: center;

  .color-div {
    display: flex;
    align-items: center;
  }
}
</style>