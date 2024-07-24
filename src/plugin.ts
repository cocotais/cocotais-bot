import EventEmitter from "events";
import { IOpenAPI } from "qq-bot-sdk";
import { C2cMessageEvent, CommandOption, EventList, events, GroupMessageEvent, GuildMessageEvent, WsResponse } from "./types";
import { translateWsEvent } from './event'
import { globalStage } from ".";
import fse from 'fs-extra'

function unsafelyDo(func: Function, ...args: any) {
    try {
        func(...args)
    } catch (e) {
        console.error("[WARN(003)] 不安全的执行抛出了错误: ")
        console.error(`[WARN(003)] 执行函数 ${func.name} 时`)
        console.error(`[WARN(003)] 携带参数 ${args.join(',')}`)
        console.error(`[WARN(003)] 遇到问题: ${(e as Error).name}`)
        console.error(`[WARN(003)] 错误信息: ${(e as Error).message}`)
        console.error(`[WARN(003)] 错误堆栈: ${(e as Error).stack?.split("\n").join("\n[WARN(003)] ")}`)
    }
}

function autoloadPlugin() {
    try {
        fse.readdirSync('./plugins').forEach(file => {
            if (file.endsWith('.cjs') || file.endsWith('.mjs') || file.endsWith('.js')) {
                unsafelyDo(applyPlugin, process.cwd() + '/plugins/' + file, globalStage.botObject.bot, globalStage.botObject.ws, globalStage.botObject.event)
            }
        })
        return true
    }
    catch (e) {
        console.error("[ERR(004)] 自动加载插件出现错误：" + typeof e == "object" ? JSON.stringify(e) : String(e))
        return false
    }
}

async function pushPluginOnly(plugin: CocotaisBotPlugin, path: string) {
    globalStage.plugin.push({
        id: globalStage.plugin.length,
        config: plugin.config,
        path: path,
        pluginObject: plugin
    })
}

async function applyPlugin(path: string, bot: IOpenAPI, ws: EventEmitter, event: EventEmitter) {
    try {
        const pluginModule = await import(path);
        const plugin: CocotaisBotPlugin = pluginModule.default;
        if (plugin.config.name.startsWith("builtin")) {
            console.error("[ERR(005)] 应用插件出现错误：插件名称非法，无法应用")
        }
        plugin.enableBot(bot, ws, globalStage.plugin.length, event);
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
        console.error("[ERR(005)] 应用插件出现错误：" + typeof e == "object" ? JSON.stringify(e) : String(e))
        return {
            success: false,
            data: typeof e == "object" ? JSON.stringify(e) : String(e)
        }
    }
}


function removePlugin(id: number) {
    try {
        let path = globalStage.plugin[id].path
        if (path == "builtin") {
            console.error("[ERR(006)] 卸载插件出现错误：插件内置，无法卸载")
        }
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
        console.error("[ERR(006)] 卸载插件出现错误：" + typeof e == "object" ? JSON.stringify(e) : String(e))
        return {
            success: false,
            data: typeof e == "object" ? JSON.stringify(e) : String(e)
        }
    }
}

async function reloadPlugin(id: number) {
    let temp = globalStage.plugin[id]
    try {
        let remove = removePlugin(id)
        if (remove.success) {
            if (globalStage.botObject.bot != null && globalStage.botObject.ws != null && globalStage.botObject.event != null) {
                let apply = await applyPlugin(temp.path, globalStage.botObject.bot, globalStage.botObject.ws, globalStage.botObject.event)
                if (apply.success)
                    return {
                        success: true,
                        data: null
                    }
                else {
                    console.error("[ERR(007)] 重载插件(装载时)出现错误：" + apply.data)
                    return {
                        success: false,
                        data: 'Plugin apply error.' + apply.data
                    }
                }
            } else {
                console.error("[ERR(008)] 重载插件(卸载时)出现错误：机器人未运行")
                return {
                    success: false,
                    data: 'Bot is not enabled.'
                }
            }
        }
        else {
            console.error("[ERR(008)] 重载插件(卸载时)出现错误：" + remove.data)
            return {
                success: false,
                data: 'Plugin remove error.' + remove.data
            }
        }

    } catch (e) {
        console.error("[ERR(009)] 重载插件出现错误：" + typeof e == "object" ? JSON.stringify(e) : String(e))
        return {
            success: false,
            data: typeof e == "object" ? JSON.stringify(e) : String(e)
        }
    }
}

export interface CocotaisBotPlugin {
    on<T extends keyof EventList>(event: T, listener: (arg: EventList[T]) => void): this;
    emit<T extends keyof EventList>(event: T, argument: EventList[T]): boolean;
}

/**
 * Cocotais Bot 插件类
 */
export class CocotaisBotPlugin extends EventEmitter {
    /**机器人实例 */
    private botContext: IOpenAPI | null;
    /**WebSocket实例 */
    private botWs: EventEmitter | null;
    /**事件实例 */
    private botEvent: EventEmitter | null;
    /**挂载插件时执行的函数 */
    protected _mount: (bot: IOpenAPI) => void
    /**卸载插件时执行的函数 */
    protected _unmount: () => void
    /**事件列表 */
    public events: string[]
    /**插件ID */
    public id: number | null
    /**插件基本信息 */
    public config: {
        name: string
        version: string
    }
    constructor(name: string, version: string) {
        super()
        this.botContext = null;
        this.botWs = null;
        this.botEvent = null;
        this._mount = () => { };
        this._unmount = () => { };
        this.events = events
        this.id = null
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
        return !((this.botContext == null || this.botWs == null))
    }
    /**
     * 启用机器人
     * @param context 机器人实例
     * @param ws WebSocket实例
     */
    enableBot(context: IOpenAPI, ws: EventEmitter, botId: number, event: EventEmitter) {
        this.botContext = context
        this.botWs = ws
        this.botEvent = event
        this.id = botId
        try { this._mount(context) } catch (e) { console.error('[ERR(005)] 应用插件出现错误(运行时)：' + typeof e == "object" ? JSON.stringify(e) : String(e)) }
        this.command.name = this.config.name
        if (this.config.name.startsWith("builtin:")) {
            pushPluginOnly(this, "builtin")
        }
        event.on('internal.event', (event: keyof EventList, resp: EventList[keyof EventList]) => {
            this.emit(event, resp)
        })
    }
    /**
     * 禁用机器人
     */
    disableBot() {
        this.removeAllHandler();
        // 移除provider是本插件的命令
        globalStage.commands = globalStage.commands.filter((v) => v.provider != this.config.name)
        try { this._unmount() } catch (e) { console.error('[ERR(006)] 卸载插件出现错误(运行时)：' + typeof e == "object" ? JSON.stringify(e) : String(e)) }
        this.botWs = null
        this.botContext = null
    }
    /**
     * 移除所有监听器
     */
    removeAllHandler() {
        this.removeAllListeners()
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
    /**
     * 插件命令
     */
    command = {
        name: "",
        /**
         * 注册一个命令
         * @param match 命令匹配器
         * @param desc 命令描述
         * @param fun 命令执行器
         * @returns 命令ID
         */
        register(match: string, desc: string, fun: (type: 'guild' | 'group' | 'direct' | 'c2c', msgs: string[], event: GroupMessageEvent | C2cMessageEvent | GuildMessageEvent) => void, options?: CommandOption) {
            globalStage.commands.push({
                id: globalStage.plugin.length,
                description: desc,
                match: match,
                provider: this.name,
                handler: fun,
                option: options
            })
            return globalStage.plugin.length - 1;
        },
        /**
         * 卸载一个命令
         * @param id 命令ID
         */
        unregister(id: number) {
            globalStage.commands = globalStage.commands.filter((v) => v.id != id)
        }
    }
}

export default { autoloadPlugin, applyPlugin, reloadPlugin, removePlugin, CocotaisBotPlugin }