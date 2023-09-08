<template>
  <div class="table-layout">

    <el-table ref="dataTable"
              v-if="dataSource.records"
              :data="dataSource.records || []"
              :stripe="options.stripe"
              :lazy="true"
              scrollbar-always-on
              style="width: 100%;height: 100%;"
              :fit="true"
              table-layout="auto"
              :border="options.border"
              header-row-class-name="table-header-row"
              highlight-current-row
              class="table"
              :max-height="tableHeight"
              @row-click="handleRowClick"
              @selection-change="handleSelectionChange">
      <!--  选择框-->
      <el-table-column v-if="options.selectType && options.selectType === 'checkbox'"
                       type="selection"
                       width="50"
                       align="center"></el-table-column>
      <!--    序号-->
      <el-table-column v-if="options.showIndex"
                       label="序号"
                       width="60"
                       align="center"></el-table-column>
      <!--    数据列-->
      <template v-for="(column,index) in columns">
        <template v-if="column.scopedSlots">
          <el-table-column :key="index"
                           :prop="column.prop"
                           :label="column.label"
                           :fixed="column.fixed || false"
                           :align="column.align ||'left'"
                           :width="column.width">
            <template #default="scope">
              <slot :name="column.scopedSlots"
                    :index="scope.$index"
                    :row="scope.row">

              </slot>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column :key="index"
                           :prop="column.prop"
                           :label="column.label"
                           :fixed="column.fixed || false"
                           :align="column.align ||'left'"
                           :width="column.width">

          </el-table-column>
        </template>
      </template>
    </el-table>
    <el-empty :image-size="200" v-else/>
    <!--  分页-->
    <div class="pagination-box"
         v-if="showPagination">

      <el-pagination v-if="dataSource.total"
                     background
                     :total="dataSource.total"
                     :page-sizes="[5,10,15,20,50]"
                     :page-size="dataSource.size"
                     :current-page.sync="dataSource.current"
                     layout="total,sizes,prev,pager,next,jumper"
                     @size-change="handlePageSizeChange"
                     @current-change="handlePageChange"
                     @next-click="nextClick"
                     @prev-click="prevClick"
                    class="pagination">

      </el-pagination>
    </div>

  </div>

</template>

<script setup lang="ts">

import {ColumnType, DataSourceType, OptionsType, PropsType} from "@/types/table";
import {onMounted, ref} from "vue";

const emit = defineEmits(['rowSelected', 'rowClick'])
const props = defineProps<PropsType<any>>()


const radioSelectRowIndex = ref()
//顶部60 内容区域距离顶部20 内容上下内间距5*2 分页区域高度 46
const topHeight = 60 + 20 + 30 + 46
const tableHeight = ref<number>(
    props.options.extHeight ? props.options.extHeight :
        window.innerHeight - topHeight - props.options.extHeight
)

const dataTable = ref()
//行点击
const handleRowClick = (row) => {
  emit('rowClick', row)
}
//多选
const handleSelectionChange = (row) => {
  emit('rowSelected', row)
}

// 切换每页大小
const handlePageSizeChange = (size) => {
  if (props.initFetch && props.fetch) {
    props.fetch(1,size)
  }
}

//切换页码
const handlePageChange = (pageNo) => {
  // props.dataSource.pageNo = pageNo
  if (props.initFetch && props.fetch) {
    props.fetch(pageNo)
  }
}
const nextClick = (page) => {

}
const prevClick = (page) => {

}
//设置行选中
const setCurrentRow = (rowKey, rowValue?) => {
  let row = props.dataSource.records.find((item) => {
    return item[rowKey] === rowValue
  })
  dataTable.value.setCurrentRow(row)
}

//将子组件暴露出去 否则父组件无法调用
defineExpose({
  setCurrentRow
})
//初始化
onMounted(() => {
  if (props.initFetch && props.fetch) {
    props.fetch()
  }
})

</script>

<style scoped lang="scss">
.table-layout {
  display: flex;
  flex-direction: column;

  .table {

  }
  .pagination-box{
    display: flex;
    float: right;
    margin-right: auto;
    .pagination{

    }
  }
}
</style>