const express = require('express');
var router = express.Router();

// 引入UserModel
const { AdminModel } = require('../db/models');
//加密
const md5 = require('blueimp-md5');
//过滤属性
const filter = {password: 0,__v:0};

//路由：
/**
 * 管理员注册
 * @route POST /api/admin/register
 * @group admin - Operation about admin
 * @param {string} username.query.required - 请输入用户名
 * @param {string} password.query.required - 请输入密码
 * @param {string} email.query.required - 请输入邮箱
 * @param {string} adminLevel.query.required - 请输入管理员等级
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * 
 */
router.post('/register', function (req, res) {
  //1.获取请求参数
  const { username, password, email, adminLevel, avatar } = req.body;
  
    if(!email || adminLevel===undefined){
      res.send({ code: 1, msg: '用户信息不完整'})
      return;
    }
    //2.处理
    //判断用户是否已经存在
    AdminModel.findOne({username},function(error,user){
      if(user){
        //3.返回响应数据
        res.send({code:1,msg:'此用户名已存在'});
      }else{
        //3.返回响应数据
        const adminModel = new AdminModel({username,password:md5(password),email,adminLevel,avatar});
        adminModel.save(function(error,user){
          //生成一个cookie,并交给浏览器保存
          res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});

          //返回响应数据
          const data = {_id:user._id,username,adminLevel,avatar,email};
          res.send({code:0,data:data,msg: '注册成功'})
        })
      }
    })  
})

//路由：管理员登录
/*
* path: /login
* method：POST
* params: username,password
* success：{code:0,data{_id:'abc',username:'xxx',password:'123'}}
* fail：{code:1,msg:'此用户已存在'}
* */
router.post('/login',function(req,res){
  //1.获取请求参数
  const { username, password } = req.body;

  //2.处理
  //判断用户名密码是否正确
  //返回的user数据，过滤掉filter中包含的属性
  AdminModel.findOne({username,password:md5(password)},filter,function(error,user){
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

//修改管理员信息
router.post('/update', function(req, res){
  const { _id, username, email, adminLevel, avatar } = req.body;
  AdminModel.findByIdAndUpdate(_id,{username,email,adminLevel,avatar},function(err,admin){
    if(!err){
      res.send({ code: 0, msg: '修改成功'});
    }else{
      res.send({ code: 1, msg: '修改失败'})
    }
  })
})

//删除管理员
router.post('/delete', function(req, res){
  const { id } = req.body;
  AdminModel.findByIdAndDelete(id, function(err){
    if(!err){
      res.send({ code: 0, msg: '删除成功'});
    }else{
      res.send({ code: 1, msg: '删除失败'})
    }
  })
})

//管理员列表
router.post('/list',function(req,res){
    AdminModel.find({},filter,function(err,admins){
        if(err){
            res.send({ code: 1, msg: '查询失败' })
        }else{
            res.send({ code: 0, data: admins })
        }
    })
}) 
module.exports = router;