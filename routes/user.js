var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//过滤属性
const filter = { password: 0, __v: 0 };

/**
 * @typedef UserRegister
 * @property {string} username.required - 名称
 * @property {string} mobile.required - 密码
 */

/**
 * @typedef Response
 * @property {number} code
 * @property {string} message
 * @property {object} result
 * @property {boolean} success
 */
/**
 * 管理员注册
 * @route POST /admin/register
 * @summary 管理员注册
 * @group admin - 管理员模块
 * @param {AdminRegister.model} request.body.required - 管理员注册参数
 * @returns {Response.model} 200 - OK
 * @returns {Error} 404 - Not Found
 */

router.post('/register', function (req, res) {
  //1.获取请求参数
  const { username, password, email, adminLevel, avatar } = req.body;

  if (!email || adminLevel === undefined) {
    res.send({ code: 500, message: '用户信息不完整', success: false, result: null })
    return;
  }
  //2.处理
  //判断用户是否已经存在
  AdminModel.findOne({ username }, function (error, user) {
    if (user) {
      //3.返回响应数据
      res.send({ code: 500, message: '此用户名已存在', success: false, result: null });
    } else {
      //3.返回响应数据
      const adminModel = new AdminModel({ username, password: md5(password), email, adminLevel, avatar });
      adminModel.save(function (error, user) {
        //生成一个cookie,并交给浏览器保存
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 });

        //返回响应数据
        const data = { _id: user._id, username, adminLevel, avatar, email };
        res.send({ code: 200, result: data, message: '注册成功', success: true })
      })
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
