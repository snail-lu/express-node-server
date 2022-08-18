/*
* config 模块
* */
// 1 引入mongoose
const { mongoose } = require('./index');

// 2 定义Schema(描述文档结构)
const configSchema = mongoose.Schema({
    configName: { type:String, required:true },      //配置名称
    configKey: { type:String, required:true },       //配置键值
    configValue: { type:Object, required:true },     //配置值
    configSorts: { type:Number, required:true } ,    //排序
    addTime: { type: String },                       //添加时间
    modifyTime: { type: String },                    //修改时间
    reviser: { type: String },                       //修改人
    configStatus: { type: Boolean}                    //状态
})

// 3 定义Model
const ConfigModel = mongoose.model('config', configSchema);
exports.ConfigModel = ConfigModel;