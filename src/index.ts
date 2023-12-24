import QQBot from '@satorijs/adapter-qq'
import fse from 'fs-extra'
import { startBot } from './start'


if (fse.existsSync('./config.json')) {
    fse.readJson('./config.json')
        .then(async (value: QQBot.Config) => {
            await startBot(value)
        })
        .catch((err) => {
            console.log("错误：" + err)
        })
} else {
    console.log("您还没有生成配置文件，已为您自动生成。")
    fse.writeFileSync("./config.json", `{
    "id": "",
    "secret": "",
    "token": "",
    "type": "private"
}`)
    process.exit()
}