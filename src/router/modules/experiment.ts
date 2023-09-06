export const experimentBasePath = "/java/experiment"


export const experimentRouter = [
    {
        path: experimentBasePath,
        name: 'JavaWeb实验',
        meta: {
            title: 'JavaWeb实验',
        },
        component: () => import("@/views/experiment/Index.vue"),
        children: [

        ]
    },
    {
        path: experimentBasePath + '/1',
        name: '博客管理',
        component: () => import("@/views/experiment/one/Index.vue")
    },
    {
        path: experimentBasePath + '/2',
        name: '分类管理',
        component: () => import("@/views/blog/manage/server/Category.vue")
    },
]
