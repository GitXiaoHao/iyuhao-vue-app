import {BlogSpecial} from "@/types/blog/special";

export enum ArticleType {
    original = "原创",
    reprint = "转载"
}
export enum ArticleStatusType{
    draft = "草稿",
    release = "已发布"
}

// 文章设置
export interface BlogArticleForm {
    articleTags?: Array<String>
    blogArticleTitle?:String
    blogArticleId?:String
    blogCategoryName?: String
    blogArticleSummary?: String
    blogArticleCover?: String
    blogArticleContent?: String
    blogArticleMarkdownContent?: String
    blogArticleType?: ArticleType | null
    blogArticleAllowComment?: Number
    blogArticleEditorType?: String
    blogSpecialId?: String
    blogSpecialName?: String
    blogArticleReprintUrl?: String
    blogStatusName?: String
    userId?: String
    userName?: String
    blogArticleGoodNumber?:Number
    blogArticleViewsNumber?:Number
    blogArticleFavoriteNumber?:Number
    blogArticleAddTime?:String
    blogArticleUpdateTime?:String
}





