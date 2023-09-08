import httpInstance from "@/utils/http";
import {AdministrationSearchDataType, BlogArticleForm} from "@/types/blog";

const articlePath = '/blogArticle/'


export function getArticleByPage(page: Number, pageSize: Number, params: AdministrationSearchDataType) {
    return httpInstance({
        url: articlePath + `article`,
        method: 'post',
        data: {
            page,
            pageSize,
            ...params,
            "showLoading": true
        }
    })
}


export function getBlogApi(tags: Array<String>, formData: BlogArticleForm) {
    return httpInstance({
        url: articlePath + `addArticle`,
        method: 'post',
        data: {
            'tags': tags,
            ...formData,
            "showLoading": true
        }
    })
}