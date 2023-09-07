import {defineStore} from "pinia";
import {accessInfoStr, accessTokenStr, Nullable} from "@/utils/constStr";
import {UserInfo} from "@/types/user";


interface UserState {
    userInfo: UserInfo,
    token: string | undefined
}

export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        userInfo: {},
        token: undefined
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['userInfo','token']
            }
        ],
    },
    getters: {
        getUserInfo(): UserInfo {
            return this.userInfo
        },
        getToken(): string {
            return this.token || localStorage.getItem(accessTokenStr)
        }
    },
    actions: {
        setUserInfo(info: UserInfo) {
            Object.assign(this.userInfo, info)
        },
        setToken(tokenInfo: string | undefined) {
            this.token = tokenInfo ? tokenInfo : ''
            if(tokenInfo == ''){
                localStorage.removeItem(accessTokenStr)
                return
            }
            localStorage.setItem(accessTokenStr, this.token);
        }
    }
})