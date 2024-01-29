# Cocotais Bot

基于 [qq-bot-sdk](https://www.npmjs.com/package/qq-bot-sdk) 实现的的QQ官方机器人框架

## 使用方法

1. 在项目目录下运行 `npm i cocotais-bot`
2. 在项目目录下运行 `npx cocotais-bot start` 生成配置文件
3. 按照QQ官方文档，填写config.json中相关信息
4. 在项目目录下运行 `npx cocotais-bot start` 启动机器人，使用 `--no-autoload` 阻止框架从项目目录的 `plugins` 文件夹自动加载插件
5. 在项目目录下运行 `npx cocotais-bot plugin apply <插件目录>` 以装载插件
6. 在项目目录下运行 `npx cocotais-bot plugin list` 以查看插件列表
7. 在项目目录下运行 `npx cocotais-bot plugin reload <插件ID>` 以重载插件
8. 在项目目录下运行 `npx cocotais-bot plugin remove <插件ID>` 以删除插件
9. 在项目目录下运行 `npx cocotais-bot stop` 以停止机器人

## 插件编写

```js
const { CocotaisBotPlugin } = require("cocotais-bot")

const plugin = new CocotaisBotPlugin("test-plugin","0.1.0")

plugin.onMounted((bot) => {
    console.log("Plugin mounted!")
    plugin.on('GROUP', (data) => {
        bot.groupApi.postMessage(data.msg.group_openid, {
            content: "Hi",
            msg_type: 0,
            msg_id: data.msg.id
        })
    })               
})

module.exports = plugin
```

## CLI 文档

```
npx cocotais-bot start [--no-autoload]
npx cocotais-bot stop
npx cocotais-bot plugin apply <Plugin Dir>
npx cocotais-bot plugin reload <Plugin ID>
npx cocotais-bot plugin remove <Plugin ID>
npx cocotais-bot plugin list
```