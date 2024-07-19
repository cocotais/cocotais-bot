import { IOpenAPI } from "qq-bot-sdk"
import { CocotaisBotPlugin } from "./plugin"
import { EventEmitter } from "ws"

export const events = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES', 'MESSAGE_AUDIT', 'INTERACTION', 'GROUP_AND_C2C_EVENT']

export function translateWsEvent<T extends keyof EventList>(event: string, resp: WsResponse): Array<{event: T, resp: EventList[T]}> {
    let ans: Array<{event: T, resp: EventList[T]}> = [];
    // TODO: finish translate
    return ans;
}

interface GuildEvent {
    guild: {
        name: string,
        description: string,
        icon: string,
        id: string,
        members: {
            count: number,
            max: number
        },
        owner: {
            id: string
        }
    },
    user: {
        id: string,
        join_time: string
    }
}

interface ChannelEvent {
    guild: {
        id: string
    },
    channel: {
        id: string,
        name: string,
        type: 'text' | 'audio' | 'channel_group' | 'live' | 'app' | 'forum',
        sub_type?: '闲聊' | '公告' | '攻略' | '开黑',
        owner: {
            id: string
        }
    },
    user: {
        id: string
    }
}

interface GuildMemberEvent {
    guild: {
        id: string
    },
    member: {
        nickname: string,
        roles: string[],
        avatar: string,
        id: string,
        username: string,
        bot: boolean,
        join_time: string
    },
    user: {
        id: string
    }
}

interface GroupEvent {
    time: number,
    group: {
        id: string
    },
    user: {
        id: string
    }
}

export type EventList = {
    'guild.add': GuildEvent,
    'guild.update': GuildEvent,
    'guild.delete': GuildEvent,
    'guild.channel.add': ChannelEvent,
    'guild.channel.update': ChannelEvent,
    'guild.channel.delete': ChannelEvent,
    'guild.member.add': GuildMemberEvent,
    'guild.member.update': GuildMemberEvent,
    'guild.member.remove': GuildMemberEvent,

    'group.add': GroupEvent,
    'group.del': GroupEvent

    'message': any,
    'message.guild': any,
    'message.guild.delete': any,
    'message.guild.public': any,
    'message.guild.public.delete': any,
    'message.c2c': any,
    'message.c2c.reject': any,
    'message.c2c.receive': any,
    'message.group': any,
    'message.group.reject': any,
    'message.group.receive': any,

    'message.audit.pass': any,
    'message.audit.reject': any,

    'reaction': any,
    'reaction.guild': any,
    'reaction.guild.delete': any,

    'friend.add': any,
    'friend.delete': any,

    'interaction': any,

    'forum.thread': any,
    'forum.thread.create': any,
    'forum.thread.update': any,
    'forum.thread.delete': any,

    'forum.post': any,
    'forum.post.create': any,
    'forum.post.delete': any,

    'forum.reply': any,
    'forum.reply.create': any,
    'forum.reply.delete': any,

    'forum.publish.result': any,

    'audio.start': any,
    'audio.finish': any,
    'audio.mic.on': any,
    'audio.mic.off': any
}

interface BaseRespMessage {
    id: string,
    [key: string]: any
}

export interface WsResponse {
    eventType: string,
    eventId: string,
    msg: BaseRespMessage
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
    description: string,
    match: string,
    provider: string,
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