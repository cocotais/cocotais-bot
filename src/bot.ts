import { IOpenAPI } from "qq-bot-sdk";
import { EventEmitter } from "events";
import { globalStage } from ".";
import { events, messageEvents } from "./types";
import { CocotaisBotPlugin } from "./plugin";

function keepAlive() {
    process.send!({
        type: 'process:msg',
        data: {
            type: 'ping',
            data: 'ping'
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
        if (!process.send) console.log('[ERROR] Not IPC Channel')
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
        console.log('[ERROR] 连接到服务器失败 :', data);
        if (!process.send) console.log('[ERROR] Not IPC Channel')
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
        })
    })

    messageEvents.forEach(event => {
        ws.on(event, (data) => {
            globalStage.commands.forEach((cmd) => {
                if (data.msg.content.startsWith(cmd.match)) {
                    cmd.handler(context, data.msg.content.trim().split(" "), data.msg)
                }
            })
        })
    })

    CocotaisBotPlugin.prototype.command.register('/help', '查看帮助', (context, args, event) => {
        context.groupApi.postMessage(event.group_id, {
            content: '帮助信息: \n' + globalStage.commands.map((cmd) => {
                return `${cmd.match} - ${cmd.provider}`
            }).join('\n'),
            msg_type: 0,
            msg_id: event.id
        })
    })
}