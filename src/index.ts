import fse from 'fs-extra'
import { startBot } from './start'
import { GetWsParam, Config } from 'qq-guild-bot';

if (fse.existsSync('./config.json')) {
    fse.readJson('./config.json')
        .then(async (value: GetWsParam & Config) => {
            await startBot(value)
        })
        .catch((err) => {
            console.log("错误：" + err)
        })
} else {
    console.log("您还没有生成配置文件，已为您自动生成。")
    fse.writeFileSync("./config.json", `{
    "appID": "",
    "token": "",
    "intents": []
}`)
    process.exit()
}