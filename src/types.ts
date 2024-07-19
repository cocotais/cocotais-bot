import { IOpenAPI } from "qq-bot-sdk"
import { CocotaisBotPlugin } from "./plugin"
import { EventEmitter } from "ws"

export const events = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES', 'MESSAGE_AUDIT', 'INTERACTION', 'GROUP_AND_C2C_EVENT']
export function translateWsEvent<T extends keyof EventList>(event: string, resp: WsResponse): Array<{event: T, resp: EventList[T]}> {
    let ans: Array<{event: T, resp: EventList[T]}> = [];
    // TODO: finish translate
    return ans;
}
export type EventList = {
    'guild.add': any,
    'guild.update': any,
    'guild.delete': any,
    'guild.channel.add': any,
    'guild.channel.update': any,
    'guild.channel.delete': any,
    'guild.member.add': any,
    'guild.member.update': any,
    'guild.member.remove': any,

    'group.add': any,
    'group.del': any

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