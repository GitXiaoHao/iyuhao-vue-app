
const blogRouter = [
    {
        path: "/",
        name: '管理端',
        meta: {
            title: '博客管理',
        },
        redirect: '/administration',
        component: () => import("@/views/blog/manage/Index.vue"),
        children: [
            {
                path:  '/administration',
                name: '博客管理',
                component: () => import("@/views/blog/manage/server/Administration.vue")
            },
            {
                path:  '/category',
                name: '分类管理',
                component: () => import("@/views/blog/manage/server/Category.vue")
            },
            {
                path:  '/special',
                name: '专题管理',
                component: () => import("@/views/blog/manage/server/Special.vue")
            },
            {
                path:  '/userInformation',
                name: '个人信息',
                component: () => import("@/views/blog/manage/server/UserInformation.vue")
            },
            {
                path: '/member',
                name: '博客成员',
                component: () => import("@/views/blog/manage/server/Member.vue")
            },
        ],
    },
    {
        path: '/login',
        name: '博客成员',
        meta: {
            title: "登录"
        },
        component: () => import("@/views/blog/login/Index.vue")
    },
]
export default blogRouter