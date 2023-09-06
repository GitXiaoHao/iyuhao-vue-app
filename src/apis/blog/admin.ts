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