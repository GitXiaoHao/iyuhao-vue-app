//
// @/utils.http.js
// 本项目的axios基础的封装
//
import axios from "axios";
import {appearLoading, appearMessage,} from "@/utils/elementUtils";


import {useUserStore} from "@/store/modules/user";
import {accessTokenStr, baseURL} from "@/utils/constStr";
import {useRouter} from "vue-router";
import {nextTick} from "vue";


let loading = null

const userStore = useUserStore()
// axios.defaults.withCredentials = true
const httpInstance = axios.create({
    //基地址
    // baseURL: 'http://iyuhao.top',
    baseURL: baseURL,
    //超时时间
    timeout: 5000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,

})
//拦截器
// 添加请求拦截器
httpInstance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //是否出现加载界面
    if (!loading) {
        if (config.data.showLoading) {
            loading = appearLoading()
        } else {
            loading = null
        }
    }
    delete config.data['showLoading']
    // 设置token start
    let accessToken = userStore.getToken;
    if (accessToken && accessToken !== '') {
        config.headers.Authorization = accessToken;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    if (loading) {
        loading.close()
        loading = null
    }
    appearMessage.error("请求失败")
    return Promise.reject(error);
});

// 添加响应拦截器
httpInstance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (loading) {
        loading.close()
        loading = null
    }
    if (response.data.code == 205) {
        //登录超时
        //登出
        userStore.setUserInfo({})
        userStore.setToken('')
        appearMessage.error("登陆超时")
        setTimeout(() => {
            const router = useRouter()
            router.push('/login').then(r => {})
        },1000)
        return Promise.reject("登录超时")
    }
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (loading) {
        loading.close()
        loading = null
    }
    appearMessage.error("网络异常")
    return Promise.reject("网络异常");
});


export default httpInstance