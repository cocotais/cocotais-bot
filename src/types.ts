import { IOpenAPI } from "qq-bot-sdk"
import { CocotaisBotPlugin } from "./plugin"
import { EventEmitter } from "ws"

export const events = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES', 'MESSAGE_AUDIT', 'INTERACTION', 'GROUP_AND_C2C_EVENT']

export function translateWsEvent<T extends keyof EventList>(event: string, resp: WsResponse): Array<{ event: T, resp: EventList[T] }> {
    let ans: Array<{ event: T, resp: EventList[T] }> = [];
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

interface UserEvent {
    time: number,
    user: {
        id: string
    }
}

interface Attachment {
    content_type?: string,
    filename?: string,
    height?: string,
    width?: string,
    size?: string,
    url: string
}

interface Embed {
    title: string,
    prompt: string,
    thumbnail?: {
        url: string
    },
    fields?: {
        name: string
    }[]
}

interface Reference {
    message_id: string
}

interface C2cMessageEvent {
    id: string,
    user: {
        id: string
    },
    message: {
        content: string,
        attachments?: Attachment[],
    },
    time: string
}

interface GroupMessageEvent {
    id: string,
    user: {
        id: string
    },
    group: {
        id: string
    }
    message: {
        content: string,
        attachments?: Attachment[],
    },
    time: string
}

interface GuildMessageEvent {
    id: string,
    user: {
        roles: string[],
        avatar: string,
        id: string,
        username: string,
        bot: boolean,
        join_time: string
    },
    guild: {
        id: string
    },
    channel: {
        id: string
    },
    message: {
        content: string,
        attachments?: Attachment[],
        embeds?: Embed[],
        mentions?: {
            avatar: string,
            id: string,
            username: string,
            bot: boolean,
        }[],
        reference?: Reference,
        mention_everyone: boolean
    },
    time: string,
    edited_time?: string
}

interface MessageAuditEvent<P extends boolean> {
    message: {
        audit_id: string,
        message_id: P extends true ? string : undefined,
    },
    guild: {
        id: string
    },
    channel: {
        id: string
    },
    time: {
        audit: string,
        create: string
    }
}

interface ReactionEvent {
    user: {
        id: string
    },
    guild: {
        id: string
    },
    channel: {
        id: string
    },
    target: {
        id: string,
        type: 'message' | 'thread' | 'post' | 'reply'
    },
    reaction: {
        type: 'system' | 'emoji',
        id: string
    }
}

interface InteractionEvent {
    id: string,
    scene: 'c2c' | 'group' | 'guild'
    time: string,
    guild?: {
        id: string
    },
    channel?: {
        id: string
    },
    user?: {
        id: string
    },
    group?: {
        id: string
    },
    interaction: {
        type: 'button' | 'menu',
        button?: {
            data: string,
            id: string
        },
        feature?: string,
        id?: string,
        version: 1,
        bot_id: string
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

    'message': GuildMessageEvent | C2cMessageEvent | GroupMessageEvent,
    'message.delete': any, /** Missing docs */
    'message.guild': GuildMessageEvent,
    'message.guild.delete': any, /** Missing docs */
    'message.guild.public': GuildMessageEvent,
    'message.guild.public.delete': any, /** Missing docs */
    'message.direct': GuildMessageEvent,
    'message.direct.delete': any, /** Missing docs */
    'message.c2c': C2cMessageEvent,
    'message.c2c.reject': UserEvent,
    'message.c2c.receive': UserEvent,
    'message.group': GroupMessageEvent,
    'message.group.reject': GroupEvent,
    'message.group.receive': GroupEvent,

    'message.audit.pass': MessageAuditEvent<true>,
    'message.audit.reject': MessageAuditEvent<false>,

    'reaction': ReactionEvent,
    'reaction.guild': ReactionEvent,
    'reaction.guild.delete': any, /** Missing docs */

    'friend.add': UserEvent,
    'friend.delete': UserEvent,

    'interaction': InteractionEvent,

    'forum.thread.create': any,
    'forum.thread.update': any,
    'forum.thread.delete': any,

    'forum.post.create': any,
    'forum.post.delete': any,

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