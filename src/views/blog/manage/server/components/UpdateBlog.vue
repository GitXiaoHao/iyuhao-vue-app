<template>
  <div>
    <!--    新增博客-->
    <el-drawer
        ref="drawerRef"
        :model-value="dialog"
        :before-close="handleClose"
        direction="ttb"
        size="100%"
        class="demo-drawer"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="drawer-header">
          <h4 :id="titleId">{{ title }}</h4>
        </div>
      </template>
      <!--      正文-->
      <div class="drawer-content">
        <!--        //标题-->
        <el-input placeholder="请输入文章标题（3~50个字）"
                  class="content-input"
                  minlength="3"
                  maxlength="50"
                  show-word-limit
                  size="large"
                  v-model="settingForm.blogArticleTitle"
                  id="blogTitle"
        ></el-input>
        <div id="contentMain">
          <!--        博客正文-->
          <v-md-editor v-model="mdTest" height="580px"
                       @upload-image="handleUploadImage"
                       :disabled-menus="[]"
                       @change="editorChange"
          ></v-md-editor>
        </div>
        <div class="content-setting" id="setting">
          <el-form
              ref="settingFormRef"
              :model="settingForm"
              :rules="rules"
              label-width="120px"
              class="setting-form"
              :size="formSize"
              status-icon
          >
            <el-form-item label="文章标签" prop="articleTags">
              <el-tag
                  v-for="tag in settingForm.articleTags"
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
                  placeholder="+添加文章标签">
                <el-option
                    v-for="(item,index) in articleTags"
                    :key="index"
                    :label="item.value"
                    :value="item.value"
                    :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="文章封面"
                          prop="blogArticleCover">
              <CoverUpload ref="coverUploadRef"
                           :files="coverUploadFile"
                           :dialogType="type"
              ></CoverUpload>
            </el-form-item>
            <el-form-item label="文章摘要" prop="blogArticleSummary">
              <el-input v-model="settingForm.blogArticleSummary"
                        type="textarea"
                        autosize
                        show-word-limit
                        maxlength="250"
                        placeholder="摘要:会在推荐、列表等场景外露，帮助读者快速了解内容"/>
            </el-form-item>
            <el-form-item label="文章分类" prop="blogCategoryName">
              <el-select clearable placeholder="请选择分类" v-model="settingForm.blogCategoryName">
                <el-option :label="category.blogCategoryName" :value="category.blogCategoryName"
                           v-for="category in categoryList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章评论" prop="blogArticleAllowComment">
              <el-radio-group v-model="settingForm.blogArticleAllowComment">
                <el-radio label="1">允许</el-radio>
                <el-radio label="0">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文章类型" prop="blogArticleType">
              <el-radio-group v-model="settingForm.blogArticleType">
                <el-radio :label="type" v-for="type in ArticleType"/>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="blogArticleReprintUrl" v-if="settingForm.blogArticleType === ArticleType.reprint">
              <el-input placeholder="请填写原文链接"
                        v-model="settingForm.blogArticleReprintUrl"
              ></el-input>
              <span style="color: red">注意：转载请确认原文允许转载，或者您已经获得原文作者授权。</span>
            </el-form-item>

          </el-form>
        </div>
      </div>
      <!--    页脚-->
      <template #footer>
        <div class="footer-main">
          <span class="footer-tip">
            <span @click="clickContentTitle" class="footer-word-count">
              共{{ mdTest.length }}字
            </span>
            <span @click="checkPosition" class="footer-change">
              {{ checkPositionStr }}
              <el-icon>
                <Top v-if="checkPositionBool"/>
                <Bottom v-else/>
              </el-icon>
            </span>
          </span>
          <div class="footer-button">
            <el-button round size="large"
                       @click="submitDraft"
            >保存草稿
            </el-button>
            <el-button round size="large"

            >定时发布
            </el-button>
            <el-button round size="large" type="danger"
                       @click="postABlog">发布博客
            </el-button>
          </div>
        </div>
      </template>
      <!--      设置-->

    </el-drawer>
  </div>
</template>

<script setup lang="ts">

import type {FormInstance, FormRules} from 'element-plus'
// 新增博客
import {ElDrawer} from "element-plus";
import {deleteFile, uploadFile} from "@/apis/common";
import {globalInfo, MsgType} from "@/utils/constStr";
import {appearMessage, appearMessageBox} from "@/utils/elementUtils";
import {onMounted, reactive, ref} from 'vue'
import {ArticleType, BlogCategory, BlogArticleForm, DT} from "@/types/blog";
import CoverUpload from "@/components/CoverUpload.vue";
import {useBlogStore} from "@/store/modules/blog";
import go from "@/utils/common";
import {Bottom, Top} from "@element-plus/icons-vue";
import {getBlogApi} from "@/apis/blog/article";

const emits = defineEmits(['closeDrawer', 'selectBlogListByPage'])
const props = defineProps({
  title: {
    type: String
  },
  type: {
    type: String,
    default: "add"
  },
  blogArticleData: {
    type: Object,
    default: null
  }
})

const mdTest = ref("")
const imageNames: Array<String> = []
const drawerRef = ref<InstanceType<typeof ElDrawer>>()
const dialog = ref(true)
const checkPositionStr = ref("发文设置")
const checkPositionBool = ref(false)
const editorStr = ref("MarkDown")
const handleClose = (done) => {
  //提示
  appearMessageBox("您所做的任务没有保存，是否继续?"
      , "提示", MsgType.warning, "确定", "取消")
      .catch(reason => {
        return
      }).then(r => {
    //删除图片
    imageNames.forEach(async name => {
      await deleteFile(name)
    })
    //图片删除
    imageNames.length = 0
    //内容删除
    mdTest.value = ""
    done()
    //删除
    deleteSettingForm()
    emits('closeDrawer')
  })
}
const handleUploadImage = async (event, insertImage, files) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const res: any = await uploadFile(files[0])
  if (res.code == 200) {
    imageNames.push(res.data)
    insertImage({
      url: globalInfo.imageUrl + res.data,
      desc: '图片'
    })
  } else {
    appearMessage.error(res.data)
  }
}
const editorChange = (text, html) => {
  settingForm.blogArticleMarkdownContent = text
  settingForm.blogArticleContent = html
}


const blogStore = useBlogStore()
const formSize = ref('large')
const settingFormRef = ref<FormInstance>()
const coverUploadRef = ref(null)
const coverUploadFile = reactive([])
const categoryList = ref<Array<BlogCategory>>(blogStore.getCategoryList)
const settingForm = reactive<BlogArticleForm>({
  blogArticleId: null,
  articleTags: [],
  blogArticleTitle: null,
  blogCategoryName: null,
  blogArticleCover: null,
  blogArticleContent: null,
  blogArticleMarkdownContent: null,
  blogArticleSummary: null,
  blogArticleType: null,
  blogArticleAllowComment: null,
  blogArticleEditorType: null,
  blogArticleReprintUrl: null,
  blogStatusName: null,
})
const validateArticleTags = (rule: any, value: any, callback: any) => {
  if (settingForm.articleTags?.length == 0) {
    callback(new Error('请选择标签'))
  }
  callback()
}
const validateReprintUrl = (rule: any, value: any, callback: any) => {
  if (settingForm.blogArticleType == ArticleType.reprint) {
    if (value == '') {
      callback(new Error('请填写转载链接'))
    }
    let matchUrl = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
    if (!matchUrl.test(value)) {
      //
      callback(new Error('转载链接不符合校验'))
    }
  }
  callback()
}
const rules = reactive<FormRules<BlogArticleForm>>({
  articleTags: [{validator: validateArticleTags, trigger: 'blur'}],
  blogCategoryName: [
    {
      required: true,
      message: '请选择文章分类',
      trigger: 'blur',
    },
  ],
  blogArticleSummary: [
    {
      required: true,
      message: '请填写文章摘要',
      trigger: 'blur',
    },
  ],
  blogArticleCover: [{required: true, message: "请上传封面", trigger: 'blur'},],
  blogArticleType: [{required: true, message: '请选择文章类型', trigger: 'change',},],
  blogArticleAllowComment: [{required: true, message: '请选择是否允许评论', trigger: 'change',},],
  blogArticleReprintUrl: [{validator: validateReprintUrl, trigger: 'blur'}],
})
/**
 * 提交博客
 */
const getBlog = async () => {
  if (validateBlogTitle()) {
    //true就正确
    settingForm.blogArticleEditorType = editorStr.value
    //提交
    const tags = settingForm.articleTags
    delete settingForm['articleTags']
    const res: any = await getBlogApi(tags, settingForm)
    if (res.code == 200) {
      //提交成功
      appearMessage.success('发布成功')
      setTimeout(() => {
        //跳转
      }, 2000)
      emits('selectBlogListByPage')
      coverUploadRef.value.dialogImageUrl = null
      //清空
      deleteSettingForm()
    } else {
      appearMessage.error(res.data)
    }
  }
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  settingForm.blogArticleCover = coverUploadRef.value.dialogImageUrl
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(settingForm)
      getBlog()

    } else {
      console.log('error submit!', fields)
    }
  })
}
const deleteSettingForm = () => {
  //删除 封面
  coverUploadRef.value.deletePic()
  //删除所有
  settingFormRef.value?.resetFields()
}
const submitDraft = () => {
  settingForm.blogStatusName = "草稿"
  submitForm(settingFormRef.value)
}
/**
 * 发布博客
 */
const postABlog = () => {
  settingForm.blogStatusName = "已发布"
  submitForm(settingFormRef.value)
}

/**
 * 校验博客标题
 */
const validateBlogTitle = (): Boolean => {
  //博客标题
  if (settingForm.blogArticleTitle == null || settingForm.blogArticleTitle == "") {
    appearMessage.error("请输入博客标题")
  } else if (settingForm.blogArticleTitle.length < 3) {
    appearMessage.error("博客标题字数小于3")
  } else {
    return true
  }
  go('#blogTitle')
  return false
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
  settingForm.articleTags?.push(value)
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
  settingForm.articleTags.splice(settingForm.articleTags.indexOf(value), 1)
}

//下路的提示
const clickContentTitle = () => {
  go('#contentMain')
}
const checkPosition = () => {
  let str
  //如果等于false 就是 发文设置
  if (checkPositionBool.value) {
    //定位到回到顶部
    checkPositionStr.value = "发文设置"
    str = "#blogTitle"
  } else {
    //定位到发文设置
    checkPositionStr.value = "回到顶部"
    str = "#setting"
  }
  go(str)
  checkPositionBool.value = !checkPositionBool.value
}


onMounted(() => {
  if (props.type == DT.update) {
    //修改
    Object.assign(props.blogArticleData, settingForm)
    mdTest.value = settingForm.blogArticleMarkdownContent
    coverUploadFile.push({
      url: globalInfo.imageUrl + settingForm.blogArticleCover,
      name: settingForm.blogArticleTitle
    })
  }
})
</script>

<style scoped lang="scss">
:deep(.el-drawer__header) {
  margin-bottom: 10px !important;
  padding-bottom: 10px;
  background-color: white;
}

:deep(.el-drawer) {
  background-color: #f5f3f2;
}

:deep(.el-drawer__footer) {
  background-color: white;
  display: flex;
}

:deep(.el-drawer__body) {

  justify-content: center;
  top: 10px;
  display: flex;
  height: 100%;
}

:deep(.el-form-item--default) {
  align-items: center;
}

.demo-drawer {
  .drawer-content {
    margin-top: 10px;
    width: 80%;
    align-items: center;
    justify-content: center;
    padding-bottom: 50px;

    .content-input {
      border: none;
      height: 60px;
      font-size: 25px;

      :deep(.el-input__wrapper) {
        box-shadow: none;
        border-radius: 0;
        border-bottom: 1px solid #3c4654;
      }
    }

    .content-setting {
      margin-top: 20px;
      background-color: white;
      height: 600px;
      padding: 30px;
      margin-bottom: 100px;

      .setting-form {
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    }
  }

  .drawer-header {
    font-size: 25px;
    display: flex;
  }

  .footer-main {
    width: 60%;
    display: flex;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;

    .footer-tip {
      padding-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      .footer-word-count {
        margin-right: 20px;
      }

      .footer-change {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>