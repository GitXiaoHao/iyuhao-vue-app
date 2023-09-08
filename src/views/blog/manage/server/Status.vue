<template>
  <div class="status-layout">
    <!-- HTML !-->
    <button class="button-86" role="button"
            @click="showChangeDialog(true,DT.add)"
    >新增状态
    </button>
    <Table :columns="columns"
           :show-pagination="true"
           :data-source="tableData"
           :fetch="loadDataList"
           :options="tableOptions"
           :init-fetch="true"
           class="status-table"
    >
      <template #name="{index,row}">
        <div :style="{'color' : row.blogStatusColor}">
          {{ row.blogStatusName }}
        </div>
      </template>
      <template #color="{index,row}">
        <div class="color-show">
          <div :style="{'background-color' : row.blogStatusColor,}" class="show-main"></div>
        </div>
      </template>
      <template #disabled="{index,row}">
        <div v-if="row.blogStatusDisable == 1"
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
      :dialogVisible="statusDialog.dialogVisible"
      :title="statusDialog.title"
      :width="statusDialog.width"
      :buttons="statusDialog.buttons"
  >
    <el-form
        ref="statusDialogFormRuleFormRef"
        :model="statusDialogFormData"
        status-icon
        :rules="statusDialogFormRules"
        label-width="100px"
        label-position="left"
    >
      <el-form-item label="状态名称" prop="blogStatusName">
        <el-input placeholder="请输入状态名称"
                  v-model="statusDialogFormData.blogStatusName">
        </el-input>
      </el-form-item>
      <el-form-item label="状态颜色" prop="blogStatusColor" class="color-main">
        <div class="color-div">
          <div>
            {{ statusDialogFormData.blogStatusColor }}
          </div>
          <el-color-picker v-model="statusDialogFormData.blogStatusColor"
                           show-alpha :predefine="predefineColors"
                           size="large"
                           color-format="rgb"
          />
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="blogStatusDisable">
        <el-radio-group v-model="statusDialogFormData.blogStatusDisable">
          <el-radio label="1">禁用</el-radio>
          <el-radio label="0">不禁用</el-radio>
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
import {ButtonType, DT, MsgType, predefineColors} from "@/utils/constStr";
import {BlogStatus} from "@/types/blog/status";
import {addStatusApi, deleteStatusApi, getStatusByPageApi, updateStatusApi} from "@/apis/blog/status";

const columns = reactive<ColumnType[]>(
    [
      {
        label: '名称',
        prop: 'name',
        width: 120,
        align: 'center',
        fixed: 'left',
        scopedSlots: 'name'
      },
      {
        label: '颜色',
        prop: 'color',
        align: 'center',
        width: 250,
        scopedSlots: 'color'
      },
      {
        label: '添加时间',
        prop: 'blogStatusAddTime',
        width: 200,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '禁用',
        prop: 'blogStatusDisable',
        width: 200,
        align: 'center',
        scopedSlots: 'disabled'
      },
      {
        label: '更新时间',
        prop: 'blogStatusUpdateTime',
        width: 200,
        align: 'center',
        scopedSlots: false
      },
      {
        label: '操作',
        prop: 'op',
        align: 'center',
        fixed: "right",
        // width: 300,
        scopedSlots: "op"
      },
    ]
)

const tableData = reactive<DataSourceType<BlogStatus>>(
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
  const res: any = await getStatusByPageApi(page, pageSize)
  if (res.code == 200) {
    Object.assign(tableData, res.data)
  }
}


//新增的弹窗
const statusDialog = reactive<DialogType>({
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
      type: ButtonType.warning,
      name: '清空',
      click: () => {
        //清空数据
        resetForm(statusDialogFormRuleFormRef.value)
        //存储id
        if (statusDialogFormData.blogStatusId) {
          id = statusDialogFormData.blogStatusId
        }
      }
    },
    {
      type: ButtonType.primary,
      name: '添加',
      click: () => {
        //添加数据
        submitForm(statusDialogFormRuleFormRef.value)
      }
    },
  ],
  dialogType: DT.add,
  dialogVisible: false,
  title: "新增分类",
  width: "50%",
})


const showChangeDialog = (visible: boolean = false, dialogType?: DT, row?: BlogStatus) => {
  if (dialogType) {
    if (dialogType == DT.update) {
      statusDialog.title = "修改状态"
      statusDialog.dialogType = DT.update
      if (row) {
        nextTick(() => {
          Object.assign(statusDialogFormData, row)
        })
      }
    } else if (dialogType == DT.add) {
      statusDialog.title = "新增状态"
      statusDialog.dialogType = DT.add
      id = ""
    }
  }
  if (!visible) {
    //清空
    resetForm(statusDialogFormRuleFormRef.value)
  }
  statusDialog.dialogVisible = visible

}

let id = ""
const statusDialogFormRuleFormRef = ref<FormInstance>()
const statusDialogFormData = reactive<BlogStatus>({blogStatusColor: "", blogStatusName: ""})
const statusDialogFormRules = reactive<FormRules<typeof statusDialogFormData>>({
  blogStatusName: {required: true, message: "请输入名称", trigger: 'blur'},
  blogStatusColor: [{required: true, message: "请选择颜色", trigger: 'blur'},],
  blogStatusDisable: [{required: true, message: "请选择状态", trigger: 'blur'},],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return false
  await formEl.validate(async (valid) => {
    if (valid) {
      //添加
      let res
      if (statusDialog.dialogType == DT.add) {
        res = await addStatusApi(statusDialogFormData)
      } else if (statusDialog.dialogType == DT.update) {
        //修改
        if (id) {
          statusDialogFormData.blogStatusId = id
        }
        res = await updateStatusApi(statusDialogFormData)
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
  id = ""
  Object.keys(statusDialogFormData).forEach(key => statusDialogFormData[key] = null)
}


/**
 * 删除数据
 * @param row
 */
const deleteData = (row) => {
  appearMessageBox("您确定删除吗?", "提示", MsgType.error, '确认', '取消')
      .then(async () => {
        //删除
        const res: any = await deleteStatusApi(row)
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
.status-layout {
  .status-table {
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