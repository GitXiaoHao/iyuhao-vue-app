export interface ArticleTag {
    /**
     * 文章标签id
     */

    articleTagId?: String

    /**
     * 标签名称
     */
    articleTagName?: String

    /**
     * 创建人id
     */
    articleTagCreateUserId?: String

    /**
     * 创建人名称
     */
    articleTagCreateUserName?: String

    /**
     * 最后一次修改人id
     */
    articleTagLastUpdateUserId?: String

    /**
     * 最后一次修改人名称
     */
    articleTagLastUpdateUserName?: String

    /**
     * 标签上一级的id
     */
    articleTagParentId?: String
    articleTagParentName?: String

    /**
     * 文章标签添加时间
     */
    articleTagAddTime?: String

    /**
     * 文章标签更新时间
     */
    articleTagUpdateTime?: String
    articleTagDisable?: Number
}

export interface ArticleTagListByPage {
    articleTag?: ArticleTag
    children?: Array<ArticleTagListByPage>
}