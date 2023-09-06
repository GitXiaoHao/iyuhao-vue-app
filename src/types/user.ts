export interface LoginUser{
    userName: string
    userPassword: string
}
export interface RegisterUser{
    userName: string
    userPassword: string
    userCheckPassword: string
    userEmail: string
    checkCode: string
}

/**
 * 后台用户
 */
export interface UserInfo{
    userId?: String
    userName?: String
    userPhone?: String
    userPassword?: String
    userCover?: String
    userEmail?:String
    userStatus?: String
    useRole?: String
    userFans?: Number
    userAutograph?: String
    userCreateTime?: String
    userUpdateTime?: String
    userLastLoginTime?: String
}


