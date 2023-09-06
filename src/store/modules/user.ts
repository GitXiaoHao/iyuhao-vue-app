import {defineStore} from "pinia";
import {accessTokenStr, Nullable} from "@/utils/constStr";
import UserInfo from "@/types/store";

interface UserState {
    userInfo: Nullable<UserInfo>,
    token: string | undefined
}

export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        userInfo: null,
        token: undefined
    }),
    getters: {
        getUsrInfo(): UserInfo{
            return <UserInfo>this.userInfo
        },
        getToken(): string {
            return this.token || localStorage.getItem(accessTokenStr)
        }
    },
    actions: {
        setUserInfo(info: UserInfo | null) {
            this.userInfo = info
        },
        setToken(tokenInfo: string | undefined) {
            this.token = tokenInfo ? tokenInfo : ''
            localStorage.setItem(accessTokenStr, this.token);
        }
    }
})