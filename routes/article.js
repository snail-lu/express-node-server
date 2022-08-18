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
 * 文章列表
 * @route POST /article/list
 * @summary 文章列表
 * @group article - 文章模块
 * @param {SearchParams.model} request.body.required - 查询参数
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

router.post('/add', function (req, res) {
  const { title, content, author } = req.body;
  const currentDate = new Date();
  const publishTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", { hour12: false });
  const articleModel = new ArticleModel({ title, author, content, publishTime, status: false });
  articleModel.save(function (error, user) {
    if (!error) {
      res.send({ code: 0, msg: '文章保存成功' })
    }
  })

})

router.post('/save', function (req, res) {
  const { title, content, author, id } = req.body;
  const currentDate = new Date();
  const updateTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", { hour12: false });
  ArticleModel.findByIdAndUpdate(id, { title, author, content, updateTime }, function (error, user) {
    if (!error) {
      res.send({ code: 0, msg: '文章修改成功' })
    }
  })

})

router.post('/detail', function (req, res) {
  const { id } = req.body;
  ArticleModel.findById(id, function (err, data) {
    if (!err) {
      res.send({ code: 0, data })
    } else {
      res.send({ code: 1, msg: '查找文章失败' })
    }
  })
})

module.exports = router;