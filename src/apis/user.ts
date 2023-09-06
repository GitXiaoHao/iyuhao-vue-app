import httpInstance from "@/utils/http";
import {baseURL} from "@/utils/constStr";
import {LoginUser, RegisterUser} from "@/types/user";
import {AdministrationSearchDataType, MemberSearchDataType} from "@/types/blog";

const user: string = "/user/"

export function getVerifyString(): string {
    // return baseURL + user + 'verify?d=' + new Date()*1
    return baseURL + user + 'verify?d=' + new Date() * 1
}

export function getVerifyApi() {
    return httpInstance({
        url: user + 'verify',
        method: 'get'
    })
}


export function equalsVerifyApi(checkCode: String) {
    return httpInstance({
        url: user + 'compareVerify',
        method: 'post',
        data: {checkCode, "showLoading": false}
    })
}

/**
 * 查找用户名 是否重复
 * @param userName
 */
export const validateNameApi = (userName: String) => {
    return httpInstance({
        url: user + 'validateUser',
        method: 'get',
        data: {userName, "showLoading": false}
    })
}
/**
 * 获取验证码
 * @param userEmail
 */
export const obtainVerificationCodeApi = (userEmail: String) => {
    return httpInstance({
        url: user + 'obtainEmail',
        method: 'get',
        data: {userEmail, "showLoading": false}
    })
}
/**
 * 验证邮箱验证码
 */
export const verificationCodeMailApi = (checkCode:String) => {
    return httpInstance({
        url: user + 'vcCm',
        method: 'get',
        data: {checkCode,"showLoading": false}
    })
}

/**
 * 验证信息
 * @param userData
 */
export const checkInformationApi = (userData:LoginUser) => {
    return httpInstance({
        url: user + 'login',
        method: 'get',
        data: {...userData, "showLoading": true}
    })
}

export const registerUserApi = (user:RegisterUser) => {
    return httpInstance({
        url: user + 'register',
        method: 'post',
        data: {...user, "showLoading": true}
    })
}



export const getMemberByPageApi = (page: Number, pageSize: Number, params: MemberSearchDataType) => {
    return httpInstance({
        url: user + `member`,
        method: 'post',
        data: {
            page,
            pageSize,
            ...params,
            "showLoading": true
        }
    })
}