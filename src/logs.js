const log4js = require("koa-log4");
const path = require("path");

log4js.configure({
  // 设置日志规则
  appenders: {
    httpRule: {
      type: "dateFile", // 日志输出的类型例如
      pattern: "-yyyy-MM-dd.log",
      daysToKeep: 7, // 日志保留的天数
      layout: {
        type: "pattern",
        pattern: "[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m", // 输出日志的格式
      },
      filename: path.join("logs", "http.log"),
    },

    access: {
      type: "dateFile",
      pattern: "-yyyy-MM-dd.log",
      daysToKeep: 7,
      layout: {
        type: "pattern",
        pattern: "[%d{yyyy-MM-dd hh:mm:ss}] [%p] %m",
      },
      filename: path.join("logs", "access.log"),
    },
    // 控制台输出
    out: {
      type: "stdout",
    },
  },
  // 配置日志的分类
  categories: {
    default: { appenders: ["out"], level: "all" },
    access: { appenders: ["access"], level: "all" },
    http: { appenders: ["httpRule"], level: "all" },
  },
  pm2: true,
  pm2InstanceVar: 0,
});

module.exports = log4js;
