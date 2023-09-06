import {defineStore} from "pinia";

import {UserInfo} from "@/types/user";
import {BlogCategory} from "@/types/blog/category";
import {BlogStatus} from "@/types/blog/status";


/**
 *
 */
interface BlogStoreState {
    //分类集合
    categoryList: Array<BlogCategory>,
    statusList: Array<BlogStatus>
}


export const useBlogStore = defineStore({
    id: 'blog',
    state: (): BlogStoreState => ({
        categoryList: [],
        statusList: [],
    }),
    getters: {
        getCategoryList(): Array<BlogCategory> {
            return this.categoryList
        },
        getStatusList(): Array<BlogStatus> {
            return this.statusList
        }
    },
    actions: {
        setCategoryList(categoryList: BlogCategory) {
            if (categoryList) {
                Object.assign(this.categoryList, categoryList)
            }
        },
        setStatusList(statusList: BlogStatus) {
            if (statusList) {
                Object.assign(this.statusList, statusList)
            }
        }
    }
})