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

// 单聊消息
export interface C2C_MESSAGE_CREATE_RespMessage extends BaseRespMessage {
    author: {
        user_openid: string
    },
    content: string,
    timestamp: string,
    attachments?: {
        content_type: string,
        filename: string,
        height: string,
        width: string,
        size: string,
        url: string
    }[]
}

// 群聊@机器人消息
export interface GROUP_AT_MESSAGE_CREATE_RespMessage extends BaseRespMessage {
    author: {
        member_openid: string
    },
    content: string,
    group_openid: string,
    timestamp: string,
    attachments?: {
        content_type: string,
        filename: string,
        height: string,
        width: string,
        size: string,
        url: string
    }[]
}

// 频道私信消息
export interface DIRECT_MESSAGE_CREATE_RespMessage extends BaseRespMessage {
    author: {
        avatar: string,
        bot: boolean,
        id: string,
        username: string
    },
    channel_id: string,
    content: string,
    guild_id: string,
    member: {
        joined_at: string,
        roles: string[]
    },
    timestamp: string
}

// 文字子频道@机器人消息
export interface AT_MESSAGE_CREATE_RespMessage extends BaseRespMessage {
    author: {
        avatar: string,
        bot: boolean,
        id: string,
        username: string
    },
    channel_id: string,
    content: string,
    guild_id: string,
    member: {
        joined_at: string,
        roles: string[]
    },
    timestamp: string,
    seq: number
}

// 文字子频道全量消息（私域）
export interface MESSAGE_CREATE_RespMessage extends BaseRespMessage {
    author: {
        avatar: string,
        bot: boolean,
        id: string,
        username: string
    },
    channel_id: string,
    content: string,
    guild_id: string,
    member: {
        joined_at: string,
        roles: string[]
    },
    timestamp: string,
    seq: number
}

// GUILD_CREATE 事件
export interface GUILD_CREATE_RespMessage extends BaseRespMessage {
    description: string;
    icon: string;
    id: string;
    joined_at: string;
    max_members: number;
    member_count: number;
    name: string;
    op_user_id: string;
    owner_id: string;
}

// GUILD_UPDATE 事件
export interface GUILD_UPDATE_RespMessage extends BaseRespMessage {
    description: string;
    icon: string;
    id: string;
    joined_at: string;
    max_members: number;
    member_count: number;
    name: string;
    op_user_id: string;
    owner_id: string;
}

// GUILD_DELETE 事件
export interface GUILD_DELETE_RespMessage extends BaseRespMessage {
    description: string;
    icon: string;
    id: string;
    joined_at: string;
    max_members: number;
    member_count: number;
    name: string;
    op_user_id: string;
    owner_id: string;
}

// CHANNEL_CREATE 事件
export interface CHANNEL_CREATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    id: string;
    name: string;
    op_user_id: string;
    owner_id: string;
    sub_type: number;
    type: number;
}

// CHANNEL_UPDATE 事件
export interface CHANNEL_UPDATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    id: string;
    name: string;
    op_user_id: string;
    owner_id: string;
    sub_type: number;
    type: number;
}

// CHANNEL_DELETE 事件
export interface CHANNEL_DELETE_RespMessage extends BaseRespMessage {
    guild_id: string;
    id: string;
    name: string;
    op_user_id: string;
    owner_id: string;
    sub_type: number;
    type: number;
}

// GUILD_MEMBER_ADD 事件
export interface GUILD_MEMBER_ADD_RespMessage extends BaseRespMessage {
    guild_id: string;
    joined_at: string;
    nick: string;
    op_user_id: string;
    roles: string[];
    user: {
        avatar: string;
        bot: boolean;
        id: string;
        username: string;
    };
}

// GUILD_MEMBER_UPDATE 事件
export interface GUILD_MEMBER_UPDATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    joined_at: string;
    nick: string;
    op_user_id: string;
    roles: string[];
    user: {
        avatar: string;
        bot: boolean;
        id: string;
        username: string;
    };
}

// GUILD_MEMBER_REMOVE 事件
export interface GUILD_MEMBER_REMOVE_RespMessage extends BaseRespMessage {
    guild_id: string;
    joined_at: string;
    nick: string;
    op_user_id: string;
    roles: string[];
    user: {
        avatar: string;
        bot: boolean;
        id: string;
        username: string;
    };
}

// 音视频/直播子频道成员进入事件
export interface AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    channel_type: number; // 2-音视频子频道 5-直播子频道
    user_id: string;
}

// 音视频/直播子频道成员离开事件
export interface AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    channel_type: number; // 2-音视频子频道 5-直播子频道
    user_id: string;
}

// Thread 对象
interface Thread {
    thread_id: string;
    title: {
        type: number;
        text_info: {
            text: string;
        };
    }[];
    content: {
        type: number;
        text_info?: {
            text: string;
        };
        channel_info?: {
            channel_id: string;
            channel_name: string;
        };
        url_info?: {
            url: string;
            display_text: string;
        };
        emoji_info?: {
            id: number;
            type: string;
        };
    }[];
    date_time: string;
}

// Post 对象
interface Post {
    thread_id: string;
    post_id: string;
    content: {
        type: number;
        text_info?: {
            text: string;
        };
        emoji_info?: {
            id: number;
            type: string;
        };
    }[];
    date_time: string;
}

// Reply 对象
interface Reply {
    thread_id: string;
    post_id: string;
    reply_id: string;
    content: {
        type: number;
        text_info?: {
            text: string;
        };
    }[];
    date_time: string;
}

// 对应事件的 RespMessage 接口定义
export interface FORUM_THREAD_CREATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    thread_info: Thread;
}

export interface FORUM_THREAD_UPDATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    thread_info: Thread;
}

export interface FORUM_THREAD_DELETE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    thread_info: Thread;
}

export interface FORUM_POST_CREATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    post_info: Post;
}

export interface FORUM_POST_DELETE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    post_info: Post;
}

export interface FORUM_REPLY_CREATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    reply_info: Reply;
}

export interface FORUM_REPLY_DELETE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    reply_info: Reply;
}

export interface FORUM_PUBLISH_AUDIT_RESULT_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
    type: number;
    result: number;
    err_msg: string;
    thread_id: string;
    post_id: string;
    reply_id: string;
}

// 对应事件的 RespMessage 接口定义
export interface OPEN_FORUM_THREAD_CREATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
}

export interface OPEN_FORUM_THREAD_UPDATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
}

export interface OPEN_FORUM_THREAD_DELETE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
}

export interface OPEN_FORUM_POST_CREATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
}

export interface OPEN_FORUM_POST_DELETE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
}

export interface OPEN_FORUM_REPLY_CREATE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
}

export interface OPEN_FORUM_REPLY_DELETE_RespMessage extends BaseRespMessage {
    guild_id: string;
    channel_id: string;
    author_id: string;
}

export interface GROUP_ADD_ROBOT_RespMessage extends BaseRespMessage {
    group_openid: string;
    op_member_openid: string;
    timestamp: number;
}

export interface GROUP_DEL_ROBOT_RespMessage extends BaseRespMessage {
    group_openid: string;
    op_member_openid: string;
    timestamp: number;
}

export interface GROUP_MSG_REJECT_RespMessage extends BaseRespMessage {
    group_openid: string;
    op_member_openid: string;
    timestamp: number;
}

export interface GROUP_MSG_RECEIVE_RespMessage extends BaseRespMessage {
    group_openid: string;
    op_member_openid: string;
    timestamp: number;
}

export interface FRIEND_ADD_RespMessage extends BaseRespMessage {
    openid: string;
    timestamp: number;
}

export interface FRIEND_DEL_RespMessage extends BaseRespMessage {
    openid: string;
    timestamp: number;
}

export interface C2C_MSG_REJECT_RespMessage extends BaseRespMessage {
    openid: string;
    timestamp: number;
}

export interface C2C_MSG_RECEIVE_RespMessage extends BaseRespMessage {
    openid: string;
    timestamp: number;
}

type RespMessage<T> = T extends 'C2C_MESSAGE_CREATE' ? C2C_MESSAGE_CREATE_RespMessage :
    T extends 'GROUP_AT_MESSAGE_CREATE' ? GROUP_AT_MESSAGE_CREATE_RespMessage :
    T extends 'DIRECT_MESSAGE_CREATE' ? DIRECT_MESSAGE_CREATE_RespMessage :
    T extends 'AT_MESSAGE_CREATE' ? AT_MESSAGE_CREATE_RespMessage :
    T extends 'MESSAGE_CREATE' ? MESSAGE_CREATE_RespMessage :
    T extends 'GUILD_CREATE' ? GUILD_CREATE_RespMessage :
    T extends 'GUILD_UPDATE' ? GUILD_UPDATE_RespMessage :
    T extends 'GUILD_DELETE' ? GUILD_DELETE_RespMessage :
    T extends 'CHANNEL_CREATE' ? CHANNEL_CREATE_RespMessage :
    T extends 'CHANNEL_UPDATE' ? CHANNEL_UPDATE_RespMessage :
    T extends 'CHANNEL_DELETE' ? CHANNEL_DELETE_RespMessage :
    T extends 'GUILD_MEMBER_ADD' ? GUILD_MEMBER_ADD_RespMessage :
    T extends 'GUILD_MEMBER_UPDATE' ? GUILD_MEMBER_UPDATE_RespMessage :
    T extends 'GUILD_MEMBER_REMOVE' ? GUILD_MEMBER_REMOVE_RespMessage :
    T extends 'AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER' ? AUDIO_OR_LIVE_CHANNEL_MEMBER_ENTER_RespMessage :
    T extends 'AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT' ? AUDIO_OR_LIVE_CHANNEL_MEMBER_EXIT_RespMessage :
    T extends 'FORUM_THREAD_CREATE' ? FORUM_THREAD_CREATE_RespMessage :
    T extends 'FORUM_THREAD_UPDATE' ? FORUM_THREAD_UPDATE_RespMessage :
    T extends 'FORUM_THREAD_DELETE' ? FORUM_THREAD_DELETE_RespMessage :
    T extends 'FORUM_POST_CREATE' ? FORUM_POST_CREATE_RespMessage :
    T extends 'FORUM_POST_DELETE' ? FORUM_POST_DELETE_RespMessage :
    T extends 'FORUM_REPLY_CREATE' ? FORUM_REPLY_CREATE_RespMessage :
    T extends 'FORUM_REPLY_DELETE' ? FORUM_REPLY_DELETE_RespMessage :
    T extends 'FORUM_PUBLISH_AUDIT_RESULT' ? FORUM_PUBLISH_AUDIT_RESULT_RespMessage :
    T extends 'OPEN_FORUM_THREAD_CREATE' ? OPEN_FORUM_THREAD_CREATE_RespMessage :
    T extends 'OPEN_FORUM_THREAD_UPDATE' ? OPEN_FORUM_THREAD_UPDATE_RespMessage :
    T extends 'OPEN_FORUM_THREAD_DELETE' ? OPEN_FORUM_THREAD_DELETE_RespMessage :
    T extends 'OPEN_FORUM_POST_CREATE' ? OPEN_FORUM_POST_CREATE_RespMessage :
    T extends 'OPEN_FORUM_POST_DELETE' ? OPEN_FORUM_POST_DELETE_RespMessage :
    T extends 'OPEN_FORUM_REPLY_CREATE' ? OPEN_FORUM_REPLY_CREATE_RespMessage :
    T extends 'OPEN_FORUM_REPLY_DELETE' ? OPEN_FORUM_REPLY_DELETE_RespMessage :
    T extends 'GUILD_MEMBER_ADD' ? GUILD_MEMBER_ADD_RespMessage :
    T extends 'GUILD_MEMBER_UPDATE' ? GUILD_MEMBER_UPDATE_RespMessage :
    T extends 'GUILD_MEMBER_REMOVE' ? GUILD_MEMBER_REMOVE_RespMessage :
    T extends 'GROUP_ADD_ROBOT' ? GROUP_ADD_ROBOT_RespMessage :
    T extends 'GROUP_DEL_ROBOT' ? GROUP_DEL_ROBOT_RespMessage :
    T extends 'GROUP_MSG_REJECT' ? GROUP_MSG_REJECT_RespMessage :
    T extends 'GROUP_MSG_RECEIVE' ? GROUP_MSG_RECEIVE_RespMessage :
    T extends 'FRIEND_ADD' ? FRIEND_ADD_RespMessage :
    T extends 'FRIEND_DEL' ? FRIEND_DEL_RespMessage :
    T extends 'C2C_MSG_REJECT' ? C2C_MSG_REJECT_RespMessage :
    T extends 'C2C_MSG_RECEIVE' ? C2C_MSG_RECEIVE_RespMessage :
    BaseRespMessage;

export interface WsResponse<T> {
    eventType: T,
    eventId: string,
    msg: RespMessage<T>
}

export type EventList = {
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