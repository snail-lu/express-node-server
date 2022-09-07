/*
* page 模块
* */
// 1 引入mongoose
const { mongoose } = require('./index');

// 2 定义Schema(描述文档结构)
const pageSchema = mongoose.Schema({
    pageName: { type:String, required:true },          // 页面名称
    createUserName: { type: String },                  // 创建人
    createTime: { type: String },                      // 创建时间
    updateUserName: { type: String },                  // 更新人
    updateTime: { type: String },                      // 更新时间
    status: { type: Boolean, required: true}                           // 状态
})

// 3 定义Model
const PageModel = mongoose.model('page', pageSchema);
exports.PageModel = PageModel;