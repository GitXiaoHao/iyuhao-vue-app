<template>
    <div class="experiment">
      <div class="nav">
        <Navigation></Navigation>
      </div>
      <div class="experiment-body animate__animated animate__fadeIn">
        <!-- 接下来的有点神奇了哈，划重点哦 -->
        <!-- 这里的--i是一个自定义属性 -->
        <RouterLink :style="'--i:' + index"
                    v-for="(data,index) in experimentData"
                    :to="data.to"
                    class="body-link"
        >{{ data.name }}
        </RouterLink>
        <RouterView/>
      </div>
    </div>
</template>

<script setup lang="ts">
import Navigation from "@/components/Navigation.vue";
import {reactive} from "vue";
import {experimentBasePath} from "@/router/modules/experiment";

const experimentData = reactive([
  {
    to: experimentBasePath + '/1',
    name: '实验一  常用标记使用'
  },
  {
    to: experimentBasePath + '/2',
    name: '实验二  表单开发及访问数据库'
  },
  {
    to: experimentBasePath + '/3',
    name: '实验三  对象使用'
  },
  {
    to: experimentBasePath + '/4',
    name: '实验四  JavaBean使用'
  },
  {
    to: experimentBasePath + '/5',
    name: '实验五  AJAX开发及验证码'
  }, {
    to: experimentBasePath + '/6',
    name: '实验六  综合训练'
  },
])

</script>

<style scoped lang="scss">
* {
  width: 100%;
  overflow: hidden;
  .experiment{
    background: radial-gradient(circle at center,#555,#000);
    .nav{
      z-index: 999;
    }
    .experiment-body {
      /* 弹性布局 水平、垂直居中 */
      display: flex;
      justify-content: center;
      align-items: center;
      /* 让子元素垂直排列 */
      flex-direction: column;
      /* 100%窗口宽度、高度 */
      width: 100vw;

      .body-link {
        /* 相对定位 */
        position: relative;
        /* 将a元素转为块级元素，不然无法设置宽和高 */
        display: block;
        width: 380px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        margin: 40px;
        color: plum;
        text-decoration: none;
        font-size: 20px;
        /* 这里加个动画过渡 */
        transition: all 0.3s ease-in-out;
        /* 我们来改变各个a元素的颜色【划重点】 */
        /* 大家看到效果了吧，是不是很神奇 */
        /* hue-rotate是颜色滤镜，可以加不同的度数来改变颜色，这里我们用了calc自动计算函数，以及var函数来调用我们给每一个a元素设置的不同的自定义属性1~5，然后分别乘以60度，就能够分别得到不同的颜色 */
        filter: hue-rotate(calc(var(--i) * 60deg));
      }

      .body-link::before,
      .body-link::after {
        /* 将两个伪元素的相同样式写在一起 */
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid plum;
        /* 这里也加一个动画过渡 */
        /* 最后的0.3s是延迟时间 */
        transition: all 0.3s ease-in-out 0.3s;
      }

      .body-link::before {
        top: 0;
        left: 0;
        /* 删除左边元素的右、下边框 */
        border-right: 0;
        border-bottom: 0;
      }
      .body-link::after{
        right: 0;
        bottom: 0;
        /* 删除右边元素的左、上边框 */
        border-top: 0;
        border-left: 0;
      }
      .body-link:hover{
        background-color: plum;
        color: #000;
        /* 添加发光效果和倒影 */
        box-shadow: 0 0 50px plum;
        /* below是下倒影 1px是倒影和元素相隔的距离 最后是个渐变颜色 */
        -webkit-box-reflect: below 1px linear-gradient(transparent,rgba(0,0,0,0.3));
        /* 这里我们为以上属性设置一下延迟时间 */
        transition-delay: 0.4s;
      }
      .body-link::before,
      .body-link::after{
        width: 138px;
        height: 58px;
        /* 这里不需要延迟 */
        transition-delay: 0s;
      }
    }
  }

}


/* 定义动画 */
@keyframes bgAnimation {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>