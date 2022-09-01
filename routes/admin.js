const express = require('express');
var router = express.Router();

// 引入AdminModel
const { AdminModel } = require('../models/admin');

//过滤属性
const filter = { password: 0, __v: 0 };

/**
 * @typedef AdminRegister
 * @property {string} username.required - 名称
 * @property {string} password.required - 密码
 * @property {string} email.required - 邮箱
 * @property {string} role.required - 角色
 */

/**
 * @typedef Response
 * @property {number} code
 * @property {string} message
 * @property {object} result
 * @property {boolean} success
 */
// /**
//  * 管理员注册
//  * @route POST /admin/register
//  * @summary 管理员注册
//  * @group admin - 管理员模块
//  * @param {AdminRegister.model} request.body.required - 管理员注册参数
//  * @returns {Response.model} 200 - OK
//  * @returns {Error} 404 - Not Found
//  * 
//  */
router.post('/register', function (req, res) {
  //1.获取请求参数
  const { username, password, email, role, status } = req.body;
  debugger

  if (!email || role === undefined) {
    res.send({ code: 500, message: '用户信息不完整', success: false, result: null })
    return;
  }
  //2.处理
  //判断用户是否已经存在
  AdminModel.findOne({ username, email }, function (error, user) {
    if (user) {
      //3.返回响应数据
      res.send({ code: 500, message: '此用户名已存在', success: false, result: null });
    } else {
      //3.返回响应数据
      const adminModel = new AdminModel({ username, password, email, role, status });
      adminModel.save(function (error, user) {
        //返回响应数据
        const data = { id: user._id, username, role, email, status };
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

  //2.处理
  //判断用户名密码是否正确
  //返回的user数据，过滤掉filter中包含的属性
  AdminModel.findOne({ username, password }, filter, function (error, user) {
    if (user) {
      //3.返回响应数据"登录成功"
      const { _id: id, username, role } = user
      res.send({ code: 200, result: { id, username, role }, success: true, message: '登录成功'});
    } else {
      res.send({ code: 500, message: "用户名或密码不正确！", success: false, result: null })
    }
  })

})

/**
 * @typedef AdminUpdate
 * @property {string} id - 主键
 * @property {string} username - 名称
 * @property {string} email - 邮箱
 * @property {string} role - 角色
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
  const { id, username, email, role, status } = req.body;
  AdminModel.findByIdAndUpdate(id, { username, email, role, status }, function (err, admin) {
    if (!err) {
      //返回响应数据
      const { _id: id, username, role, email, status } = admin
      res.send({ code: 200, message: '修改成功', success: true, result: { id, username, role, email, status } });
    } else {
      res.send({ code: 500, message: '修改失败', success: false, result: null })
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
 * @property {string} username - 管理员名称（模糊查询）
 * @property {number} role - 角色
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
router.post('/list', async function (req, res) {
  const { pageInfo: { pageNo = 1, pageSize = 10 } } = req.body;
  const total = await AdminModel.countDocuments({});
  // AdminModel.find({}, filter, { limit: pageSize, skip: (pageNo-1)*pageSize }, function (err, list) {
  //   if (err) {
  //     res.send({ code: 500, message: '查询失败', success: false, result: null })
  //   } else {
  //     res.send({ code: 200, result: { list, total }, success: true, message: '查询成功' })
  //   }
  // })
  AdminModel.aggregate([
    { $skip: (pageNo - 1) * pageSize },
    { $limit: pageSize },
    { $project: { id: "$_id", username: 1, email: 1, role: 1, status: 1, _id: 0 } },
  ], (err, list) => {
    if (err) {
      res.send({ code: 500, message: '查询失败', success: false, result: null })
    } else {
      res.send({ code: 200, result: { list, total }, success: true, message: '查询成功' })
    }
  })
})
module.exports = router;