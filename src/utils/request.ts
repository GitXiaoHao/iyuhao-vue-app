import axios from "axios";
import {appearLoading, appearMessage} from "@/utils/elementUtils";

interface requestType{
    url: string,
    params: FormData | string,
    showLoading: boolean,
    dataType: requestEnum
}


enum requestEnum {
    json = "json",
    file = "file",
    form = "form"
}

const baseURL = '/iyuhao'
const timeout = 3000
const contentTypeForm = "application/x-ww-form-urlencoded;charset=UTF-8"
const contentTypeJson = "application/json"
const contentTypeFile = "multipart/form-data"

const request = (config: requestType) => {
    let { url, params, showLoading} = config;
    let dataType: requestEnum = config.dataType
    dataType = dataType ? requestEnum.form : dataType
    showLoading = showLoading ? true : showLoading
    let contentType = contentTypeForm
    if(dataType == requestEnum.json){
        contentType = contentTypeJson
    }else if(dataType == requestEnum.file){
        contentType = contentTypeFile
        //加入额外参数
        let param = new FormData()
        for(let key in params){
            param.append(key,params[key])
        }
        params = param
    }
    const instance = axios.create({
        baseURL: baseURL,
        timeout: timeout,
        headers: {
            'Content-Type': contentType,
            'X-Request-With': 'XMLHttpRequest'
        }
    })
    let loading = null
    //请求前拦截
    instance.interceptors.request.use(
        (config) => {
            if(showLoading){
                loading = appearLoading()
            }
            return config
        },
        (error) => {
            if(showLoading && loading){
                loading.close()
            }
            appearMessage.error("发送请求失败")
            return Promise.reject("发送请求失败")
        }
    )

    //请求后拦截
    instance.interceptors.response.use(
        (response) => {
            if(showLoading && loading){
                loading.close()
            }
            const responseData = response.data

            return response
        },
        (error) => {
            if(showLoading && loading){
                loading.close()
            }
            appearMessage.error("网络异常")
            return Promise.reject("网络异常")
        }
    )
}