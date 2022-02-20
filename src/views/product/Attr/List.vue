<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelector @changeCategory="changeCategory" ></CategorySelector>
    </el-card>
    <el-card></el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  methods:{
    changeCategory(){
      console.log(111)
    }
  }
};
</script>

<style>
</style>
