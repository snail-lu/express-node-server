const express = require('express');
const router = express.Router();

const { PageModel } = require('../models/page');
const filter = { __v: 0 };

router.post('/list', async function (req, res) {
  const { pageInfo: { pageNo = 1, pageSize = 10 } } = req.body;
  const total = await PageModel.countDocuments({});
  PageModel.find({}, filter, { limit: pageSize, skip: (pageNo-1)*pageSize }, (err, pages) => {
    if (err) {
      res.send({ code: 500, message: '查询失败', success: false, result: null })
    } else {
      res.send({ code: 200, result: { pages, total }, success: true, message: '查询成功' })
    }
  })
})

router.post('/add', function(req, res){
  const { title,content,author } = req.body;
  const currentDate = new Date();
  const publishTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", {hour12: false});
  const PageModel = new PageModel({ title, author, content, publishTime, status: false });
  PageModel.save(function(error,user){
    if(!error){
      res.send({ code:0, msg: '文章保存成功' })
    }
  })
  
})

router.post('/save', function(req, res){
  const { title, content, author, id } = req.body;
  const currentDate = new Date();
  const updateTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", {hour12: false});
  PageModel.findByIdAndUpdate(id, { title, author, content, updateTime }, function(error,user){
    if(!error){
      res.send({ code:0, msg: '文章修改成功' })
    }
  })
  
})

router.post('/detail', function(req, res){
  const { id } = req.body;
  PageModel.findById(id,function(err,data){
    if(!err){
      res.send({ code: 0, data })
    }else{
      res.send({ code: 1, msg: '查找文章失败'})
    }
  })
})

module.exports = router;