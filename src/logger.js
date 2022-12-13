import log4js from "log4js";

log4js.configure({
  appenders: {
    kidcity: {
      type: "dateFile",
      filename: "logs/kidcity.log",
      maxLogSize: 1024 * 1024 * 1024,
      numBackups: 30,
    },
    console: {
      type: "stdout",
    },
  },
  categories: {
    default: {
      appenders: ["kidcity", "console"],
      level: "trace",
    },
  },
  pm2: true,
});

export const kidcity_log = log4js.getLogger();
