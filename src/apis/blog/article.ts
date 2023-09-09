import httpInstance from "@/utils/http";
import {AdministrationSearchDataType, AdministrationTableDataType} from "@/types/blog/administration";
import {BlogArticleForm} from "@/types/blog/article";

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

export function deleteArticleApi(blogArticle:AdministrationTableDataType){
    return httpInstance({
        url: articlePath,
        method: 'delete',
        data: {
            ...blogArticle,
            "showLoading": true
        }
    })
}
export function addBlogArticleApi(tags: Array<String>, blogArticle: BlogArticleForm) {
    return httpInstance({
        url: articlePath + `addArticle`,
        method: 'post',
        data: {
            'tags': tags,
            "blogArticle":blogArticle,
            "showLoading": true
        }
    })
}


export function updateBlogArticleApi(tags: Array<String>, blogArticle: BlogArticleForm) {
    return httpInstance({
        url: articlePath + `update`,
        method: 'put',
        data: {
            'tags': tags,
            blogArticle,
            "showLoading": true
        }
    })
}


export function getArticleTag4relationshipApi(id:String){
    return httpInstance({
        url: articlePath + `relation/${id}`,
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}


export function getArticle4SpecialApi(id:String){
    return httpInstance({
        url: articlePath + `special/${id}`,
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}
