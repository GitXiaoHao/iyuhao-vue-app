import {UserInfo} from "@/types/user";
import httpInstance from "@/utils/http";


const blogAdminPath = "/blogAdmin/"
export function loginApi(user: UserInfo){
    return httpInstance({
        url: blogAdminPath + `login`,
        method: 'post',
        data: {
            ...user,
            "showLoading": true
        }
    })
}


export function saveUserInfoApi(user: UserInfo){
    return httpInstance({
        url: blogAdminPath + `admin`,
        method: 'put',
        data: {
            ...user,
            "showLoading": true
        }
    })
}

