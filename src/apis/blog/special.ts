import {BlogCategory, BlogSpecial} from "@/types/blog";
import httpInstance from "@/utils/http";

const specialPath = "/blogSpecial/"
export function updateSpecialApi(special:BlogSpecial){
    return httpInstance({
        url: specialPath + 'special',
        method: 'post',
        data: {
            ...special,
            "showLoading": true
        }
    })
}



export function deleteSpecialApi(special:BlogSpecial){
    return httpInstance({
        url: specialPath + 'special',
        method: 'delete',
        data: {
            ...special,
            "showLoading": true
        }
    })
}


export function getSpecialListByPageApi(page: number, pageSize: number) {
    return httpInstance({
        url: specialPath + `special/${page}/${pageSize}`,
        method: 'get',
        data: {
            "showLoading": true
        }
    })
}