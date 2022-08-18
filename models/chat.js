/*
* chat 模块
* */
// 1 引入mongoose
const { mongoose } = require('mongoose');

// 2 定义Schema(描述文档结构)
const chatSchema = mongoose.Schema({
    from: {type:String,required:true},        //发送用户的id
    to: {type:String,required:true},          //接收用户的id
    chat_id:{type:String,required:true},      //from和to组成的字符串
    content:{type:String,required:true},      //内容
    create_time:{type:Number},                //创建时间
    read:{type:Boolean,default:false},        //已读
})

// 3 定义Model
const ChatModel = mongoose.model('chat',chatSchema);
exports.ChatModel = ChatModel;