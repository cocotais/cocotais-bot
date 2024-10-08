import fse from 'fs-extra'
import { startBot } from './start'
import { GetWsParam, Config } from 'qq-bot-sdk';
import plugin, { CocotaisBotPlugin } from './plugin';
import { Stage } from './types';

export let globalStage: Stage = { botObject: { bot: null, ws: null, event: null }, plugin: [], commands: [] }

export { CocotaisBotPlugin }

let isRequired = require.main != module

if (!isRequired) {
    process.on('message', async (msg: any) => {
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
            if (globalStage.botObject.bot != null && globalStage.botObject.ws != null && globalStage.botObject.event != null) {
                let apply = await plugin.applyPlugin(msg.data.data.path, globalStage.botObject.bot, globalStage.botObject.ws, globalStage.botObject.event)
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
            let reload = await plugin.reloadPlugin(msg.data.data.id)
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
                return { id: obj.id, config: obj.config };
            });
            process.send!({
                type: 'process:msg',
                data: {
                    type: 'plugin.list',
                    data: plugins
                }
            })
        }
        else if (msg.data.type == 'plugin.autoload') {
            if(plugin.autoloadPlugin()){
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.autoload.success',
                        data: null
                    }
                })
            }else{
                process.send!({
                    type: 'process:msg',
                    data: {
                        type: 'plugin.autoload.error',
                        data: null
                    }
                })
            }
        }
    })
    if (!fse.pathExistsSync('./plugins')) {
        fse.mkdirSync('./plugins')
    }
    if (fse.existsSync('./config.json')) {
        fse.readJson('./config.json')
            .then(async (value: GetWsParam & Config) => {
                await startBot(value)
            })
            .catch((err) => {
                console.error("[守护进程] 配置文件读取错误，请检查配置文件是否正确。")
            })
    } else {
        console.log("[守护进程] 您还没有生成配置文件，已为您自动生成。")
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