const express = require('express');
var router = express.Router();

// 引入ConfigModel
const { ConfigModel } = require('../db/models');
const filter = { __v: 0 };

// 新增配置项
router.post('/add',function(req,res){
    const { configName,configKey,configValue,configSorts } = req.body;
    
    ConfigModel.findOne({configKey},function(error,key){
      if(key){
        res.send({code:1,msg:'该配置键已存在'});
      }else{
        const currentDate = new Date();
        const addTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", {hour12: false});
        const configModel = new ConfigModel({ configName, configKey, configValue, configSorts, addTime, configStatus: false});
        configModel.save(function(error,user){
          if(!error){
            res.send({code:0,msg: '保存成功'})
          }
        })
      }
    })  
});

// 修改配置项
router.post('/edit',function(req,res){
  const { configName,configKey,configValue,configSorts,id,reviser} = req.body;
  const currentDate = new Date();
  const modifyTime = currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString("en-US", {hour12: false});
  ConfigModel.findByIdAndUpdate(id,{configName,configKey,configValue,configSorts,modifyTime,reviser},function(error,key){
    if(!error){
      res.send({code:0,msg: '保存成功'})
    }else{
      res.send({code:1,msg: '修改失败'});
    }
  })  
});

//详情
router.post('/detail', function(req, res){
  const { id } = req.body;
  ConfigModel.findById(id,{ __v:0, addTime:0, reviser:0, modifyTime:0 },function(err,config){
    if(err){
      res.send({ code: 1, msg: '查询数据失败'})
    }
    if(config){
      res.send({ code: 0, data: config })
    }else{
      res.send({ code: 1, msg: '没有查询到该条数据' })
    }
  })
})

// 删除配置项
router.post('/delete', function(req,res){
  const { id } = req.body;
  ConfigModel.findByIdAndDelete(id,function(err,config){
    if(err){
      res.send({
        code: 1,
        msg: err
      })
    }else{
      res.send({ code: 0, msg: '删除成功'});
    }
  })
})

// 获取配置列表
router.post('/list', function(req, res){
  ConfigModel.find({},filter,(err,configs)=>{
    if(!err){
      res.send({
        code: 0,
        data: configs
      })
    }else{
      res.send({
        code: 1,
        msg: err
      })
    }

  })
})

module.exports = router;