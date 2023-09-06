export enum ButtonType {
    primary = "primary",
    success = "success",
    warning = "warning",
    info = "info",
    danger = "danger"
}

export enum DT {
    update = "update",
    add = "add"
}

export enum ArticleType {
    original = "原创",
    reprint = "转载"
}

export interface BlogCategory {
    blogCategoryId?: Number
    blogCategoryCover: String
    blogCategoryName: String
    blogCategoryType: String
    blogCategoryDesc: String
    userId: String
    blogCategoryEssayCount?: Number
    blogCategoryCreateTime?: String
    blogCategoryUpdateTime?: String
}

export interface BlogStatus {
    /**
     * 博客状态id
     */
    blogStatusId?: String

    /**
     * 博客状态名称
     */
    blogStatusName?: String

    /**
     * 博客状态颜色
     */
    blogStatusColor?: String

    /**
     * 文章添加时间
     */
    blogStatusAddTime?: String

    /**
     * 更新时间
     */
    blogStatusUpdateTime?: String

}

export interface AdministrationSearchDataType {
    titleFuzzy?: String
    searchStatus?: String
    searchCategoryName?: String
}
export interface MemberSearchDataType {
    nameFuzzy? :String
    phone?:String
}

/**
 *
 */
export interface AdministrationTableDataType {
    blogArticleId?: String
    blogArticleTitle?: String
    blogCategoryName?: String
    blogArticleCover?: String
    blogArticleSummary?: String
    blogArticleContent?: String
    blogArticleMarkdownContent?: String
    blogArticleEditorType?: String
    userId?: String
    userName?: String
    blogArticleType?: String
    blogArticleReprintUrl?: String
    /**
     * 文章评论权限1:允许0:不允许
     */
    blogArticleAllowComment?: Number
    blogStatusName?: String
    blogArticleGoodNumber?: Number
    blogArticleViewsNumber?: Number
    blogArticleFavoriteNumber?: Number
    blogArticleAddTime?: String
    blogArticleUpdateTime?: String
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
    blogArticleAllowComment?: String
    blogArticleEditorType?: String
    blogArticleReprintUrl?: String
    blogStatusName?: String
}


/**
 * 博客专题
 */

export interface BlogSpecial{
    articleTags?: Array<String>
    /**
     * 博客专题id
     */
    blogSpecialId?:String

    /**
     * 博客专题名称
     */
     blogSpecialName:String

    /**
     * 博客专题封面
     */
    blogSpecialCover:String

    /**
     * 博客专题简介
     */
    blogSpecialBriefIntroduction:String

    /**
     * 博客专题编辑人id
     */
    userId?:String

    /**
     * 博客专题作者
     */
    userName?:String

    /**
     * 博客专题最后一次修改人id
     */
    blogSpecialLastUpdateUserId?:String

    /**
     * 点赞次数
     */
    blogSpecialGoodNumber?: Number

    /**
     * 观看次数
     */
   blogSpecialViewsNumber?:Number

    /**
     * 收藏次数
     */
    blogSpecialFavoriteNumber?:Number

    /**
     * 博客专题文章数量
     */
   blogSpecialEssayCount?:Number

    /**
     * 添加时间
     */
    blogSpecialAddTime?:String

    /**
     * 更新时间
     */
    blogSpecialUpdateTime?:String
}