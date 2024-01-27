import fse from 'fs-extra'
import { startBot } from './start'
import { GetWsParam, Config } from 'qq-bot-sdk';

process.on('message',(msg: any)=>{
    console.log("[IPC] "+JSON.stringify(msg))
    if(msg.data.type == 'ping'){
        process.send!({
            type: 'process:msg',
            data: {
                type: 'pong',
                data: 'pong'
            }
        })
    }
})

if (fse.existsSync('./config.json')) {
    fse.readJson('./config.json')
        .then(async (value: GetWsParam & Config) => {
            await startBot(value)
        })
        .catch((err) => {
            throw new Error("配置文件读取错误，请检查配置文件是否正确。")
        })
} else {
    process.send!({
        type: 'process:msg',
        data: {
            type: 'internal.profile_missing',
            data: ''
        }
    })
    console.log("您还没有生成配置文件，已为您自动生成。")
    fse.writeFileSync("./config.json", `{
    "appID": "",
    "token": "",
    "intents": []
}`)
    process.exit()
}