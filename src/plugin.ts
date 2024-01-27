import EventEmitter from "events";
import { IOpenAPI } from "qq-bot-sdk";
import { events } from "./bot";
import { globalStage } from ".";

function applyPlugin(name: string, path: string, bot: IOpenAPI, ws: EventEmitter) {
    try {
        const plugin = require(path)
        plugin.enableBot(bot, ws)
        globalStage.plugin.push({
            id: globalStage.plugin.length,
            name: name,
            path: path,
            pluginObject: plugin
        })
        return true
    } catch (e) {
        console.error('Plugin load error:' + String(e))
        return false
    }
}


function removePlugin(id: number) {
    try {
        let path = globalStage.plugin[id].path
        globalStage.plugin[id].pluginObject.disableBot()
        globalStage.plugin.splice(id, 1)
        for (const key in require.cache) {
            if (key.includes(path)) {
                delete require.cache[key];
            }
        }
        return true
    } catch (e) {
        console.error('Plugin remove error:' + String(e))
        return false
    }
}

function reloadPlugin(id: number) {
    let temp = globalStage.plugin[id]
    try {
        if (removePlugin(id)) {
            if (globalStage.botObject.bot != null && globalStage.botObject.ws != null)
                if (applyPlugin(temp.name, temp.path, globalStage.botObject.bot, globalStage.botObject.ws))
                    return true
                else {
                    
                    return false
                }
            else{
                console.log('Bot is not enabled.')
                return false
            }
        }
        else {
            return false
        }

    } catch (e) {
        console.error('Plugin reload error:' + String(e))
    }
}
/**
 * Cocotais Bot 插件类
 */
export class CocotaisBotPlugin extends EventEmitter {
    /**机器人实例 */
    private botContext: IOpenAPI | null;
    /**WebSocket实例 */
    private botWs: EventEmitter | null
    /**挂载插件时执行的函数 */
    protected _mount: () => void
    /**卸载插件时执行的函数 */
    protected _unmount: () => void
    /**事件列表 */
    public events: string[]

    constructor() {
        super()
        this.botContext = null;
        this.botWs = null
        this._mount = () => { };
        this._unmount = () => { };
        this.events = events
    }
    /**
     * 判断机器人是否开启
     * @returns ```true```或```false```
     */
    isBotEnabled() {
        return (this.botContext == null || this.botWs == null) ? false : true
    }
    /**
     * 启用机器人
     * @param context 机器人实例
     * @param ws WebSocket实例
     */
    enableBot(context: IOpenAPI, ws: EventEmitter) {
        this.botContext = context
        this.botWs = ws
        try { this._mount() } catch (e) { console.error('Plugin execute error:' + String(e)) }

        this.events.forEach((evt) => {
            console.log(evt + ' turns on.')
            const handler = (e: any) => {

                this.emit(evt, e);

            };
            // 插件收到事件时，将事件及数据 emit 给插件里定义的处理函数
            this.botWs?.on(evt, (e: any) => {
                if (this.isBotEnabled()) {
                    console.log(evt + ' recieved.')
                    handler(e)
                }
            });
        });
    }
    /**
     * 禁用机器人
     */
    disableBot() {
        this.removeAllHandler();
        try { this._unmount() } catch (e) { console.error('Plugin unmount error:' + String(e)) }
        this.botWs = null
        this.botContext = null
    }
    /**
     * 移除所有监听器
     */
    removeAllHandler() {
        this.events.forEach((evt) => {
            const handler = (e: any) => {

                this.emit(evt, e);

            };
            // 插件收到事件时，将事件及数据 emit 给插件里定义的处理函数
            this.off(evt, handler);
            console.log(evt + ' turns off.')
        });
    }
    /**
     * 当被挂载时
     * @param fun 执行的函数
     */
    onMounted(fun: () => void) {
        this._mount = fun
    }
    /**
     * 当被卸载时
     * @param fun 执行的函数
     */
    onUnloaded(fun: () => void) {
        this._unmount = fun
    }
}

export default {applyPlugin, reloadPlugin, removePlugin, CocotaisBotPlugin}