<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <!-- 表单 -->
    <el-table  style="width: 100%; margin: 20px 0" :data="trademarkList">
      <el-table-column
        align="center"
        type="index"
        prop="prop"
        label="序号"
        width="80px"
      />
      <el-table-column
        prop="tmName"
        label="品牌属性"
        width="width"
        align="center"
      />
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 80px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-deit"
            @click="changeDialog(row)"
            >修改</el-button
          >
          <el-button type="promary" icon="el-icon-delete" @click="deleteTrademark(row)">删除</el-button>
        </template> </el-table-column
      >>
    </el-table>
    <!-- 页码 -->
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      style="text-align: center"
      :page-count="7"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout=" prev, pager, next,jumper,->,total, sizes"
      :total="total"
    >
    </el-pagination>
    <!-- 添加表格 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- from和table最常用，一个收集数据，一个展示数据，在使用form的时候需要加入：model来收集数据 ,
      使用v-model来双向绑定收集具体数据-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop='tmName'>
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            show-file-list: 指定是否显示上传图片的列表, 如果是false, 只显示一张
            action: 处理上传图片请求的地址  ==> 通过代理解决跨域的问题
            on-success: 用来指定上传成功时的回调函数
            before-upload: 在准备发上传请求前调用, 如果返回false不发请求, 用来检查文件类型和大小
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrchangeDia">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogFormVisible: false,
      // logoUrl: "",图片服务器地址的不要定义了
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则,change是改变就触发，blur是失去焦点触发
        rules: {
          tmName: [
            { required: true, message: '请输入活动名称', trigger: 'change' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
          ],
          logoUrl: [
            { required: true, message: '请选择LOGO', trigger: 'change' }
          ],
        }
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    // 首页数据
    async getTrademarkList(page = 1) {
      // 换页的时候page需要更新
      this.page = page;
      try {
        const result = await this.$API.trademark.getPageList(
          this.page,
          this.limit
        );
        if (result.code === 200 || result.code === 2000) {
          console.log(result.data);
          this.trademarkList = result.data.records;
          this.total = result.data.total;
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 页面的展示多少个数据
    handleSizeChange(size) {
      this.limit = size;
      // 再重新发一次请求
      this.getTrademarkList();
    },
    // 图片路径
    handleAvatarSuccess(res, file) {
      // 下面获取的是本地图片路径，我们需要获取服务器图片路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(this.imageUrl)
      // 这个打印的是服务器的图片地址是我们所需要的
      // console.log(res,file)
      this.tmForm.logoUrl = res.data;
    },
    // 图片校验规则
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮
    showAddDialog() {
      this.dialogFormVisible = true;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 修改dialog
    changeDialog(row) {
      this.dialogFormVisible = true;
      // 下面这种赋值会出现取消后也会修改，只有刷新才不会，因为是修改了row里的数据会直接也修改dialog数据，
      // 所以要用到深浅拷贝，问答什么是深浅拷贝，什么是赋值，怎么区分？
      // tmForm里的数据都是字符串，不是对象，所以就浅拷贝就行
      this.tmForm = { ...row };
    },
      
     
    // 确定时修改或者添加数据
     addOrchangeDia() {
      // 1.获取参数
      // 2.整理参数
      // 3.发请求
      // 4.成功或失败
// 在添加或者修改时候整体验证规则，所以需要加入到修改或者添加中
         this.$refs.tmForm.validate(async(valid) => {
          if (valid) {
             let trademark = this.tmForm;
      console.log(trademark.logoUrl);
      // 得到的tmForm里的数据就是所需的，无需整理
      try {
        const result = await this.$API.trademark.addOrUpdate(trademark);
        console.log(result);
        if (
          result.code === 200 ||
          result.code === 20000 
        ) {
          this.$message.success(trademark.id ? "修改成功" : "添加成功");
          console.log(111);
        } else {
          this.$message.error(trademark.id?'请求修改失败':'请求添加失败')
        }
      } catch (error) {
        this.$message.error("请求失败");
        console.log(error);
      }
      // 关闭页面
      this.dialogFormVisible = false;
      // 重新获取页面，需要主要，如果时添加就回到首页，如果时修改就在当前页
      this.getTrademarkList(trademark.id ? this.page : 1);
          } else {
           this.$message.err('error submit!!');
            return false;
          }
        });
      
     
    },
    // 删除按钮
    deleteTrademark(row){
      this.$confirm(`确定删除${row.tmName}吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            const result = await this.$API.trademark.delete(row.id)
            if( result.code === 200 || result.code === 20000 ) {
              this.$message.success('删除成功!');
              this.getTrademarkList(this.trademarkList.leng>1?this.page:this.page-1)
            }else {
              this.$message.error("删除失败")

            }
          } catch (error) {
              this.$message.error("删除失败")
          }     
        });
      },
    },
  }
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
