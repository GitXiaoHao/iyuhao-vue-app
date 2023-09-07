export default function go (id:String){
    document.querySelector(id).scrollIntoView({
        // 不想要滚动动画,则设置为"instant"
        behavior: 'smooth', // 滚动动画
        block: 'center'
    });
}


/**
 *  比较两个对象是否相等
 * @param oldData
 * @param newData
 */

export function isObjectValueEqual (oldData:any = {}, newData:any = {}):Boolean {
    let r = JSON.stringify(oldData);
    let l = JSON.stringify(newData);
    return r == l;
}
