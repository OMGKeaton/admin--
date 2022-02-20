import request from '@/utils/request'

export default {
// 删除
 delete(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}` )
 },
//   GET /admin/product/baseTrademark/{page}/{limit}
  getPageList(page, limit) {
      return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },
  addOrUpdate(trademark){
    //   有id代表在修改 
      if(trademark.id){
          return request.put('/admin/product/baseTrademark/update',trademark)
      }else{
        // 无id代表在增加
        return request.post('/admin/product/baseTrademark/save',trademark)
    }
  }
} 
// DELETE /admin/product/baseTrademark/remove/{id}
// 删除BaseTrademark

// POST /admin/product/baseTrademark/save
// 新增BaseTrademark

// PUT /admin/product/baseTrademark/update
// 修改BaseTrademark

