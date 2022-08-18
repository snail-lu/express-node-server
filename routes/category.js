var express = require('express');
var router = express.Router();

// 引入CateModel
const { CateModel } = require('../models/category');

//过滤属性
const filter = {password: 0,__v:0};


//路由：新增分类
/*
* path: /category/add
* method：POST
* params: parentId,categoryName
* success：{code:0,data{_id:'abc',name:'xxx',parentId:'x'}}
* fail：{code:1,msg:'此分类已存在'}
* */
router.post('/category/add',function(req,res){
  //1.获取请求参数
  const {categoryName,parentId} = req.body;
  //2.处理
  //判断分类是否已经存在
  CateModel.findOne({name:categoryName},function(error,cate){
    if(cate){
      //3.返回响应数据
      res.send({code:1,msg:'此分类已存在'});
    }else{
      //3.返回响应数据
      const cateModel = new CateModel({"name":categoryName,parentId});
      cateModel.save(function(error,cate){

        //返回响应数据
        const data = {_id:cate._id,name:cate.name,parentId:cate.parentId};
        res.send({code:0,data:data})
      })
    }
  })

})

//路由：更新分类名称
/*
* path: /category/update
* method：POST
* params: categoryId,categoryName
* success：{code:0,msg:'分类更新成功'}
* fail：{code:0,msg:'分类不存在'}
* */
router.post('/category/update',function(req,res){
  //1.获取请求参数
  const {categoryId,categoryName} = req.body;

  let cate = {name: categoryName};

  //2.根据分类id更新对应的分类信息
  CateModel.findByIdAndUpdate({_id:categoryId},cate,function(error,oldCate){
    if(!oldCate){
      //返回一个提示信息
      res.send({code:1,msg:'分类不存在'})
    }else{
      const {_id,name,parentId} = oldCate;
      const data = Object.assign({_id,name,parentId},cate);
      res.send({code:0,data})
    }
  })

})

//路由：获取分类列表
/*
* path: /category/list
* method：post
* params:
* success：{code:0,data:categoryList}}
* fail：{code:1,msg:'请先登录'}
* */
router.post('/category/list',function(req,res){
  //1.获取用户类型
  const {parentId} = req.body;

  CateModel.find({parentId},filter,function(error,list) {
    res.send({code: 0, data: list});
  })

})

module.exports = router;
