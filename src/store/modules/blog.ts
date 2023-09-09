import {defineStore} from "pinia";

import {UserInfo} from "@/types/user";
import {BlogCategory} from "@/types/blog/category";
import {BlogStatus} from "@/types/blog/status";
import {BlogSpecial} from "@/types/blog/special";


/**
 *
 */
interface BlogStoreState {
    //分类集合
    categoryList: BlogCategory[],
    statusList: Array<BlogStatus>,
    specialList: Array<BlogSpecial>
}


export const useBlogStore = defineStore({
    id: 'blog',
    state: (): BlogStoreState => ({
        categoryList: [],
        statusList: [],
        specialList: [],
    }),
    getters: {
        getCategoryList(): Array<BlogCategory> {
            return this.categoryList
        },
        getStatusList(): Array<BlogStatus> {
            return this.statusList
        } ,
        getSpecialList(): Array<BlogSpecial> {
            return this.specialList
        }
    },
    actions: {
        setCategoryList(categoryList: Array<BlogCategory>) {
            if (categoryList) {
                this.categoryList.length = 0
                Object.assign(this.categoryList, categoryList)
            }
        },
        setStatusList(statusList: BlogStatus[]) {
            if (statusList) {
                this.statusList.length = 0
                Object.assign(this.statusList, statusList)
            }
        },
        setSpecialList(specialList: BlogSpecial[]) {
            if (specialList) {
                this.specialList.length = 0
                Object.assign(this.specialList, specialList)
            }
        }
    }
})