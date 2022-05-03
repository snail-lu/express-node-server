var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

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

// 路由：更新用户信息
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

module.exports = router;
