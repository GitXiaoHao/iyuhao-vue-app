import httpInstance from "@/utils/http";

const commonPath = "/common/"

export function deleteFile(name:String) {
    return httpInstance({
        url: commonPath + 'delete',
        method: 'post',
        data: {
            name,
            "showLoading": false
        }
    })
}


export function uploadFile(file) {
    return httpInstance({
        url: commonPath + 'upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: {
            file,
            "showLoading": true
        }
    })
}