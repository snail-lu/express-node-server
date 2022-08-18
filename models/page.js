/*
* page 模块
* */
// 1 引入mongoose
const { mongoose } = require('mongoose');

// 2 定义Schema(描述文档结构)
const pageSchema = mongoose.Schema({
    title: { type:String, required:true },             //标题
    author: { type: String, required: true },          //作者
    content: { type:String, required:true },           //内容
    publishTime: { type: String },                     //发布时间
    updateTime: { type: String },                      //修改时间
    status: { type: Boolean}                           //状态
})

// 3 定义Model
const PageModel = mongoose.model('page', pageSchema);
exports.PageModel = PageModel;