/**
 * Category 模块
 */
// 1 引入mongoose
const { mongoose } = require('./index');

// 2 定义Schema(描述文档结构)
const categorySchema = mongoose.Schema({
    parentId: {type:String,required:true},        //分类id
    name: {type:Object,required:true},            //分类名称
})

// 3 定义Model
const CateModel = mongoose.model('cate',categorySchema);
exports.CateModel = CateModel;