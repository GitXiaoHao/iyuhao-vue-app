export enum ArticleType {
    original = "原创",
    reprint = "转载"
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
