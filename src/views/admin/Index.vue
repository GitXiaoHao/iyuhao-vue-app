<template>
  <div class="common-layout">
    <el-container>
      <el-header class="ad-header">
        <AdminHeader/>
      </el-header>
      <el-main class="ad-main">Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script setup>

import AdminHeader from "@/views/admin/components/AdminHeader.vue";
</script>

<style scoped>


.ad-header{
  width: 100%;
  /*height: 100px;*/
  background-color: #aed0ee;
}
</style>