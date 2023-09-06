const blogBasePath = "/blog/manage"
const blogRouter = [
    {
        path: blogBasePath,
        name: '管理端',
        meta: {
            title: '博客管理',
        },
        redirect: blogBasePath + '/administration',
        component: () => import("@/views/blog/manage/Index.vue"),
        children: [
            {
                path: blogBasePath + '/administration',
                name: '博客管理',
                component: () => import("@/views/blog/manage/server/Administration.vue")
            },
            {
                path: blogBasePath + '/category',
                name: '分类管理',
                component: () => import("@/views/blog/manage/server/Category.vue")
            },
            {
                path: blogBasePath + '/special',
                name: '专题管理',
                component: () => import("@/views/blog/manage/server/Special.vue")
            },
            {
                path: blogBasePath + '/userInformation',
                name: '个人信息',
                component: () => import("@/views/blog/manage/server/UserInformation.vue")
            },
            {
                path: blogBasePath + '/member',
                name: '博客成员',
                component: () => import("@/views/blog/manage/server/Member.vue")
            },
        ],
    },
    {
        path: blogBasePath + '/login',
        name: '博客成员',
        component: () => import("@/views/blog/manage/server/Login.vue")
    },
]
export default blogRouter