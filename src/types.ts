import { IOpenAPI } from "qq-bot-sdk"
import { CocotaisBotPlugin } from "./plugin"
import { EventEmitter } from "ws"

export const events = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES', 'MESSAGE_AUDIT', 'INTERACTION', 'GROUP_AND_C2C_EVENT']

interface EventKV<T extends keyof EventList> {
    event: T,
    resp: EventList[T]
}
interface Attachment {
    content_type?: string,
    filename?: string,
    height?: string,
    width?: string,
    size?: string,
    url: string
}
export function translateWsEvent<T extends keyof EventList>(event: string, resp: WsResponse): EventKV<T>[] {
    let ans: EventKV<keyof EventList>[] = [];
    switch (event) {
        case 'GUILD_CREATE':
            (ans as EventKV<'guild.add'>[]).push({
                event: 'guild.add',
                resp: {
                    guild: {
                        name: resp.msg.name,
                        description: resp.msg.description,
                        icon: resp.msg.icon,
                        id: resp.msg.id,
                        members: {
                            count: resp.msg.member_count,
                            max: resp.msg.max_members
                        },
                        owner: {
                            id: resp.msg.owner_id
                        }
                    },
                    user: {
                        id: resp.msg.op_user_id
                    },
                    join_time: resp.msg.joined_at
                }
            })
            break;

        case 'GUILD_UPDATE':
            (ans as EventKV<'guild.update'>[]).push({
                event: 'guild.update',
                resp: {
                    guild: {
                        name: resp.msg.name,
                        description: resp.msg.description,
                        icon: resp.msg.icon,
                        id: resp.msg.id,
                        members: {
                            count: resp.msg.member_count,
                            max: resp.msg.max_members
                        },
                        owner: {
                            id: resp.msg.owner_id
                        }
                    },
                    user: {
                        id: resp.msg.op_user_id
                    },
                    join_time: resp.msg.joined_at
                }
            })
            break;

        case 'GUILD_DELETE':
            (ans as EventKV<'guild.delete'>[]).push({
                event: 'guild.delete',
                resp: {
                    guild: {
                        name: resp.msg.name,
                        description: resp.msg.description,
                        icon: resp.msg.icon,
                        id: resp.msg.id,
                        members: {
                            count: resp.msg.member_count,
                            max: resp.msg.max_members
                        },
                        owner: {
                            id: resp.msg.owner_id
                        }
                    },
                    user: {
                        id: resp.msg.op_user_id
                    },
                    join_time: resp.msg.joined_at
                }
            })
            break;

        case 'CHANNEL_CREATE':
            (ans as EventKV<'guild.channel.add'>[]).push({
                event: 'guild.channel.add',
                resp: {
                    guild: {
                        id: resp.msg.guild_id
                    },
                    channel: {
                        id: resp.msg.id,
                        name: resp.msg.name,
                        type: resp.msg.type,
                        sub_type: resp.msg.sub_type,
                        owner: {
                            id: resp.msg.owner_id
                        }
                    },
                    user: {
                        id: resp.msg.op_user_id
                    }
                }
            });
            break;

        case 'CHANNEL_UPDATE':
            (ans as EventKV<'guild.channel.update'>[]).push({
                event: 'guild.channel.update',
                resp: {
                    guild: {
                        id: resp.msg.guild_id
                    },
                    channel: {
                        id: resp.msg.id,
                        name: resp.msg.name,
                        type: resp.msg.type,
                        sub_type: resp.msg.sub_type,
                        owner: {
                            id: resp.msg.owner_id
                        }
                    },
                    user: {
                        id: resp.msg.op_user_id
                    }
                }
            })
            break;

        case 'CHANNEL_DELETE':
            (ans as EventKV<'guild.channel.delete'>[]).push({
                event: 'guild.channel.delete',
                resp: {
                    guild: {
                        id: resp.msg.guild_id
                    },
                    channel: {
                        id: resp.msg.id,
                        name: resp.msg.name,
                        type: resp.msg.type,
                        sub_type: resp.msg.sub_type,
                        owner: {
                            id: resp.msg.owner_id
                        }
                    },
                    user: {
                        id: resp.msg.op_user_id
                    }
                }
            })
            break;

        case 'GUILD_MEMBER_ADD':
            (ans as EventKV<'guild.member.add'>[]).push({
                event: 'guild.member.add',
                resp: {
                    guild: {
                        id: resp.msg.guild_id
                    },
                    member: {
                        nickname: resp.msg.nick,
                        avatar: resp.msg.user.avatar,
                        id: resp.msg.user.id,
                        roles: resp.msg.roles,
                        join_time: resp.msg.joined_at,
                        username: resp.msg.user.username,
                        bot: resp.msg.user.bot
                    },
                    user: {
                        id: resp.msg.user.id
                    }
                }
            })
            break;

        case 'GUILD_MEMBER_UPDATE':
            (ans as EventKV<'guild.member.update'>[]).push({
                event: 'guild.member.update',
                resp: {
                    guild: {
                        id: resp.msg.guild_id
                    },
                    member: {
                        nickname: resp.msg.nick,
                        avatar: resp.msg.user.avatar,
                        id: resp.msg.user.id,
                        roles: resp.msg.roles,
                        join_time: resp.msg.joined_at,
                        username: resp.msg.user.username,
                        bot: resp.msg.user.bot
                    },
                    user: {
                        id: resp.msg.user.id
                    }
                }
            })
            break;

        case 'GUILD_MEMBER_REMOVE':
            (ans as EventKV<'guild.member.remove'>[]).push({
                event: 'guild.member.remove',
                resp: {
                    guild: {
                        id: resp.msg.guild_id
                    },
                    member: {
                        nickname: resp.msg.nick,
                        avatar: resp.msg.user.avatar,
                        id: resp.msg.user.id,
                        roles: resp.msg.roles,
                        join_time: resp.msg.joined_at,
                        username: resp.msg.user.username,
                        bot: resp.msg.user.bot
                    },
                    user: {
                        id: resp.msg.user.id
                    }
                }
            })
            break;

        case 'GROUP_ADD_ROBOT':
            (ans as EventKV<'group.add'>[]).push({
                event: 'group.add',
                resp: {
                    group: {
                        id: resp.msg.group_openid
                    },
                    user: {
                        id: resp.msg.op_member_openid,
                    },
                    time: resp.msg.timestamp
                }
            })
            break;

        case 'GROUP_DEL_ROBOT':
            (ans as EventKV<'group.delete'>[]).push({
                event: 'group.delete',
                resp: {
                    group: {
                        id: resp.msg.group_openid
                    },
                    user: {
                        id: resp.msg.op_member_openid,
                    },
                    time: resp.msg.timestamp
                }
            })
            break;

        // 单聊消息
        case 'C2C_MESSAGE_CREATE':
            let c2cResp = {
                id: resp.msg.id,
                user: {
                    id: resp.msg.author.user_openid
                },
                message: {
                    content: resp.msg.content,
                    attachments: resp.msg.attachments
                },
                time: resp.msg.timestamp
            };
            (ans as EventKV<'message.c2c'>[]).push({
                event: 'message.c2c',
                resp: c2cResp
            });
            (ans as EventKV<'message'>[]).push({
                event: 'message',
                resp: c2cResp
            });
            break;

        // 群聊 @ 机器人
        case 'GROUP_AT_MESSAGE_CREATE':
            let groupResp = {
                id: resp.msg.id,
                user: {
                    id: resp.msg.author.member_openid
                },
                group: {
                    id: resp.msg.group_openid
                },
                message: {
                    content: resp.msg.content,
                    attachments: resp.msg.attachments
                },
                time: resp.msg.timestamp
            };
            (ans as EventKV<'message.group'>[]).push({
                event: 'message.group',
                resp: groupResp
            });
            (ans as EventKV<'message'>[]).push({
                event: 'message',
                resp: groupResp
            });
            break;

        // 频道私信消息
        case 'DIRECT_MESSAGE_CREATE':
            let directResp = {
                id: resp.msg.id,
                user: {
                    id: resp.msg.author.id,
                    avatar: resp.msg.author.avatar,
                    roles: [], // 频道私信中没有角色信息
                    username: resp.msg.author.username,
                    bot: resp.msg.author.bot,
                    join_time: resp.msg.member?.joined_at || '' // 可能不存在
                },
                channel: {
                    id: resp.msg.channel_id
                },
                guild: {
                    id: resp.msg.guild_id
                },
                message: {
                    content: resp.msg.content,
                    attachments: resp.msg.attachments,
                    embeds: resp.msg.embeds,
                    mentions: resp.msg.mentions,
                    reference: resp.msg.reference ? {
                        message_id: resp.msg.reference.message_id
                    } : undefined,
                    mention_everyone: resp.msg.mention_everyone
                },
                time: resp.msg.timestamp,
                edited_time: resp.msg.edited_timestamp // 如果存在
            };
            (ans as EventKV<'message.direct'>[]).push({
                event: 'message.direct',
                resp: directResp
            });
            (ans as EventKV<'message'>[]).push({
                event: 'message',
                resp: directResp
            });
            break;

        // 文字子频道 @ 机器人
        case 'AT_MESSAGE_CREATE':
            let atResp = {
                id: resp.msg.id,
                user: {
                    id: resp.msg.author.id,
                    avatar: resp.msg.author.avatar,
                    roles: resp.msg.member.roles,
                    bot: resp.msg.author.bot,
                    join_time: resp.msg.member.joined_at,
                    username: resp.msg.author.username
                },
                guild: {
                    id: resp.msg.guild_id // 添加 guild 信息
                },
                channel: {
                    id: resp.msg.channel_id
                },
                message: {
                    content: resp.msg.content,
                    attachments: resp.msg.attachments,
                    embeds: resp.msg.embeds,
                    mentions: resp.msg.mentions,
                    reference: resp.msg.reference ? {
                        message_id: resp.msg.reference.message_id
                    } : undefined,
                    mention_everyone: resp.msg.mention_everyone
                },
                time: resp.msg.timestamp,
                edited_time: resp.msg.edited_timestamp // 如果存在
            };
            (ans as EventKV<'message.guild.public'>[]).push({
                event: 'message.guild.public',
                resp: atResp
            });
            (ans as EventKV<'message'>[]).push({
                event: 'message',
                resp: atResp
            });
            break;

        // 文字子频道全量消息
        case 'MESSAGE_CREATE':
            let messageResp = {
                id: resp.msg.id,
                user: {
                    id: resp.msg.author.id,
                    avatar: resp.msg.author.avatar,
                    roles: resp.msg.member.roles,
                    bot: resp.msg.author.bot,
                    join_time: resp.msg.member.joined_at,
                    username: resp.msg.author.username
                },
                guild: {
                    id: resp.msg.guild_id // 添加 guild 信息
                },
                channel: {
                    id: resp.msg.channel_id
                },
                message: {
                    content: resp.msg.content,
                    attachments: resp.msg.attachments,
                    embeds: resp.msg.embeds,
                    mentions: resp.msg.mentions,
                    reference: resp.msg.reference ? {
                        message_id: resp.msg.reference.message_id
                    } : undefined,
                    mention_everyone: resp.msg.mention_everyone
                },
                time: resp.msg.timestamp,
                edited_time: resp.msg.edited_timestamp // 如果存在
            };
            (ans as EventKV<'message.guild'>[]).push({
                event: 'message.guild',
                resp: messageResp
            });
            (ans as EventKV<'message'>[]).push({
                event: 'message',
                resp: messageResp
            });
            break;

        default:
            console.warn('Unknown raw WebSocket event, skipping...')
            break;
    }
    return ans as EventKV<T>[];
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
    },
    join_time: string
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

interface ThreadEvent {
    guild: {
        id: string
    },
    channel: {
        id: string
    },
    user: {
        id: string
    },
    thread: {
        id: string,
        title: string,
        content: string,
        time: string
    }
}

interface PostEvent {
    guild: {
        id: string
    },
    channel: {
        id: string
    },
    user: {
        id: string
    },
    thread: {
        id: string
    }
    post: {
        id: string,
        content: string,
        time: string
    }
}

interface ReplyEvent {
    guild: {
        id: string
    },
    channel: {
        id: string
    },
    user: {
        id: string
    },
    thread: {
        id: string
    },
    post: {
        id: string
    },
    reply: {
        id: string,
        content: string,
        time: string
    }
}

interface ForumAuditEvent {
    guild: {
        id: string
    },
    channel: {
        id: string
    },
    thread?: {
        id: string
    },
    post?: {
        id: string
    },
    reply?: {
        id: string
    },
    user: {
        id: string
    },
    audit: {
        type: 'thread' | 'post' | 'reply',
        pass: boolean,
        reason?: string
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
    'group.delete': GroupEvent

    'message': GuildMessageEvent | C2cMessageEvent | GroupMessageEvent,
    //'message.delete': any, /** Missing docs */
    'message.guild': GuildMessageEvent,
    //'message.guild.delete': any, /** Missing docs */
    'message.guild.public': GuildMessageEvent,
    //'message.guild.public.delete': any, /** Missing docs */
    'message.direct': GuildMessageEvent,
    //'message.direct.delete': any, /** Missing docs */
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
    //'reaction.guild.delete': any, /** Missing docs */

    'friend.add': UserEvent,
    'friend.delete': UserEvent,

    'interaction': InteractionEvent,

    'forum.thread.create': ThreadEvent,
    'forum.thread.update': ThreadEvent,
    'forum.thread.delete': ThreadEvent,

    'forum.post.create': PostEvent,
    'forum.post.delete': PostEvent,

    'forum.reply.create': ReplyEvent,
    'forum.reply.delete': ReplyEvent,

    'forum.publish.result': ForumAuditEvent,

    /*
    // Not implemented yet. Missing docs.
    'audio.start': any,
    'audio.finish': any,
    'audio.mic.on': any,
    'audio.mic.off': any
    */
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