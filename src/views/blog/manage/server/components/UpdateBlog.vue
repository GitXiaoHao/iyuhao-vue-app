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
              size="large"
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
                    v-for="(item,index) in articleTagsByList"
                    :key="index"
                    :label="item.articleTagName"
                    :value="item.articleTagName"
                    :disabled="item.articleTagDisable == 1"
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
            <el-form-item label="文章专题" prop="blogSpecialName">
              <el-select clearable placeholder="请选择专题" v-model="settingForm.blogSpecialName">
                <el-option :label="special.blogSpecialName" :value="special.blogSpecialName"
                           v-for="special in specialList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章评论" prop="blogArticleAllowComment">
              <el-radio-group v-model="settingForm.blogArticleAllowComment">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
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
                       disabled
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
import {DT, globalInfo, MsgType} from "@/utils/constStr";
import {appearMessage, appearMessageBox} from "@/utils/elementUtils";
import {nextTick, onMounted, reactive, ref} from 'vue'

import CoverUpload from "@/components/CoverUpload.vue";
import {useBlogStore} from "@/store/modules/blog";
import go from "@/utils/common";
import {Bottom, Top} from "@element-plus/icons-vue";
import {addBlogArticleApi, getArticleTag4relationshipApi, updateBlogArticleApi} from "@/apis/blog/article";
import {BlogCategory} from "@/types/blog/category";
import {ArticleStatusType, ArticleType, BlogArticleForm} from "@/types/blog/article";
import {ArticleTag, ArticleTagListByPage} from "@/types/blog/articleTag";
import {getArticleTagListApi, getArticleTagListByTreeApi} from "@/apis/blog/articleTag";
import {useUserStore} from "@/store/modules/user";
import {BlogSpecial} from "@/types/blog/special";
import {getSpecialByIdApi} from "@/apis/blog/special";

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
      .catch(() => {
        return
      }).then(() => {
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

const userStore = useUserStore()
const blogStore = useBlogStore()
const settingFormRef = ref<FormInstance>()
const coverUploadRef = ref(null)
const coverUploadFile = reactive([])
const categoryList = ref<Array<BlogCategory>>(blogStore.getCategoryList)
const specialList = ref<Array<BlogSpecial>>(blogStore.getSpecialList)

let settingForm = reactive<BlogArticleForm>({
  articleTags: [],
  blogArticleId: null
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
      callback(new Error('转载链接不符合规则'))
    }
  }
  callback()
}
const validateArticleCover = (rule: any, value: any, callback: any) => {
  console.log(settingForm.blogArticleCover )
  if (coverUploadRef.value.dialogImageUrl) {
    settingForm.blogArticleCover = coverUploadRef.value.dialogImageUrl
    callback()
  }else{
    callback(new Error("请上传封面"))
  }
}

const rules = reactive<FormRules<BlogArticleForm>>({
  articleTags: [{validator: validateArticleTags, trigger: 'blur'}],
  blogCategoryName: [{required: true, message: '请选择文章分类', trigger: 'blur',},],
  blogArticleSummary: [{required: true, message: '请填写文章摘要', trigger: 'blur',},],
  blogArticleCover: [{required: true, validator: validateArticleCover, trigger: 'blur'},],
  blogArticleType: [{required: true, message: '请选择文章类型', trigger: 'change',},],
  blogArticleAllowComment: [{required: true, message: '请选择是否允许评论', trigger: 'change',},],
  blogArticleReprintUrl: [{required: true, validator: validateReprintUrl, trigger: 'blur'}],
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
    let res: any
    if (settingForm.blogSpecialName) {
      specialList.value.forEach(special => {
        if (special.blogSpecialName == settingForm.blogSpecialName) {
          settingForm.blogSpecialId = special.blogSpecialId
        }
      })
    }
    if (props.type == DT.add) {
      //添加
      const userinfo = userStore.getUserInfo
      if (userinfo.userName && userinfo.userId) {
        settingForm.userId = userinfo.userId
        settingForm.userName = userinfo.userName
      }
      res = await addBlogArticleApi(tags, settingForm)
    } else if (props.type == DT.update) {
      //修改
      settingForm.blogArticleUpdateTime = null
      res = await updateBlogArticleApi(tags, settingForm)
    }
    if (res.code == 200) {
      //防止删除
      coverUploadRef.value.dialogImageUrl = null
      //提交成功
      appearMessage.success('保存成功')
      setTimeout(() => {
        //跳转
        emits('closeDrawer')
      }, 2000)
      emits('selectBlogListByPage')
      //清空
      deleteSettingForm()
    } else {
      appearMessage.error(res.data)
    }
  }
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
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
  //删除图片
  imageNames.forEach(async name => {
    await deleteFile(name)
  })
  //图片删除
  imageNames.length = 0
}
const submitDraft = async () => {
  settingForm.blogArticleCover = coverUploadRef.value.dialogImageUrl
  settingForm.blogStatusName = ArticleStatusType.draft
  await getBlog()
}
/**
 * 发布博客
 */
const postABlog = () => {
  settingForm.blogArticleCover = coverUploadRef.value.dialogImageUrl
  settingForm.blogStatusName = ArticleStatusType.release
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
const articleTagsByTree = reactive<ArticleTagListByPage[]>([])
const articleTagsByList = reactive<ArticleTag[]>([])
/***
 * 当选择了一个标签的时候
 * @param value
 */
const currentTagChange = (value) => {
  if (!settingForm.articleTags) {
    settingForm.articleTags = []
  }
  settingForm.articleTags.push(value)
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
const getArticleTagData = async () => {
  const res: any = await getArticleTagListByTreeApi()
  if (res.code == 200) {
    articleTagsByTree.length = 0
    articleTagsByTree.push(...res.data)
  }
  const res2: any = await getArticleTagListApi()
  if (res2.code == 200) {
    articleTagsByList.length = 0
    articleTagsByList.push(...res2.data)
  }
}
const updateFormData = async () => {
  //修改
  settingForm = props.blogArticleData
  let res: any
  //根据id 查找specialName
  if (settingForm.blogSpecialId) {
    res = await getSpecialByIdApi(settingForm.blogSpecialId)
    if (res.code == 200) {
      settingForm.blogSpecialName = res.data.blogSpecialName
    }
  }
  if (settingForm.blogArticleMarkdownContent) {
    mdTest.value = settingForm.blogArticleMarkdownContent
  }
  if (settingForm.blogArticleId) {
    if (settingForm.blogArticleCover) {
      await nextTick(() => {
        coverUploadFile.push({
          url: globalInfo.imageUrl + settingForm.blogArticleCover,
          name: settingForm.blogArticleTitle
        })
        coverUploadRef.value.dialogImageUrl = settingForm.blogArticleCover
      })
    }
    //标签
    settingForm.articleTags = []
    settingForm.articleTags.length = 0
    res = await getArticleTag4relationshipApi(settingForm.blogArticleId)
    if (res.code == 200) {
      for (let value in res.data) {
        currentTagChange(res.data[value])
      }
    }
  }
}
onMounted(() => {
  if (props.type == DT.update) {
    nextTick(() => {
      updateFormData()
    })
  }
  getArticleTagData()
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