const express = require('express');
var router = express.Router();

// 引入UserModel
const { AdminModel } = require('../db/models');
//加密
const md5 = require('blueimp-md5');
//过滤属性
const filter = { password: 0, __v: 0 };

/**
 * @typedef AdminRegister
 * @property {string} username.required - 名称
 * @property {string} password.required - 密码
 * @property {string} email.required - 邮箱
 * @property {string} adminLevel.required - 管理员等级
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
 * 
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

/**
 * @typedef AdminLogin
 * @property {string} username.required - 名称
 * @property {string} password.required - 密码
 */

/**
 * 管理员登录
 * @route POST /admin/login
 * @summary 管理员登录
 * @group admin - 管理员模块
 * @param {AdminLogin.model} request.body.required - 登录参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  404 - Not Found
 */
router.post('/login', function (req, res) {
  //1.获取请求参数
  const { username, password } = req.body;
  console.log(md5(password))

  //2.处理
  //判断用户名密码是否正确
  //返回的user数据，过滤掉filter中包含的属性
  AdminModel.findOne({ username, password: md5(password) }, filter, function (error, user) {
    if (user) {
      //3.返回响应数据"登录成功"
      res.cookie('userid', user._id, { maxAge: 100 * 60 * 60 * 24 * 7 });
      res.send({ code: 200, result: user, success: true, message: '登录成功'});
    } else {
      //3.
      res.send({ code: 500, message: "用户名或密码不正确！", success: false, result: null })
    }
  })

})

/**
 * @typedef AdminUpdate
 * @property {string} id - 主键
 * @property {string} username - 名称
 * @property {string} email - 邮箱
 * @property {string} adminLevel - 管理员等级
 */
/**
 * 管理员信息修改
 * @route POST /admin/update
 * @summary 管理员信息修改
 * @group admin - 管理员模块
 * @param {AdminUpdate.model} params.body.required - 信息修改参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  404 - Not Found
 */
router.post('/update', function (req, res) {
  const { id: _id, username, email, adminLevel } = req.body;
  AdminModel.findByIdAndUpdate(_id, { username, email, adminLevel }, function (err, admin) {
    if (!err) {
      res.send({ code: 200, message: '修改成功', success: true, result: admin });
    } else {
      res.send({ code: 500, message: '修改失败', success: false, result: admin })
    }
  })
})

/**
 * @typedef AdminDelete
 * @property {string} id - 主键
 */
/**
 * 管理员删除
 * @route POST /admin/delete
 * @summary 管理员删除
 * @group admin - 管理员模块
 * @param {AdminDelete.model} id.query.required - 请输入管理员id
 * @returns {Response.model} 200 - OK
 * @returns {Error}  default - Unexpected error
 * 
 */
router.post('/delete', function (req, res) {
  const { id } = req.body;
  AdminModel.findByIdAndDelete(id, function (err) {
    if (!err) {
      res.send({ code: 200, message: '删除成功', success: true, result: null });
    } else {
      res.send({ code: 500, message: '删除失败', success: false, result: null })
    }
  })
})

/**
 * @typedef AdminList
 * @property {string} usernameLike - 管理员名称（模糊查询）
 * @property {number} adminLevel - 管理员等级
 * @property {PageInfo.model} pageInfo.required - 分页参数
 */

/**
 * @typedef PageInfo
 * @property {number} pageNo - 页码
 * @property {number} pageSize - 每页数量
 */

/**
 * 管理员列表
 * @route POST /admin/list
 * @summary 管理员列表
 * @group admin - 管理员模块
 * @param {AdminList.model} request.body.required - 查询参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  default - Not Found
 * 
 */
router.post('/list', function (req, res) {
  AdminModel.find({}, filter, function (err, admins) {
    if (err) {
      res.send({ code: 500, message: '查询失败', success: false, result: null })
    } else {
      res.send({ code: 200, result: admins, success: true, message: '查询成功' })
    }
  })
})
module.exports = router;