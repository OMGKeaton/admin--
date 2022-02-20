<template>
  <div class="dashboard-container">
    <el-button  type="primary" @click="allPrint">批量打印</el-button>
    <el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="180" />
      <el-table-column label="文件" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.src" class="table_img">
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="print(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--startprint-->
    <div id="printcontent" ref="printcontent">
      <img v-for="item in multipleSelection" :key="item.id" :src="item.src" class="print_img">
    </div>
    <!--endprint-->
    <el-button class="filter-item" type="primary" @click="printingShopee">测试报表打印</el-button>
    <pdf :src="testSrc"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        id: 1,
        src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      },
      {
        id: 2,
        src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
      }, { id: 3, src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg' },
      {
        id: 4,
        src: 'http://www.pwithe.com/Public/Upload/download/20170211/589ebf8e5bb13.pdf',
      },
      ],
      // 打印的数组
      multipleSelection: []
    }
  },
  methods: {
    print(row = {}) {
      if (row.src) {
        this.multipleSelection.push(row)
      }
      this.$nextTick(() => {
        var bdhtml = window.document.body.innerHTML // 获取body的内容
        var jubuData = document.getElementById('printcontent').innerHTML // 获取要打印的区域内容
        window.document.body.innerHTML = jubuData
        window.print() // 调用浏览器的打印功能
        window.document.body.innerHTML = bdhtml // body替换为原来的内容
        window.location.reload() // 刷新页面，如果不刷新页面再次点击不生效或打印使用新窗口实现打印
      })
    },
    allPrint() {
      this.print()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss">
.dashboard-container {
  .table_img {
    width: 50px;
    height: 50px;
  }
  #printcontent{
    display: none;
  }
}
//使用媒体查询    设置预览时的样式
@media print{
  @page {
    margin: 0;
    size: portrait;   //设置打印布局portrait为纵向；landscape为横向
  }
  #printcontent{
    width: 100%;
  }
  .print_img{
    display: block;
    width: 100%;
    height: 100%;
    margin: auto auto;
  }
}

</style>
