import httpInstance from "@/utils/http";
const statusPath = "/blogStatus/"
export function getStatusList() {
    return httpInstance({
        url: statusPath + 'list',
        method: 'get',
        data: {
            "showLoading": false
        }
    })
}