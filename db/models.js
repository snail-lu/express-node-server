/*
* 包含n个操作数据库集合的Model模块
* */
//1.连接数据库
//1.1 引入mongoose
const mongoose = require('mongoose');

//1.2 连接指定的数据库
mongoose.connect('mongodb://localhost:27017/adminclient',{useNewUrlParser: true, useFindAndModify: false,useUnifiedTopology: true});
//1.3 获取连接对象
const conn = mongoose.connection;
//1.4 绑定连接完成的监听
conn.on('connected',()=>{
    console.log('数据库连接成功！');
});

//2 得到对应特定集合的Model并向外暴露
//2.1 字义Schema(描述文档结构)

//admins集合文档结构
const adminSchema = mongoose.Schema({
    username: { type:String, required:true },       //用户名
    password: { type:String, required:true },       //密码
    email: { type:String, required:true },          //邮箱
    adminLevel: { type:String, required:true } ,    //职位权限
    avatar:{ type:String },                         //头像
})

//users集合文档结构
const userSchema = mongoose.Schema({
    username: { type:String, required:true },       //用户名
    password: { type:String, required:true },       //密码
    email: { type:String, required:true },          //邮箱
    adminLevel: { type:String, required:true } ,    //职位权限
    avatar:{ type:String },                         //头像
})

//定义chats集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type:String,required:true},        //发送用户的id
    to: {type:String,required:true},          //接收用户的id
    chat_id:{type:String,required:true},      //from和to组成的字符串
    content:{type:String,required:true},                   //内容
    create_time:{type:Number},                //创建时间
    read:{type:Boolean,default:false},                     //已读
})

//定义categoryList集合的文档结构
const categorySchema = mongoose.Schema({
    parentId: {type:String,required:true},        //分类id
    name: {type:Object,required:true},            //分类名称
})

//2.2 定义Model
const UserModel = mongoose.model('user',userSchema);
const AdminModel = mongoose.model('admin',adminSchema);
const ChatModel = mongoose.model('chat',chatSchema);
const CateModel = mongoose.model('cate',categorySchema);

//2.3 向外暴露Model
exports.UserModel = UserModel;
exports.AdminModel = AdminModel;
exports.ChatModel = ChatModel;
exports.CateModel = CateModel;