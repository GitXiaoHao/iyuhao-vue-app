import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import {MsgType} from "@/utils/constStr";




/**
 * 弹出对话框
 * @param msg
 * @param type
 */
export const appearMessage = {
    error: (msg: string) => {
        ElMessage({
            message: msg,
            type: MsgType.error,
            duration: 2000
        })
    },
    warning: (msg: string) => {
        ElMessage({
            message: msg,
            type: MsgType.warning,
            duration: 2000
        })
    },
    success: (msg: string) => {
        ElMessage({
            message: msg,
            type: MsgType.success,
            duration: 2000
        })
    },
    info: (msg: string) => {
        ElMessage({
            message: msg,
            type: MsgType.info,
            duration: 2000
        })
    }
}

/**
 * 弹出加载框
 * @param text
 */
export const appearLoading = (text: string = "加载中") => {
    return ElLoading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.7)',
    })
}


export const appearMessageBox = (msg: string, title: string, type: MsgType = MsgType.success, confirmButtonText: string = 'OK', cancelButtonText: string = 'Cancel') => {
    return ElMessageBox.confirm(
        msg,
        title,
        {
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            type: type,
            center: true,
        }
    )
}