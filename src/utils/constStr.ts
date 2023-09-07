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
export const accessInfoStr: string = "adminInfo"
export const baseURL = '/iyuhao'
export const globalInfo = {
    imageUpload: baseURL + "/common/upload",
    imageUrl: baseURL + '/common/download/?name='
}



export const predefineColors = [
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
]