//
// @/rabbit/router/index.ts
// 路由设计
// createRouter 创建router实例对象
// createWebHashHistory 创建history模式的路由
//

import {createRouter, createWebHashHistory, RouteLocationNormalized, Router} from "vue-router";
import type {App} from 'vue';
import {accessTokenStr, MsgType} from "@/utils/constStr";
import {useUserStore} from "@/store/modules/user";
import {appearMessageBox} from "@/utils/elementUtils";
import blogRouter from "@/router/modules/blog";


const constantRoutes = [

]


const routers = [...blogRouter, ...constantRoutes,]

export const router: Router = new createRouter({
    routes: routers,
    history: createWebHashHistory(),
    linkActiveClass: 'active',
})
const defaultTitle = 'home';
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    //是否有token
    document.title = to.meta.title ? to.meta.title : defaultTitle;
    if (to.path == '/login') {
        return next()
    }
    const userStore = useUserStore()
    const accessToken = userStore.getToken
    if (!accessToken) {
        //没有token
        //弹窗
        appearMessageBox("没有登陆，请先登录", "提示", MsgType.warning, '登录', '退出')
            .then(r => {
                router.push('/login').then(r => {
                })
                return
            }).catch(r => {

            return
        })
    }
    next();
})


// config router
export function setupRouter(app: App<Element>) {
    app.use(router);
}
