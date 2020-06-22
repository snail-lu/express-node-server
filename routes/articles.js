const express = require('express');
const router = express.Router();

const { ArticleModel } = require('../db/models');
const filter = { __v: 0 };

router.post('/list', function(req, res){
    ArticleModel.find({},filter,(err,articles)=>{
        if(!err){
          res.send({
            code: 0,
            data: articles || []
          })
        }else{
          res.send({
            code: 1,
            msg: err
          })
        }
    
      })
    
})

router.post('/add', function(req, res){
  const { title,content,author } = req.body;
  const currentDate = new Date();
  const publishTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", {hour12: false});
  const articleModel = new ArticleModel({ title, author, content, publishTime, status: false });
  articleModel.save(function(error,user){
    if(!error){
      res.send({ code:0, msg: '文章保存成功' })
    }
  })
  
})

router.post('/save', function(req, res){
  const { title, content, author, id } = req.body;
  const currentDate = new Date();
  const updateTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", {hour12: false});
  ArticleModel.findByIdAndUpdate(id, { title, author, content, updateTime }, function(error,user){
    if(!error){
      res.send({ code:0, msg: '文章修改成功' })
    }
  })
  
})

router.post('/detail', function(req, res){
  const { id } = req.body;
  ArticleModel.findById(id,function(err,data){
    if(!err){
      res.send({ code: 0, data })
    }else{
      res.send({ code: 1, msg: '查找文章失败'})
    }
  })
})

module.exports = router;