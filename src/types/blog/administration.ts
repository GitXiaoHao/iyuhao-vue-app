export interface AdministrationSearchDataType {
    titleFuzzy?: String
    searchStatus?: String
    searchCategoryName?: String
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
    blogSpecialId?: String
    blogSpecialName?: String
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
