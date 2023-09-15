<template>
  <div class="footer">
    <div class="top-image">
      <span class="iconfont icon-QQ"></span>
      <span class="iconfont icon-weixin"></span>
      <span class="iconfont icon-weibo"></span>
      <span class="iconfont icon-github"></span>
    </div>
    <hr/>
    <div class="bottom-text">
      <div style="width:300px;margin:0 auto; padding:20px 0;">
        <img src="@/assets/image/beian.png" alt="">
        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42030402000172" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">鄂公网安备 42030402000172号</p></a>
      </div>
      <span>
          <a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2023011277号</a>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.footer {
  background-color: #464646;
  height: 100%;
  width: 100%;
  padding-top: 25px;

  .top-image {
    display: flex;
    justify-content: space-around;
    margin: 20px 18px;

    span {
      font-size: 28px;
      color: white;
      cursor: pointer;
    }
    span:hover{
      color: #99bcac;
    }
  }

  hr {
    width: 80%;
    margin: 10px auto;
    height: 1px;
    background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            cyan,
            rgba(0, 0, 0, 0)
    );
  }

  .bottom-text {
    margin-top: 25px;
    span {
      font-size: 15px;
      a {
        text-decoration: none;
      }
      a:link,a:visited,a{
        color: #eaeef1;
      }
      a:hover{
        color: #87c0ca;
      }
    }
  }
}
</style>