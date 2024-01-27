import { IOpenAPI } from "qq-bot-sdk";
import { EventEmitter } from "events";

function keepAlive(){
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
        if(!process.send) console.log('[ERROR] Not IPC Channel')
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
        if(!process.send) console.log('[ERROR] Not IPC Channel')
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
    ws.on('GROUP', (data) => {
        console.log('[GROUP] 事件接收 :', data);
    })
    ws.on('GUILDS', (data) => {
        console.log('[GUILDS] 事件接收 :', data);
    });
    ws.on('GUILD_MEMBERS', (data) => {
        console.log('[GUILD_MEMBERS] 事件接收 :', data);
    });
    ws.on('GUILD_MESSAGES', (data) => {
        console.log('[GUILD_MESSAGES] 事件接收 :', data);
    });
    ws.on('GUILD_MESSAGE_REACTIONS', (data) => {
        console.log('[GUILD_MESSAGE_REACTIONS] 事件接收 :', data);
    });
    ws.on('DIRECT_MESSAGE', (data) => {
        console.log('[DIRECT_MESSAGE] 事件接收 :', data);
    });
    ws.on('INTERACTION', (data) => {
        console.log('[INTERACTION] 事件接收 :', data);
    });
    ws.on('MESSAGE_AUDIT', (data) => {
        console.log('[MESSAGE_AUDIT] 事件接收 :', data);
    });
    ws.on('FORUMS_EVENT', (data) => {
        console.log('[FORUMS_EVENT] 事件接收 :', data);
    });
    ws.on('AUDIO_ACTION', (data) => {
        console.log('[AUDIO_ACTION] 事件接收 :', data);
    });
    ws.on('PUBLIC_GUILD_MESSAGES', (data) => {
        console.log('[PUBLIC_GUILD_MESSAGES] 事件接收 :', data);
    });

}