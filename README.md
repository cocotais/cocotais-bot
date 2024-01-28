# Cocotais Bot

基于 [qq-bot-sdk](https://www.npmjs.com/package/qq-bot-sdk) 实现的的QQ官方机器人框架

## 使用方法

(待补充)

## 插件编写

```js
const { CocotaisBotPlugin } = require("cocotais-bot")

const plugin = new CocotaisBotPlugin()

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