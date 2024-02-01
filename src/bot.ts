import { IOpenAPI } from "qq-bot-sdk";
import { EventEmitter } from "events";
import { globalStage } from ".";

export const events = ['GROUP', 'GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'INTERACTION', 'MESSAGE_AUDIT', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES']
export const messageEvents = ['C2C_MESSAGE_CREATE', 'GROUP_AT_MESSAGE_CREATE', 'DIRECT_MESSAGE_CREATE', 'AT_MESSAGE_CREATE', 'MESSAGE_CREATE']
export const guildEvents = ['GUILD_CREATE', 'GUILD_UPDATE', 'GUILD_DELETE']
export const channelEvents = ['CHANNEL_CREATE', 'CHANNEL_UPDATE', 'CHANNEL_DELETE']
export const guildMemberEvents = ['GUILD_MEMBER_ADD', 'GUILD_MEMBER_UPDATE', 'GUILD_MEMBER_REMOVE']
export const audioOrLiveChannelMemberEvents = ['AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER', 'AUDIO_OR_LIVE_CHANNEL_MEMBER_LEAVE', 'AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT']
export const forumEvents = ['FORUM_THREAD_CREATE', 'FORUM_THREAD_UPDATE', 'FORUM_THREAD_DELETE', 'FORUM_POST_CREATE', 'FORUM_POST_DELETE', 'FORUM_REPLY_CREATE', 'FORUM_REPLY_DELETE', 'FORUM_PUBLISH_AUDIT_RESULT']
export const openForumEvents = ['OPEN_FORUM_THREAD_CREATE', 'OPEN_FORUM_THREAD_UPDATE', 'OPEN_FORUM_THREAD_DELETE', 'OPEN_FORUM_POST_CREATE', 'OPEN_FORUM_POST_DELETE', 'OPEN_FORUM_REPLY_CREATE', 'OPEN_FORUM_REPLY_DELETE']
export const groupEvents = ['GROUP_ADD_ROBOT', 'GROUP_DEL_ROBOT', 'GROUP_MSG_REJECT', 'GROUP_MSG_RECEIVE']
export const userEvents = ['FRIEND_ADD', 'FRIEND_DEL', 'C2C_MSG_REJECT', 'C2C_MSG_RECEIVE']

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
                if(typeof cmd.match == 'string') cmd.match = new RegExp(cmd.match)
                if (cmd.match.test(data.msg.content)) {
                    cmd.handler(context, data.msg.content.trim().split(" "))
                }
            })
        })
    })
}