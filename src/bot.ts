import { IOpenAPI } from "qq-guild-bot";
import { EventEmitter } from "events";

export function botHandler(context: IOpenAPI, ws: EventEmitter) {
    ws.on('READY', (data) => {
        console.log('[READY] 已连接到服务器');
    });
    ws.on('ERROR', (data) => {
        console.log('[ERROR] 连接到服务器失败 :', data);
    });
    ws.on('GUILDS', (data) => {
        console.log('[GUILDS] 事件接收 :', data);
    });
    ws.on('GUILD_MEMBERS', (data) => {
        console.log('[GUILD_MEMBERS] 事件接收 :', data);
    });
    ws.on('AT_MESSAGE_CREATE', (data) => {
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