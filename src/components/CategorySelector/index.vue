<template>
  <el-form :inline="true" :model='cForm'>
        <el-form-item label="一级分类">
          <!-- 在select和option里必须有value这个属性 -->
          <!-- select中的value就是选中的valuid值，也可以是其他值，本项目中使用的是其id值 -->
          <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handlerList1">
            <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in category1List" :key="c1.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handlerList2">
            <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in category2List" :key="c2.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handlerList3">
            <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in category3List" :key="c3.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
</template>

<script>
export default {
    name: "CategorySelector",
    data() {
      return {
        category1List:[],
        category2List:[],
        category3List:[],
        cForm:{
          category1Id:'',
          category2Id:'',
          category3Id:''
        }
      }
    },
    mounted() {
      this.getCategory1List()
    },
    methods:{
      async getCategory1List(){
        const result = await this.$API.category.getCategory1()
        if(result.code === 200 || result.code === 20000){
          this.category1List = result.data
        }
      },
     async handlerList1(category1Id){
        // 每次点击清除一下，防止重新选中老的还在
      this.cForm.category3Id = '',
      this.cForm.category2Id = '',
        this.category2List = [],
        this.category3List = []
        // 组件间通信
        this.$emit('changeCategory')
        const result = await this.$API.category.getCategory2(category1Id)
        if(result.code === 200 || result.code === 20000){
          this.category2List = result.data
        }
      },
      async handlerList2(category2Id){
        // 每次点击清除一下，防止重新选中老的还在
        this.cForm.category3Id = '',
        this.category3List = []
        // 组件间通信
        this.$emit('changeCategory')
        const result = await this.$API.category.getCategory3(category2Id) 
        if(result.code === 200 || result.code === 20000){
          this.category3List = result.data
        }
      },
      async handlerList3(category3Id){
        // const result = await this.$API.category.getCategory2('category1Id')
        // if(result.code === 200 || result.code === 20000){
        //   this.category2List = result.data
        
        // }
        // 组件间通信
        this.$emit('changeCategory')
      }
    }
}
</script>

<style>

</style>