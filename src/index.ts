import fse from 'fs-extra'
import { startBot } from './start'
import { GetWsParam, Config, IOpenAPI } from 'qq-bot-sdk';
import EventEmitter from 'events';
import plugin, { CocotaisBotPlugin } from './plugin';

interface Stage {
    botObject: {
        bot: IOpenAPI | null,
        ws: EventEmitter | null
    },
    plugin: {
        id: number,
        name: string,
        path: string,
        pluginObject: CocotaisBotPlugin
    }[]
}

export let globalStage: Stage = { botObject: { bot: null, ws: null }, plugin: [] }

export { CocotaisBotPlugin }

let isRequired = require.main != module

if (!isRequired) {
    process.on('message', (msg: any) => {
        console.log("[IPC] " + JSON.stringify(msg))
        if (msg.data.type == 'ping') {
            process.send!({
                type: 'process:msg',
                data: {
                    type: 'pong',
                    data: 'pong'
                }
            })
        }
        else if (msg.data.type == 'plugin.apply') {
            if (globalStage.botObject.bot != null && globalStage.botObject.ws != null) {
                if (plugin.applyPlugin(msg.data.data.name, msg.data.data.path, globalStage.botObject.bot, globalStage.botObject.ws)) {
                    process.send!({
                        type: 'process:msg',
                        data: {
                            type: 'plugin.apply.success',
                            data: 'success'
                        }
                    })
                }
                else {
                    process.send!({
                        type: 'process:msg',
                        data: {
                            type: 'plugin.apply.error',
                            data: 'error'
                        }
                    })
                }
            }
            else {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.apply.error',
                        data: 'disabled'
                    }
                })
            }
        }
        else if (msg.data.type == 'plugin.remove') {
            if (plugin.removePlugin(msg.data.data.id)) {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.remove.success',
                        data: 'success'
                    }
                })
            } else {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.remove.error',
                        data: 'error'
                    }
                })
            }
        }
        else if (msg.data.type == 'plugin.reload') {
            if (plugin.reloadPlugin(msg.data.data.id)) {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.reload.success',
                        data: 'success'
                    }
                })
            }
            else {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.reload.error',
                        data: 'error'
                    }
                })
            }
        }
        else if (msg.data.type == 'plugin.list') {
            process.send!({
                type: 'process:msg',
                data: {
                    type: 'plugin.list',
                    data: globalStage.plugin
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
}