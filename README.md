# Express Node Server
基于`Express`+`MongoDB`开发的`node.js`服务端项目。

## 目录结构
```
express-node-server
├── README.md               # 项目文档
│
├── package.json            # 项目依赖
│
├── .gitignore
│
├── public                  # 静态资源
│   └── styles              # 样式文件 
│
├── bin                     #
│   └── www
│
├── db                      # 数据库
│   └── models.js           # Models定义
│
├── routes                  # 路由
│
├── socketIO                # 即时通讯
│   
└── views                   # 页面文件
    ├─ index.ejs            # 项目首页
    └─ error.ejs            # 报错页面

```

### 前端项目
- [admin-client](https://github.com/Snail-Lu/admin-client)
- [employment-app](https://github.com/Snail-Lu/employment-app)

### 常用命令
1. 启动数据库
```bash
mongod --config /usr/local/etc/mongod.conf
```
2. 测试连接数据库

```bash
mongo
```

3. 本地启动
```bash
npm start
```

