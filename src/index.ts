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
                let apply = plugin.applyPlugin(msg.data.data.name, msg.data.data.path, globalStage.botObject.bot, globalStage.botObject.ws)
                if (apply.success) {
                    process.send!({
                        type: 'process:msg',
                        data: {
                            type: 'plugin.apply.success',
                            data: apply.data
                        }
                    })
                }
                else {
                    process.send!({
                        type: 'process:msg',
                        data: {
                            type: 'plugin.apply.error',
                            data: apply.data
                        }
                    })
                }
            }
            else {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.apply.error',
                        data: 'Bot is disabled'
                    }
                })
            }
        }
        else if (msg.data.type == 'plugin.remove') {
            let remove = plugin.removePlugin(msg.data.data.id)
            if (remove.success) {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.remove.success',
                        data: remove.data
                    }
                })
            } else {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.remove.error',
                        data: remove.data
                    }
                })
            }
        }
        else if (msg.data.type == 'plugin.reload') {
            let reload = plugin.reloadPlugin(msg.data.data.id)
            if (reload.success) {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.reload.success',
                        data: reload.data
                    }
                })
            }
            else {
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.reload.error',
                        data: reload.data
                    }
                })
            }
        }
        else if (msg.data.type == 'plugin.list') {
            let plugins = globalStage.plugin.map(obj => {
                return { id: obj.id, name: obj.name };
            });
            process.send!({
                type: 'process:msg',
                data: {
                    type: 'plugin.list',
                    data: plugins
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
        console.log("您还没有生成配置文件，已为您自动生成。")
        fse.writeFileSync("./config.json", `{
    "appID": "",
    "token": "",
    "intents": []
}`)
        process.send!({
            type: 'process:msg',
            data: {
                type: 'internal.profile_missing',
                data: ''
            }
        })
        process.exit()
    }
}