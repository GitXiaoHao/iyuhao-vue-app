import httpInstance from "@/utils/http";
import {CategoryType} from "@/types/blog/categoryType";

const ctPath = "/ct/"

export function getCategoryTypeByPageApi(page: number, pageSize: number) {
    return httpInstance({
        url: ctPath + `${page}/${pageSize}`,
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}

export function getCategoryTypeListApi() {
    return httpInstance({
        url: ctPath + `list`,
        method: 'get',
        data: {
            "showLoading": false
        }
    })
}




export function updateCategoryTypeApi(categoryType: CategoryType) {
    return httpInstance({
        url: ctPath + "update",
        method: 'put',
        data: {
            ...categoryType,
            "showLoading": true
        }
    })
}


export function deleteCategoryTypeApi(categoryType: CategoryType) {
    return httpInstance({
        url: ctPath,
        method: 'delete',
        data: {
            ...categoryType,
            "showLoading": true
        }
    })
}

export function addCategoryTypeApi(categoryType: CategoryType) {
    return httpInstance({
        url: ctPath + "add",
        method: 'post',
        data: {
            ...categoryType,
            "showLoading": true
        }
    })
}
