<template>
  <div class="navigation-body">
    <input type="checkbox" id="menu_btn">
    <label class="menu-btn" for="menu_btn" @click="navigationClick">
      <span class="iconfont icon-daohang" v-if="iconChange"></span>
      <span class="iconfont icon-cha" v-else></span>
    </label>
    <div class="wrapper">
      <ul class="menu">
        <li><a href="#">首页</a></li>
        <li><a href="#">关于我们</a></li>
        <li><a href="#">服务</a></li>
        <li><a href="#">案例</a></li>
        <li><a href="#">用户反馈</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const  iconChange = ref(true)
const navigationClick = () => {
  console.log("123")
  iconChange.value = !iconChange.value
}
</script>

<style scoped>
*{
  /* 固定定位 窗口滚动也不会移动 */
  /*position: fixed;*/
  /* 初始化 取消页面的内外边距 */
  margin: 0;
  padding: 0;
  /* 这个是告诉浏览器：你想要设置的边框和内边距的值是包含在总宽高内的 */
  box-sizing: border-box;
  z-index: 999;
}
.navigation-body{

}
.wrapper{
  /* 固定定位 窗口滚动也不会移动 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 渐变背景 */
  background: linear-gradient(200deg,#ec77ab,#7873f5);
  /* 将元素剪切为一个圆形【25px表示圆的直径】【calc(100% - 45px) 45px表示圆心】 */
  clip-path: circle(25px at calc(100% - 45px) 45px);
  /* 过渡动画 */
  transition: all 0.3s ease-in-out;
}
.menu-btn{

  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 1000;
  /* 渐变背景 */
  background: linear-gradient(200deg,#ec77ab,#7873f5);
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  /* 这里也加个过渡动画 */
  transition: all 0.3s ease;
}
.iconfont{
  font-size: 25px;
}
/* 把复选框隐藏 */
#menu_btn{
  display: none;
}
#menu_btn:checked ~ .wrapper{
  /* 将元素剪切为一个圆形 75%表示圆的直径 */
  clip-path: circle(75%);
}
#menu_btn:checked ~ .menu-btn{
  color: #d576ba;
  background: #fff;
}

.wrapper ul{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  list-style: none;
  text-align: center;
}
.wrapper ul li{
  margin: 30px 0;
}
.wrapper ul li a{
  color: #fff;
  text-decoration: none;
  font-size: 30px;
  font-weight: 500;
  padding: 5px 50px;
  position: relative;
  line-height: 50px;
}
.wrapper ul li a::after{
  content: "";
  position: absolute;
  width: 100%;
  height: 50px;
  background: #fff;
  z-index: -1;
  border-radius: 50px;
  left: 0;
  transform: scaleY(0);
  /* 加个动画过渡 */
  transition: transform 0.3s ease;
}
.wrapper ul li a:hover::after{
  transform: scaleY(1);
}
.wrapper ul li a:hover{
  color: #d576ba;
}
</style>