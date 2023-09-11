import httpInstance from "@/utils/http";
import {BlogCategory} from "@/types/blog";

const blogPath = "/category/"

export function getCategory(page: number, pageSize: number) {
    return httpInstance({
        url: blogPath + `${page}/${pageSize}`,
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}

export function getCategoryList() {
    return httpInstance({
        url: blogPath + 'list',
        method: 'get',
        data: {
            "showLoading": false
        }
    })
}

export function addCategoryApi(category:BlogCategory){
    return httpInstance({
        url: blogPath + 'add',
        method: 'post',
        data: {
            ...category,
            "showLoading": true
        }
    })
}

export function updateCategoryApi(category:BlogCategory){
    return httpInstance({
        url: blogPath + 'update',
        method: 'put',
        data: {
            ...category,
            "showLoading": true
        }
    })
}

export function deleteCategory(category:BlogCategory){
    return httpInstance({
        url: blogPath,
        method: 'delete',
        data: {
            ...category,
            "showLoading": true
        }
    })
}