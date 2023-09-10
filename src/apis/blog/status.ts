import httpInstance from "@/utils/http";
import {BlogStatus} from "@/types/blog/status";
const statusPath = "/status/"
export function getStatusListApi() {
    return httpInstance({
        url: statusPath + 'list',
        method: 'get',
        data: {
            "showLoading": false
        }
    })
}


export function getStatusByPageApi(page,pageSize) {
    return httpInstance({
        url: statusPath + `page/${page}/${pageSize}`,
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}
export function getSpecialByIdApi(id) {
    return httpInstance({
        url: statusPath + `get/${id}`,
        method: 'get',
        data: {
            "showLoading": false
        }
    })
}
export function updateStatusApi(status: BlogStatus) {
    return httpInstance({
        url: statusPath + "update",
        method: 'put',
        data: {
            ...status,
            "showLoading": true
        }
    })
}


export function deleteStatusApi(status: BlogStatus) {
    return httpInstance({
        url: statusPath + "status",
        method: 'delete',
        data: {
            ...status,
            "showLoading": true
        }
    })
}

export function addStatusApi(status: BlogStatus) {
    return httpInstance({
        url: statusPath + "add",
        method: 'post',
        data: {
            ...status,
            "showLoading": true
        }
    })
}