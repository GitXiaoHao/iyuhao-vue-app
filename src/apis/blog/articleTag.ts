import httpInstance from "@/utils/http";
import {ArticleTag} from "@/types/blog/articleTag";

const articleTagPath = "/at/"

export function getArticleTagListByPageApi(page: Number, pageSize: Number) {
    return httpInstance({
        url: articleTagPath + `page/${page}/${pageSize}`,
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}

export function getArticleTagListApi() {
    return httpInstance({
        url: articleTagPath + `list`,
        method: 'get',
        data: {
            "showLoading": false
        }
    })
}

export function addArticleTagApi(at:ArticleTag) {
    return httpInstance({
        url: articleTagPath + "add",
        method: 'post',
        data: {
            ...at,
            "showLoading": true
        }
    })
}

export function updateArticleTagApi(at:ArticleTag) {
    return httpInstance({
        url: articleTagPath + "update",
        method: 'post',
        data: {
            ...at,
            "showLoading": true
        }
    })
}

export function deleteArticleTagApi(at:ArticleTag) {
    return httpInstance({
        url: articleTagPath,
        method: 'delete',
        data: {
            ...at,
            "showLoading": true
        }
    })
}


export function getArticleTagListByTreeApi() {
    return httpInstance({
        url: articleTagPath + "tree",
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}


