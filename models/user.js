/**
 * User 模块
 */
// 1 引入mongoose
const { mongoose } = require('./index');

// 2 定义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: { type:String, required:true },       //用户名
    password: { type:String, required:true },       //密码
    // email: { type:String, required:true },          //邮箱
    // adminLevel: { type:String, required:true } ,    //职位权限
    avatar:{ type:String },                         //头像
})

// 3 定义Model
const UserModel = mongoose.model('user',userSchema);
exports.UserModel = UserModel;