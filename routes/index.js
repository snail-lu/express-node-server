var express = require('express');
var https = require('https');
var router = express.Router();

// 引入UserModel
const {UserModel,ChatModel,CateModel} = require('../db/models');
//加密
const md5 = require('blueimp-md5');
//过滤属性
const filter = {password: 0,__v:0};

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.ip, 'ip')
  res.render('index', { title: 'Express' });
});


//路由：获取当前用户所有相关聊天信息列表
/*
* path: /msglist
* method：post
* params:
* success：{code:0,data:userList}}
* fail：{code:1,msg:'请先登录'}
* */
router.get('/msglist',function(req,res){
  //1.获取cookie中的用户id
  const userid = req.cookies.userid;

  UserModel.find(function(error,userDocs) {
    const users = {};
    userDocs.forEach(doc=>{
      users[doc._id] = {username: doc.username,header:doc.header}
    })

    //查询userid相关的所有聊天信息
    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function(err,chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}})  //更新的数量
    })
  })

})

//路由：修改指定消息为已读
/*
* path: /readmsg
* method：post
* params: 参数1：查询条件
*         参数2：更新为指定的数据对象
*         参数3：是否1次更新多条，默认只更新一条
*         参数4：更新完成的回调函数
* */
router.post('/readmsg',function(req,res){
  //1.得到请求中的from和to
  const {from} = req.body;
  const to = req.cookies.userid;

  ChatModel.update({from,to,read:false},{read: true},{multi:true},function(error,doc) {
      res.send({code: 0, data: doc.nModified});
  })

})

//测试用接口
router.post('/getmsg',function(req,res){
  //1.得到请求中的from和to
  const userid = req.cookies.userid;
  // const {to} = req.body.form;
//查询一个
  ChatModel.find({from:userid},function(error,chat) {
    res.send({code: 0, data: chat});
  })

})

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
