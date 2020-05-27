const md5 = require('blueimp-md5');
//1.连接数据库
//1.1 引入mongoose
const mongoose = require('mongoose');

//1.2 连接指定数据库
mongoose.connect('mongodb://localhost:27017/gzhipin_test');

//1.3 获取连接对象
const conn = mongoose.connection;

//1.4 绑定连接完成的监听
conn.on('connected',function(){
    console.log('数据库连接成功');
});

//2.得到对应特定集合的Model
//2.1 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type:String,required:true},  //用户名
    password: {type:String,required:true},
    type:{type:String,required:true},
})
//2.2 定义Model
const UserModel = mongoose.model('user',userSchema);  //集合的名称为users

//3.通过Model或其实例对集合数据进行CRUD操作
//3.1 通过Model实例的save()添加数据
function testSave(){
    //创建UserModel实例
    const userModel = new UserModel({username:'Bob',password:md5('456'),type:'boss'});
    //调用save()保存
    userModel.save(function(error,userDoc){
        console.log('save()',error,userDoc);
    })
}

// testSave();

//3.2 通过Model的find()/findOne()查询多个或一个数据
function testFind(){
    //查询多个
    UserModel.find(function (error,users){
        console.log('find()',error,users);
    });
    //查询一个
    UserModel.findOne({_id:'5d131de8fd54c1375408c1e3'},function(error,user){
        console.log('findOne()',error,user);
    })
}

// testFind();

//3.3 通过Model的findByIdUpdate()更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id:'5d131de8fd54c1375408c1e3'},{username:'Jack'},function(error,oldUser){
        console.log('findByIdAndUpdate()',error,oldUser)
    })
}
// testUpdate();

//3.4 通过Model的remove()删除匹配的数据
function testDelete(){
    UserModel.remove({_id:'5d131de8fd54c1375408c1e3'},function(error,doc){
        console.log('remove()',error,doc);
    })
}
// testDelete();