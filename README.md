<h2 align="center">Express Node Server</h2>
<p align="center">
    <a href="https://node-server-nu.vercel.app/swagger" target="_blank">线上地址</a>
    ·
    <a href="https://github.com/Snail-Lu/node-express-server" target="_blank">仓库地址</a>
    ·
    <a href="https://github.com/Snail-Lu/node-express-server/issues" target="_blank">建议意见</a>
</p>

## 简介 
基于`Express` + `MongoDB`开发的`Node.js`服务端项目。

## 项目结构
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
├── bin                     # 项目启动
│   └── www
│
├── models                  # 数据库模型定义
│   ├── admin.js            # 管理员模型
│   ├── article.js          # 文章模型
│   ├── category.js         # 分类模型
│   ├── chat.js             # 聊天模型
│   ├── config.js           # 配置模型
│   ├── page.js             # 页面模型
│   ├── user.js             # 用户模型
│   └── index.js            # 数据库连接
│
├── routes                  # 路由
│   ├── admin.js            # 管理员路由
│   ├── article.js          # 文章路由
│   ├── category.js         # 分类路由
│   ├── chat.js             # 聊天路由
│   ├── config.js           # 配置路由
│   ├── page.js             # 页面路由
│   ├── user.js             # 用户路由
│   └── index.js            # 根路由
│
├── socketIO                # 即时通讯
│   
└── views                   # 页面文件
    ├─ index.ejs            # 项目首页
    └─ error.ejs            # 报错页面

```

## 常用命令
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

