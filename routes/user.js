var express = require('express');
var router = express.Router();

// 引入UserModel
const { UserModel } = require('../models/user');

//过滤属性
const filter = { password: 0, __v: 0 };

/**
 * @typedef UserRegister
 * @property {string} username.required - 名称
 * @property {string} password.required - 密码
 */

/**
 * @typedef Response
 * @property {number} code
 * @property {string} message
 * @property {object} result
 * @property {boolean} success
 */
/**
 * 用户注册
 * @route POST /user/register
 * @summary 用户注册
 * @group user - 用户模块
 * @param {UserRegister.model} request.body.required - 用户注册参数
 * @returns {Response.model} 200 - OK
 * @returns {Error} 404 - Not Found
 */

router.post('/register', function (req, res) {
  //1.获取请求参数
  const { username, password } = req.body;

  if (!username) {
    res.send({ code: 500, message: '用户名不可为空', success: false, result: null })
    return;
  }

  if (!password) {
    res.send({ code: 500, message: '密码不可为空', success: false, result: null })
    return;
  }
  //2.处理
  //判断用户是否已经存在
  UserModel.findOne({ username }, function (error, user) {
    if (user) {
      //3.返回响应数据
      res.send({ code: 500, message: '此用户名已存在', success: false, result: null });
    } else {
      //3.返回响应数据
      const userModel = new UserModel({ username, password });
      userModel.save(function (error, user) {
        console.log(user, 'res')
        //生成一个cookie,并交给浏览器保存
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 });

        //返回响应数据
        const data = { _id: user._id, username };
        res.send({ code: 200, result: data, message: '注册成功', success: true })
      })
    }
  })
})

/**
 * 登录
 * @route POST /user/login
 * @summary 用户登录
 * @group user - 用户模块
 * @param {UserRegister.model} request.body.required - 登录参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  404 - Not Found
 */
router.post('/login', function (req, res) {
  //1.获取请求参数
  const { username, password } = req.body;

  //2.处理
  //判断用户名密码是否正确
  //返回的user数据，过滤掉filter中包含的属性
  UserModel.findOne({ username, password }, filter, function (error, user) {
    if (user) {
      //3.返回响应数据"登录成功"
      const { _id: id, username } = user
      res.send({ code: 200, result: { id, username }, success: true, message: '登录成功'});
    } else {
      res.send({ code: 500, message: "用户名或密码不正确！", success: false, result: null })
    }
  })

})

/**
 * @typedef UserDetail
 * @property {string} username.required - 名称
 * @property {string} mobile.required - 密码
 */

/**
 * 用户详情
 * @route GET /user/detail
 * @summary 用户详情
 * @group user - 用户模块
 * @param {UserDetail.model} request.body.required - 用户注册参数
 * @returns {Response.model} 200 - OK
 * @returns {Error} 404 - Not Found
 */
router.get('/detail',function(req,res){
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

/**
 * @typedef UserList
 * @property {string} username.required - 名称
 * @property {string} mobile.required - 密码
 */

/**
 * 用户列表
 * @route POST /user/list
 * @summary 用户列表
 * @group user - 用户模块
 * @param {UserList.model} request.body.required - 用户列表查询参数
 * @returns {Response.model} 200 - OK
 * @returns {Error} 404 - Not Found
 */
router.post('/list',function(req,res){
  //1.获取用户类型
  const {type} = req.body;

  UserModel.find({type},filter,function(error,user) {
    res.send({code: 0, data: user});
  })

})

/**
 * @typedef UserUpdate
 * @property {string} username.required - 名称
 * @property {string} mobile.required - 密码
 */

/**
 * 用户信息更新
 * @route POST /user/detail
 * @summary 用户信息更新
 * @group user - 用户模块
 * @param {UserUpdate.model} request.body.required - 用户信息更新参数
 * @returns {Response.model} 200 - OK
 * @returns {Error} 404 - Not Found
 */
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
