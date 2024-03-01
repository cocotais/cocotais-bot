import { IOpenAPI } from "qq-bot-sdk";
import { EventEmitter } from "events";
import { globalStage } from ".";
import { events, messageEvents } from "./types";
import { CocotaisBotPlugin } from "./plugin";
import { getBuiltinPlugins } from "./builtins";

function keepAlive() {
    process.send!({
        type: 'process:msg',
        data: {
            type: 'ping',
            data: 'ping'
        }
    },undefined,undefined,(err)=>{
        if (err) {
            console.error("[WARN(001)] 发送保活消息失败，可能无法正常操控机器人")
        }
    })
}

/**
 * 机器人启动处理器
 * @param context 机器人实例
 * @param ws WebSocket实例
 */
export function botHandler(context: IOpenAPI, ws: EventEmitter) {
    keepAlive()
    ws.on('READY', (data) => {
        console.log('[READY] 已连接到服务器' + data);
        if (!process.send) console.error("[ERR(002)] 不是有效的IPC通道")
        keepAlive()
        process.send!({
            type: 'process:msg',
            data: {
                type: 'login.success',
                data: data
            }
        })
    });
    ws.on('DEAD', (data) => {
        console.log('[ERR(010)] 连接到服务器失败 :', data);
        if (!process.send) console.error("[ERR(002)] 不是有效的IPC通道")
        keepAlive()
        process.send!({
            type: 'process:msg',
            data: {
                type: 'login.error',
                data: data
            }
        })
        throw new Error(data);
    });

    events.forEach(event => {
        ws.on(event, (data) => {
            console.log(`[${event}] 事件接收 :`, data);
            if(messageEvents.includes(data.eventType)){
                globalStage.commands.forEach((cmd) => {
                    if (data.msg.content.trim().startsWith(cmd.match)) {
                        cmd.handler(data.msg.content.trim().split(" "), data)
                    }
                })
            }
        })
    })

    getBuiltinPlugins().forEach((plugin) => {
        plugin.enableBot(context, ws, globalStage.plugin.length)
    })

}