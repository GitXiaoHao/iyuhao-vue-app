//
// 常量
//

export enum MsgType {
    success = "success",
    info = "info",
    warning = "warning",
    error = "error"
}
export enum userMenu {
    exit= "退出",
    information="个人信息"
}
export type Nullable<T> = T | null;
export let loading = null
export const loginInfoStr: string = "loginInfo"
export const accessTokenStr: string = "accessToken"
export const baseURL = '/iyuhao'
export const globalInfo = {
    imageUpload: baseURL + "/common/upload",
    imageUrl: baseURL + '/common/download/?name='
}