<template>
  <div>
    <el-button class="filter-item" type="primary" @click="printingShopee">测试报表打印</el-button>
    <pdf :src="testSrc"/>
  </div>
</template>

<script>
import pdf from 'vue-pdf-signature'
// 解决部分文字不显示的问题
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
export default {
  components: {
    pdf
  },
  data() {
    return {
      testSrc: ''
    }
  },
  methods: {
    printingShopee() {
      // testSrc
      const data = {
        'param': {
          "patientName": "蒲静111",
          "diagnoseId": "0004944952",
          "recipeName": "hhhhhhh",
          "queueName": "哈哈哈",
          "lateSignDate": "okkkkk",
          "filmingNo": "13123",
          "sex": "111",
          "sns": "'287015638468063232','287015672471285760','288526367125860352'"
        },
        "reportCode": "1619747236132"
      }
      // download 请求后端接口
      download(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          //  res.result 为base64位的码
          let datas = 'data:application/pdf;base64,' + res.result
          this.testSrc = pdf.createLoadingTask({url: datas, CMapReaderFactory});
          console.log(this.testSrc)
          setTimeout(() => {
            // 通过调试检查发现pdf预览的页面是canvas绘成的
            var printContent = document.getElementsByTagName('canvas')[0];
            console.log(printContent)
            var dataUrl = printContent.toDataURL(); // 转成base64
            console.log(printContent)
            console.log(dataUrl)
            LODOP.PRINT_INIT("测试PDF打印功能");
            LODOP.SET_PRINT_PAGESIZE(3, 780, 100, '')
            // LODOP.ADD_PRINT_IMAGE("0mm","0mm","RightMargin:0mm","BottomMargin:0mm",dataUrl);
            LODOP.ADD_PRINT_IMAGE(0, 0, '100%', '100%', dataUrl)
            LODOP.SET_PRINT_STYLEA(0, "Stretch", 2);//(不可变形)扩展缩放模式
            // LODOP.SET_PRINTER_INDEX(LODOP.GET_PRINTER_NAME(-1))
            // LODOP.PRINT()
            LODOP.PREVIEW(); //预览打印
          }, 2000)
        }
      })
    },
  }
}

</script>

<style>

</style>
