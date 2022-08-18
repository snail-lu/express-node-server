const express = require('express');
const router = express.Router();

const { ArticleModel } = require('../models/article');
const filter = { __v: 0 };

/**
 * @typedef Response
 * @property {number} code
 * @property {string} message
 * @property {object} result
 * @property {boolean} success
 */

/**
 * @typedef SearchParams
 * @property {string} title - 标题
 * @property {number} adminLevel - 管理员等级
 * @property {PageInfo.model} pageInfo.required - 分页参数
 */

/**
 * @typedef PageInfo
 * @property {number} pageNo - 页码
 * @property {number} pageSize - 每页数量
 */

/**
 * 文章列表
 * @route POST /article/list
 * @summary 文章列表
 * @group article - 文章模块
 * @param {SearchParams.model} request.body.required - 参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  404 - Not Found
 */
router.post('/list', function (req, res) {
  ArticleModel.find({}, filter, (err, articles) => {
    if (!err) {
      res.send({
        code: 0,
        data: articles || []
      })
    } else {
      res.send({
        code: 1,
        msg: err
      })
    }
  })
})

/**
 * @typedef Params
 * @property {string} title - 标题
 * @property {string} author - 作者
 * @property {string} content - 内容
 * @property {string} status - 状态
 */

/**
 * 新增文章
 * @route POST /article/add
 * @summary 文章新增
 * @group article - 文章模块
 * @param {Params.model} request.body.required - 参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  404 - Not Found
 */
router.post('/add', function (req, res) {
  const { title, content, author } = req.body;
  const currentDate = new Date();
  const publishTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", { hour12: false });
  const articleModel = new ArticleModel({ title, author, content, publishTime, status: false });
  articleModel.save(function (error, article) {
    if (!error) {
      res.send({ code: 200, message: '文章保存成功', success: true, result: article });
    }
  })

})


/**
 * 修改文章
 * @route POST /article/update
 * @summary 文章修改
 * @group article - 文章模块
 * @param {Params.model} request.body.required - 参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  404 - Not Found
 */
router.post('/update', function (req, res) {
  const { title, content, author, id } = req.body;
  const currentDate = new Date();
  const updateTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", { hour12: false });
  ArticleModel.findByIdAndUpdate(id, { title, author, content, updateTime }, function (error, article) {
    if (!error) {
      res.send({ code: 200, message: '文章保存成功', success: true, result: article });
    }
  })

})

/**
 * @typedef DetailParams
 * @property {number} id - 文章id
 */

/**
 * 文章详情
 * @route POST /article/detail
 * @summary 文章详情
 * @group article - 文章模块
 * @param {DetailParams.model} request.body.required - 参数
 * @returns {Response.model} 200 - OK
 * @returns {Error}  404 - Not Found
 */
router.post('/detail', function (req, res) {
  const { id } = req.body;
  ArticleModel.findById(id, function (err, article) {
    if (!err) {
      res.send({ code: 200, message: '查找成功', success: true, result: article });
    } else {
      res.send({ code: 500, message: '查找失败', success: false, result: null });
    }
  })
})

module.exports = router;