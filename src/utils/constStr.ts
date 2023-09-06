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

export enum ButtonType {
    primary = "primary",
    success = "success",
    warning = "warning",
    info = "info",
    danger = "danger"
}

export enum DT {
    update = "update",
    add = "add"
}

export type Nullable<T> = T | null;
export const accessTokenStr: string = "accessToken"
export const baseURL = '/iyuhao'
export const globalInfo = {
    imageUpload: baseURL + "/common/upload",
    imageUrl: baseURL + '/common/download/?name='
}