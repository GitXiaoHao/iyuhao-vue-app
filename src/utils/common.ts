export default function go (id:String){
    document.querySelector(id).scrollIntoView({
        // 不想要滚动动画,则设置为"instant"
        behavior: 'smooth', // 滚动动画
        block: 'center'
    });
}