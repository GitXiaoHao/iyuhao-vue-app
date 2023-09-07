export interface CategoryType {
    /**
     * 博客状态id
     */
    blogCategoryTypeId?: String

    /**
     * 博客状态名称
     */
    blogCategoryTypeName?: String

    /**
     * 是否被禁用 1:禁用 0:不禁用
     */
    blogCategoryTypeDisable?: Number

    /**
     * 创建人id
     */
    blogCategoryCreateUserId?: String

    /**
     * 创建人名称
     */
    blogCategoryCreateUserName?: String
    blogCategoryLastUpdateUserId?: String
    blogCategoryLastUpdateUserName?: String

    /**
     * 文章添加时间
     */
    blogCategoryTypeAddTime?: String
    /**
     * 更新时间
     */
    blogCategoryTypeUpdateTime?: String
}