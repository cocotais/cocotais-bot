import { IOpenAPI } from "qq-bot-sdk"
import { CocotaisBotPlugin } from "./plugin"
import { EventEmitter } from "ws"

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

interface BaseRespMessage {
    id: string,
    [key: string]: any
}

type RespMessage<T> = BaseRespMessage;

export interface WsResponse<T>{
    eventType: T,
    eventId: string,
    msg: RespMessage<T>
}

export type EventList = {
    'GROUP': WsResponse<'GROUP'>,
    'GUILDS': WsResponse<'GUILDS'>,
    'GUILD_MEMBERS': WsResponse<'GUILD_MEMBERS'>,
    'GUILD_MESSAGES': WsResponse<'GUILD_MESSAGES'>,
    'GUILD_MESSAGE_REACTIONS': WsResponse<'GUILD_MESSAGE_REACTIONS'>,
    'DIRECT_MESSAGE': WsResponse<'DIRECT_MESSAGE'>,
    'INTERACTION': WsResponse<'INTERACTION'>,
    'MESSAGE_AUDIT': WsResponse<'MESSAGE_AUDIT'>,
    'FORUMS_EVENT': WsResponse<'FORUMS_EVENT'>,
    'AUDIO_ACTION': WsResponse<'AUDIO_ACTION'>,
    'PUBLIC_GUILD_MESSAGES': WsResponse<'PUBLIC_GUILD_MESSAGES'>,
    'C2C_MESSAGE_CREATE': WsResponse<'C2C_MESSAGE_CREATE'>,
    'GROUP_AT_MESSAGE_CREATE': WsResponse<'GROUP_AT_MESSAGE_CREATE'>
    'DIRECT_MESSAGE_CREATE': WsResponse<'DIRECT_MESSAGE_CREATE'>,
    'AT_MESSAGE_CREATE': WsResponse<'AT_MESSAGE_CREATE'>,
    'MESSAGE_CREATE': WsResponse<'MESSAGE_CREATE'>,
    'GUILD_CREATE': WsResponse<'GUILD_CREATE'>,
    'GUILD_UPDATE': WsResponse<'GUILD_UPDATE'>,
    'GUILD_DELETE': WsResponse<'GUILD_DELETE'>,
    'CHANNEL_CREATE': WsResponse<'CHANNEL_CREATE'>,
    'CHANNEL_UPDATE': WsResponse<'CHANNEL_UPDATE'>,
    'CHANNEL_DELETE': WsResponse<'CHANNEL_DELETE'>,
    'GUILD_MEMBER_ADD': WsResponse<'GUILD_MEMBER_ADD'>,
    'GUILD_MEMBER_UPDATE': WsResponse<'GUILD_MEMBER_UPDATE'>,
    'GUILD_MEMBER_REMOVE': WsResponse<'GUILD_MEMBER_REMOVE'>,
    'AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER': WsResponse<'AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER'>,
    'AUDIO_OR_LIVE_CHANNEL_MEMBER_LEAVE': WsResponse<'AUDIO_OR_LIVE_CHANNEL_MEMBER_LEAVE'>,
    'AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT': WsResponse<'AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT'>,
    'FORUM_THREAD_CREATE': WsResponse<'FORUM_THREAD_CREATE'>,
    'FORUM_THREAD_UPDATE': WsResponse<'FORUM_THREAD_UPDATE'>,
    'FORUM_THREAD_DELETE': WsResponse<'FORUM_THREAD_DELETE'>,
    'FORUM_POST_CREATE': WsResponse<'FORUM_POST_CREATE'>,
    'FORUM_POST_DELETE': WsResponse<'FORUM_POST_DELETE'>,
    'FORUM_REPLY_CREATE': WsResponse<'FORUM_REPLY_CREATE'>,
    'FORUM_REPLY_DELETE': WsResponse<'FORUM_REPLY_DELETE'>,
    'FORUM_PUBLISH_AUDIT_RESULT': WsResponse<'FORUM_PUBLISH_AUDIT_RESULT'>,
    'OPEN_FORUM_THREAD_CREATE': WsResponse<'OPEN_FORUM_THREAD_CREATE'>,
    'OPEN_FORUM_THREAD_UPDATE': WsResponse<'OPEN_FORUM_THREAD_UPDATE'>,
    'OPEN_FORUM_THREAD_DELETE': WsResponse<'OPEN_FORUM_THREAD_DELETE'>,
    'OPEN_FORUM_POST_CREATE': WsResponse<'OPEN_FORUM_POST_CREATE'>,
    'OPEN_FORUM_POST_DELETE': WsResponse<'OPEN_FORUM_POST_DELETE'>,
    'OPEN_FORUM_REPLY_CREATE': WsResponse<'OPEN_FORUM_REPLY_CREATE'>,
    'OPEN_FORUM_REPLY_DELETE': WsResponse<'OPEN_FORUM_REPLY_DELETE'>,
    'GROUP_ADD_ROBOT': WsResponse<'GROUP_ADD_ROBOT'>,
    'GROUP_DEL_ROBOT': WsResponse<'GROUP_DEL_ROBOT'>,
    'GROUP_MSG_REJECT': WsResponse<'GROUP_MSG_REJECT'>,
    'GROUP_MSG_RECEIVE': WsResponse<'GROUP_MSG_RECEIVE'>,
    'FRIEND_ADD': WsResponse<'FRIEND_ADD'>,
    'FRIEND_DEL': WsResponse<'FRIEND_DEL'>,
    'C2C_MSG_REJECT': WsResponse<'C2C_MSG_REJECT'>,
    'C2C_MSG_RECEIVE': WsResponse<'C2C_MSG_RECEIVE'>
}

export interface PluginStaged {
    id: number,
    config: {
        name: string,
        version: string
    },
    path: string,
    pluginObject: CocotaisBotPlugin
}

export interface CommandStaged {
    id: number,
    provider: string,
    match: string,
    handler: (msgs: string[], event: any) => void
}

export interface Stage {
    botObject: {
        bot: IOpenAPI | null,
        ws: EventEmitter | null
    },
    plugin: PluginStaged[],
    commands: CommandStaged[]
}