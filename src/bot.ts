import { IOpenAPI } from "qq-bot-sdk";
import { EventEmitter } from "events";
import { globalStage } from ".";
import { C2cMessageEvent, GroupMessageEvent, GuildMessageEvent, WsResponse, events } from "./types";
import { getBuiltinPlugins } from "./builtins";

function keepAlive() {
    process.send!({
        type: 'process:msg',
        data: {
            type: 'ping',
            data: 'ping'
        }
    }, undefined, undefined, (err) => {
        if (err) {
            console.error("[WARN(001)] 无法向守护进程发送保活消息")
            console.error(`[WARN(001)] 遇到问题: ${err.name}`)
            console.error(`[WARN(001)] 错误信息: ${err.message}`)
            console.error(`[WARN(001)] 错误堆栈: ${err.stack?.split("\n").join("\n[WARN(001)] ")}`)
        }
    })
}

/**
 * 机器人启动处理器
 * @param context 机器人实例
 * @param ws WebSocket实例
 */
export function botHandler(context: IOpenAPI, ws: EventEmitter, event: EventEmitter) {
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
        console.error('[ERR(010)] 连接到服务器失败 :', data);
        if (!process.send) console.error("[ERR(002)] 不是有效的IPC通道")
        keepAlive()
        process.send!({
            type: 'process:msg',
            data: {
                type: 'login.error',
                data: data
            }
        })
    });
    event.on('message.guild', (resp: GuildMessageEvent) => {
        console.log(`[Guild] ${resp.guild.id}/${resp.channel.id}/${resp.user.id}: ${resp.message.content}`)
        globalStage.commands.forEach((command) => {
            if (resp.message.content.trim().startsWith(command.match)) {
                if (command.option){
                    if (command.option.availableScenes && !command.option.availableScenes.includes('guild')){
                        return
                    }
                    if (command.option.dontTriggerAt && command.option.dontTriggerAt.includes(resp.user.id)){
                        return
                    }
                    if (command.option.onlyTriggerAt && !command.option.onlyTriggerAt.includes(resp.user.id)){
                        return
                    }
                }
                command.handler('guild', resp.message.content.trim().split(' '), resp)
            }
        })
    })
    event.on('message.direct', (resp: GuildMessageEvent)=>{
        console.log(`[Direct] ${resp.guild.id}/${resp.user.id}: ${resp.message.content}`)
        globalStage.commands.forEach((command) => {
            if (command.option){
                if (command.option.availableScenes && !command.option.availableScenes.includes('direct')){
                    return
                }
                if (command.option.dontTriggerAt && command.option.dontTriggerAt.includes(resp.user.id)){
                    return
                }
                if (command.option.onlyTriggerAt && !command.option.onlyTriggerAt.includes(resp.user.id)){
                    return
                }
            }
            if (resp.message.content.trim().startsWith(command.match)) {
                command.handler('direct', resp.message.content.trim().split(' '), resp)
            }
        })
    })
    event.on('message.c2c', (resp: C2cMessageEvent) => {
        console.log(`[C2C] ${resp.user.id}: ${resp.message.content}`)
        globalStage.commands.forEach((command) => {
            if (command.option){
                if (command.option.availableScenes && !command.option.availableScenes.includes('c2c')){
                    return
                }
                if (command.option.dontTriggerAt && command.option.dontTriggerAt.includes(resp.user.id)){
                    return
                }
                if (command.option.onlyTriggerAt && !command.option.onlyTriggerAt.includes(resp.user.id)){
                    return
                }
            }
            if (resp.message.content.trim().startsWith(command.match)) {
                command.handler('c2c', resp.message.content.trim().split(' '), resp)
            }
        })
    })
    event.on('message.group', (resp: GroupMessageEvent)=>{
        console.log(`[Group] ${resp.group.id}/${resp.user.id}: ${resp.message.content}`)
        globalStage.commands.forEach((command) => {
            if (command.option){
                if (command.option.availableScenes && !command.option.availableScenes.includes('group')){
                    return
                }
                if (command.option.dontTriggerAt && command.option.dontTriggerAt.includes(resp.user.id)){
                    return
                }
                if (command.option.onlyTriggerAt && !command.option.onlyTriggerAt.includes(resp.user.id)){
                    return
                }
            }
            if (resp.message.content.trim().startsWith(command.match)) {
                command.handler('group', resp.message.content.trim().split(' '), resp)
            }
        })
    })
    getBuiltinPlugins().forEach((plugin) => {
        plugin.enableBot(context, ws, globalStage.plugin.length, event)
    })

}