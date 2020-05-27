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
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//路由：用户注册
/*
* path: /register
* method：POST
* params: username,password,type
* admin是已注册用户
* success：{code:0,data{_id:'abc',username:'xxx',password:'123'}}
* fail：{code:1,msg:'此用户已存在'}
* */
router.post('/register',function(req,res){
  //1.获取请求参数
  const {username,password,type} = req.body;
  //2.处理
    //判断用户是否已经存在
    UserModel.findOne({username},function(error,user){
      if(user){
        //3.返回响应数据
        res.send({code:1,msg:'此用户已存在'});
      }else{
        //3.返回响应数据
        const userModel = new UserModel({username,password:md5(password),type});
        userModel.save(function(error,user){
          //生成一个cookie,并交给浏览器保存
          res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});

          //返回响应数据
          const data = {_id:user._id,username,type};
          res.send({code:0,data:data})
        })
      }
    })

})
//路由：用户登录
/*
* path: /login
* method：POST
* params: username,password
* success：{code:0,data{_id:'abc',username:'xxx',password:'123'}}
* fail：{code:1,msg:'此用户已存在'}
* */
router.post('/login',function(req,res){
  //1.获取请求参数
  const {username,password} = req.body;
  //2.处理
  //判断用户名密码是否正确
  //返回的user数据，过滤掉filter中包含的属性
  UserModel.findOne({username,password:md5(password)},filter,function(error,user){
    if(user){
      //3.返回响应数据"登录成功"
      res.cookie('userid',user._id,{maxAge:100*60*60*24*7});
      res.send({code:0,data:user});
    }else{
      //3.
      res.send({code:1,msg:"用户名或密码不正确！"})
    }
  })

})

//路由：小程序 微信登录
/*
* path: /wxlogin
* method：POST
* params: username,password
* success：{code:0,data{_id:'abc',username:'xxx',password:'123'}}
* fail：{code:1,msg:'此用户已存在'}
* */
router.post('/wxlogin',function(req,res){
  //1.获取请求参数
  let code = req.body.code;
  console.log(code);
  let appId = "wx531afe87c91b8125";
  let appSecret = "3a629da2e10e2ed83db14775333316db";

  // https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

  let options = {
    hostname: 'api.weixin.qq.com',
    path: '/sns/jscode2session?appid='+appId+"&secret="+appSecret+"&js_code="+code+"&grant_type=authorization_code",
    method: 'GET'
  };

  var wxreq = https.request(options, function (res1) {
    res1.setEncoding('utf8');
    res1.on('data', function (chunk) {
      res.send({code:0,data:chunk});
    });
  });

  wxreq.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });

  wxreq.end();

})

//路由：更新用户信息
/*
* path: /update
* method：POST
* params: header,info,
* success：{code:0,data{_id:'abc',username:'xxx',password:'123'}}
* fail：{code:1,msg:'此用户已存在'}
* */
router.post('/update',function(req,res){
  //1.获取请求参数
  const userid = req.cookies.userid;
  //2.处理
  //判断缓存中的userid是否存在
  if(!userid) {
    //3.返回响应数据"登录成功"
    res.send({code: 1, msg: "请先登录"});
  }
  //3.根据userid更新对应的用户信息
  const user = req.body;
  UserModel.findByIdAndUpdate({_id:userid},user,function(error,oldUser){
    if(!oldUser){  //cookie中保存的userid在数据库中没有相应的用户信息
      //通知浏览器删除这个没用的userid cookie
      res.clearCookie('userid');
      //返回一个提示信息
      res.send({code:1,msg:'请先登录'})
    }else{
      const {_id,username,type} = oldUser;
      const data = Object.assign(user,{_id,username,type});
      res.send({code:0,data})
    }
  })

})

//路由：获取用户信息（根据cookie）
/*
* path: /user
* method：get
* params:
* success：{code:0,data:user}}
* fail：{code:1,msg:'请先登录'}
* */
router.get('/user',function(req,res){
  //1.获取cookie中的userid
  const userid = req.cookies.userid;
  //2.处理
  //判断缓存中的userid是否存在
  if(!userid) {
    //3.返回响应数据"登录成功"
    res.send({code: 1, msg: "请先登录"});
  }
  //3.根据userid查询对应的用户信息
  UserModel.findOne({_id:userid},filter,function(error,user) {
    res.send({code: 0, data: user});
  })

})

//路由：获取用户列表
/*
* path: /userlist
* method：post
* params:
* success：{code:0,data:userList}}
* fail：{code:1,msg:'请先登录'}
* */
router.post('/userlist',function(req,res){
  //1.获取用户类型
  const {type} = req.body;

  UserModel.find({type},filter,function(error,user) {
    res.send({code: 0, data: user});
  })

})


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
