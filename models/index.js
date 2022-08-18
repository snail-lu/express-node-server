// 1.连接数据库
// 1.1 引入mongoose
const mongoose = require('mongoose');

// 1.2 连接数据库
// vercel环境下，数据库地址从环境变量中获取
const dbURI = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost:27017/myapp';
mongoose.connect(dbURI, {useNewUrlParser: true, useFindAndModify: false,useUnifiedTopology: true});
//1.3 获取连接对象
const conn = mongoose.connection;
//1.4 绑定连接完成的监听
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
    console.log('\033[42;30m SUCCESS \033[40;32m 数据库连接成功！\033[0m');
}); 

exports.mongoose = mongoose
