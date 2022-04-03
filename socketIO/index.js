module.exports = function (server) {
    // 得到 IO 对象
    const io = require('socket.io')(server);
    const {ChatModel} = require('../db/models');

    // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function (socket) {
        console.log('socketio connected')
        // 绑定 sendMsg 监听, 接收客户端发送的消息
        socket.on('sendMsg', function ({from,to,content}) {
            console.log('服务器接收到浏览器的消息', {from,to,content})
            // 处理数据(保存消息）
            const chat_id = [from,to].sort().join("_");  //from_to或to_from保持一致
            const create_time = Date.now();
            new ChatModel({from,to,content,chat_id,create_time}).save(function(error,chatMsg){
                //向所有连接的客户端发消息
                io.emit('receiveMsg',chatMsg)
            })
        })
    })
}