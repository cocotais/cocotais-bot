import EventEmitter from "events";
import { IOpenAPI } from "qq-bot-sdk";
import { events } from "./bot";
import { globalStage } from ".";
import fse from 'fs-extra'

function unsafelyDo(func: Function, ...args: any) {
    try {
        func(...args)
    } catch (e) {
        
    }
}

function autoloadPlugin(){
    try{
        fse.readdirSync('./plugins').forEach(file => {
            if(file.endsWith('.js')){
                unsafelyDo(applyPlugin, process.cwd() + '/plugins/' + file, globalStage.botObject.bot, globalStage.botObject.ws)
            }
        })
        return true
    }
    catch(e){
        console.error('Autoload plugin error:' + String(e))
        return false
    }
}

async function applyPlugin(path: string, bot: IOpenAPI, ws: EventEmitter) {
    try {
        const pluginModule = await import(path);
        const plugin: CocotaisBotPlugin = pluginModule.default;
        plugin.enableBot(bot, ws);
        globalStage.plugin.push({
            id: globalStage.plugin.length,
            config: plugin.config,
            path: path,
            pluginObject: plugin
        })
        return {
            success: true,
            data: null
        }
    } catch (e) {
        console.error('Plugin load error:' + String(e))
        return {
            success: false,
            data: String(e)
        }
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
        return {
            success: true,
            data: null
        }
    } catch (e) {
        console.error('Plugin remove error:' + String(e))
        return {
            success: false,
            data: String(e)
        }
    }
}

async function reloadPlugin(id: number) {
    let temp = globalStage.plugin[id]
    try {
        let remove = removePlugin(id)
        if (remove.success) {
            if (globalStage.botObject.bot != null && globalStage.botObject.ws != null) {
                let apply = await applyPlugin(temp.path, globalStage.botObject.bot, globalStage.botObject.ws)
                if (apply.success)
                    return {
                        success: true,
                        data: null
                    }
                else {
                    return {
                        success: false,
                        data: 'Plugin apply error.' + apply.data
                    }
                }
            } else {
                console.log('Bot is not enabled.')
                return {
                    success: false,
                    data: 'Bot is not enabled.'
                }
            }
        }
        else {
            return {
                success: false,
                data: 'Plugin remove error.' + remove.data
            }
        }

    } catch (e) {
        console.error('Plugin reload error:' + String(e))
        return {
            success: false,
            data: String(e)
        }
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
    protected _mount: (bot: IOpenAPI) => void
    /**卸载插件时执行的函数 */
    protected _unmount: () => void
    /**事件列表 */
    public events: string[]
    /**插件基本信息 */
    public config: {
        name: string
        version: string
    }
    constructor(name: string, version: string) {
        super()
        this.botContext = null;
        this.botWs = null
        this._mount = () => { };
        this._unmount = () => { };
        this.events = events
        this.config = {
            name: name,
            version: version
        }
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
        try { this._mount(context) } catch (e) { console.error('Plugin execute error:' + String(e)) }

        this.events.forEach((evt) => {
            const handler = (e: any) => {

                this.emit(evt, e);

            };
            // 插件收到事件时，将事件及数据 emit 给插件里定义的处理函数
            this.botWs?.on(evt, (e: any) => {
                if (this.isBotEnabled()) {
                    unsafelyDo(handler, e)
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
        });
    }
    /**
     * 当被挂载时
     * @param fun 执行的函数
     */
    onMounted(fun: (bot: IOpenAPI) => void) {
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

export default { autoloadPlugin, applyPlugin, reloadPlugin, removePlugin, CocotaisBotPlugin }