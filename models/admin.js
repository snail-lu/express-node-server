/**
 * Admin 数据库模块
 */

// 1 引入mongoose
const { mongoose } = require('./index');

// 2 定义Schema(描述文档结构)
const adminSchema = mongoose.Schema({
    username: { type:String, required:true },       // 用户名
    password: { type:String, required:true },       // 密码
    email: { type:String, required:true },          // 邮箱
    level: { type:String, required:true } ,         // 职位权限
    status:{ type:String, required: true }          // 状态
})

// 3 定义Model
const AdminModel = mongoose.model('admin',adminSchema);
exports.AdminModel = AdminModel;