import { EventEmitter } from "node:events";
import { events, EventList, WsResponse, ReactionEvent, MessageAuditEvent, UserEvent, InteractionEvent, ThreadEvent, PostEvent, ReplyEvent, ForumAuditEvent } from "./types";
import { IOpenAPI } from "qq-bot-sdk";

interface EventKV<T extends keyof EventList> {
    event: T,
    resp: EventList[T]
}

export function translateWsEvent<T extends keyof EventList>(event: string, resp: WsResponse, bot: IOpenAPI): EventKV<T>[] {
    function generateReplyFunction(type: 'guild'|'group'|'c2c'|'direct', mid: string, gid: string){
        if (type === 'guild'){
            return (content: string) => {
                bot.messageApi.postMessage(gid, {
                    content: content,
                    msg_id: mid
                })
            }
        }
        else if (type === 'group'){
            return (content: string) => {
                bot.groupApi.postMessage(gid, {
                    msg_type: 0,
                    content: content,
                    msg_id: mid
                })
            }
        }
        else if (type === 'c2c'){
            return (content: string) => {
                bot.c2cApi.postMessage(gid, {
                    msg_type: 0,
                    content: content,
                    msg_id: mid
                })
            }
        }
        else {
            return (content: string) => {
                bot.directMessageApi.postDirectMessage(gid, {
                    content: content,
                    msg_id: mid
                })
            }
        }
    }
    let ans: EventKV<keyof EventList>[] = [];
    switch (event) {
        case 'GUILD_CREATE':
            let res = {
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
            };
            (ans as EventKV<'guild.add'>[]).push({
                event: 'guild.add',
                resp: res
            });
            break;

        case 'GUILD_UPDATE':
            let resUpdate = {
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
            };
            (ans as EventKV<'guild.update'>[]).push({
                event: 'guild.update',
                resp: resUpdate
            });
            break;

        case 'GUILD_DELETE':
            let resDelete = {
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
            };
            (ans as EventKV<'guild.delete'>[]).push({
                event: 'guild.delete',
                resp: resDelete
            });
            break;

        case 'CHANNEL_CREATE':
            let resChannelCreate = {
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
            };
            (ans as EventKV<'guild.channel.add'>[]).push({
                event: 'guild.channel.add',
                resp: resChannelCreate
            });
            break;

        case 'CHANNEL_UPDATE':
            let resChannelUpdate = {
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
            };
            (ans as EventKV<'guild.channel.update'>[]).push({
                event: 'guild.channel.update',
                resp: resChannelUpdate
            });
            break;

        case 'CHANNEL_DELETE':
            let resChannelDelete = {
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
            };
            (ans as EventKV<'guild.channel.delete'>[]).push({
                event: 'guild.channel.delete',
                resp: resChannelDelete
            });
            break;

        case 'GUILD_MEMBER_ADD':
            let resMemberAdd = {
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
            };
            (ans as EventKV<'guild.member.add'>[]).push({
                event: 'guild.member.add',
                resp: resMemberAdd
            });
            break;

        case 'GUILD_MEMBER_UPDATE':
            let resMemberUpdate = {
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
            };
            (ans as EventKV<'guild.member.update'>[]).push({
                event: 'guild.member.update',
                resp: resMemberUpdate
            });
            break;

        case 'GUILD_MEMBER_REMOVE':
            let resMemberRemove = {
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
            };
            (ans as EventKV<'guild.member.remove'>[]).push({
                event: 'guild.member.remove',
                resp: resMemberRemove
            });
            break;

        case 'GROUP_ADD_ROBOT':
            let resGroupAdd = {
                group: {
                    id: resp.msg.group_openid
                },
                user: {
                    id: resp.msg.op_member_openid
                },
                time: resp.msg.timestamp
            };
            (ans as EventKV<'group.add'>[]).push({
                event: 'group.add',
                resp: resGroupAdd
            });
            break;

        case 'GROUP_DEL_ROBOT':
            let resGroupDelete = {
                group: {
                    id: resp.msg.group_openid
                },
                user: {
                    id: resp.msg.op_member_openid
                },
                time: resp.msg.timestamp
            };
            (ans as EventKV<'group.delete'>[]).push({
                event: 'group.delete',
                resp: resGroupDelete
            });
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
                time: resp.msg.timestamp,
                reply: generateReplyFunction('c2c', resp.msg.id, resp.msg.author.user_openid)
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
                time: resp.msg.timestamp,
                reply: generateReplyFunction('group', resp.msg.id, resp.msg.group_openid)
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
                edited_time: resp.msg.edited_timestamp, // 如果存在
                reply: generateReplyFunction('direct', resp.msg.id, resp.msg.guild_id)
            };
            (ans as EventKV<'message.direct'>[]).push({
                event: 'message.direct',
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
                edited_time: resp.msg.edited_timestamp, // 如果存在
                reply: generateReplyFunction('guild', resp.msg.id, resp.msg.channel_id)
            };
            (ans as EventKV<'message.guild.public'>[]).push({
                event: 'message.guild.public',
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
                edited_time: resp.msg.edited_timestamp, // 如果存在
                reply: generateReplyFunction('guild', resp.msg.id, resp.msg.channel_id)
            };
            (ans as EventKV<'message.guild'>[]).push({
                event: 'message.guild',
                resp: messageResp
            });
            break;

        // 表情添加事件
        case 'MESSAGE_REACTION_ADD':
            let reactionAddResp: ReactionEvent = {
                user: {
                    id: resp.msg.user_id
                },
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                target: {
                    id: resp.msg.target.id,
                    type: resp.msg.target.type === 0 ? 'message' : resp.msg.target.type === 1 ? 'thread' : resp.msg.target.type === 2 ? 'post' : 'reply'
                },
                reaction: {
                    type: resp.msg.emoji.type === 1 ? 'emoji' : 'system',
                    id: resp.msg.emoji.id
                }
            };
            (ans as EventKV<'reaction'>[]).push({
                event: 'reaction',
                resp: reactionAddResp
            });
            break;

        // 表情移除事件
        case 'MESSAGE_REACTION_REMOVE':
            let reactionRemoveResp: ReactionEvent = {
                user: {
                    id: resp.msg.user_id
                },
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                target: {
                    id: resp.msg.target.id,
                    type: resp.msg.target.type === 0 ? 'message' : resp.msg.target.type === 1 ? 'thread' : resp.msg.target.type === 2 ? 'post' : 'reply'
                },
                reaction: {
                    type: resp.msg.emoji.type === 1 ? 'emoji' : 'system',
                    id: resp.msg.emoji.id
                }
            };
            (ans as EventKV<'reaction.delete'>[]).push({
                event: 'reaction.delete',
                resp: reactionRemoveResp
            });
            break;

        // 消息审核通过事件
        case 'MESSAGE_AUDIT_PASS':
            let messageAuditPassResp: MessageAuditEvent<true> = {
                message: {
                    audit_id: resp.msg.audit_id,
                    message_id: resp.msg.message_id
                },
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                time: {
                    audit: resp.msg.audit_time,
                    create: resp.msg.create_time
                }
            };
            (ans as EventKV<'message.audit.pass'>[]).push({
                event: 'message.audit.pass',
                resp: messageAuditPassResp
            });
            break;

        // 消息审核拒绝事件
        case 'MESSAGE_AUDIT_REJECT':
            let messageAuditRejectResp: MessageAuditEvent<false> = {
                message: {
                    audit_id: resp.msg.audit_id,
                    message_id: undefined
                },
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                time: {
                    audit: resp.msg.audit_time,
                    create: resp.msg.create_time
                }
            };
            (ans as EventKV<'message.audit.reject'>[]).push({
                event: 'message.audit.reject',
                resp: messageAuditRejectResp
            });
            break;

        // 用户添加好友事件
        case 'FRIEND_ADD':
            let friendAddResp: UserEvent = {
                time: resp.msg.timestamp,
                user: {
                    id: resp.msg.openid
                }
            };
            (ans as EventKV<'friend.add'>[]).push({
                event: 'friend.add',
                resp: friendAddResp
            });
            break;

        // 用户删除好友事件
        case 'FRIEND_DEL':
            let friendDeleteResp: UserEvent = {
                time: resp.msg.timestamp,
                user: {
                    id: resp.msg.openid
                }
            };
            (ans as EventKV<'friend.delete'>[]).push({
                event: 'friend.delete',
                resp: friendDeleteResp
            });
            break;

        // 互动创建事件
        case 'INTERACTION_CREATE':
            let interactionResp: InteractionEvent = {
                id: resp.msg.id,
                scene: resp.msg.chat_type === 0 ? 'guild' : (resp.msg.chat_type === 1 ? 'group' : 'c2c'),
                time: resp.msg.timestamp,
                guild: resp.msg.guild_id ? { id: resp.msg.guild_id } : undefined,
                channel: resp.msg.channel_id ? { id: resp.msg.channel_id } : undefined,
                user: resp.msg.user_openid ? { id: resp.msg.user_openid } : undefined,
                group: resp.msg.group_openid ? { id: resp.msg.group_openid } : undefined,
                interaction: {
                    type: resp.msg.data.resolved.button_id ? 'button' : 'menu',
                    button: resp.msg.data.resolved.button_id ? {
                        data: resp.msg.data.resolved.button_data,
                        id: resp.msg.data.resolved.button_id
                    } : undefined,
                    feature: resp.msg.data.resolved.feature_id,
                    id: resp.msg.id,
                    version: resp.msg.version,
                    bot_id: resp.msg.application_id
                }
            };
            (ans as EventKV<'interaction'>[]).push({
                event: 'interaction',
                resp: interactionResp
            });
            break;

        // 主题创建事件
        case 'FORUM_THREAD_CREATE':
            let threadCreateEvent: ThreadEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                user: {
                    id: resp.msg.author_id
                },
                thread: {
                    id: resp.msg.thread_info.thread_id,
                    title: resp.msg.thread_info.title || '',
                    content: resp.msg.thread_info.content || '',
                    time: resp.msg.thread_info.date_time
                }
            };
            (ans as EventKV<'forum.thread.create'>[]).push({
                event: 'forum.thread.create',
                resp: threadCreateEvent
            });
            break;

        // 主题更新事件
        case 'FORUM_THREAD_UPDATE':
            let threadUpdateEvent: ThreadEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                user: {
                    id: resp.msg.author_id
                },
                thread: {
                    id: resp.msg.thread_info.thread_id,
                    title: resp.msg.thread_info.title || '',
                    content: resp.msg.thread_info.content || '',
                    time: resp.msg.thread_info.date_time
                }
            };
            (ans as EventKV<'forum.thread.update'>[]).push({
                event: 'forum.thread.update',
                resp: threadUpdateEvent
            });
            break;

        // 主题删除事件
        case 'FORUM_THREAD_DELETE':
            let threadDeleteEvent: ThreadEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                user: {
                    id: resp.msg.author_id
                },
                thread: {
                    id: resp.msg.thread_info.thread_id,
                    title: resp.msg.thread_info.title || '',
                    content: resp.msg.thread_info.content || '',
                    time: resp.msg.thread_info.date_time
                }
            };
            (ans as EventKV<'forum.thread.delete'>[]).push({
                event: 'forum.thread.delete',
                resp: threadDeleteEvent
            });
            break;

        // 帖子创建事件
        case 'FORUM_POST_CREATE':
            let postCreateEvent: PostEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                user: {
                    id: resp.msg.author_id
                },
                thread: {
                    id: resp.msg.post_info.thread_id
                },
                post: {
                    id: resp.msg.post_info.post_id,
                    content: resp.msg.post_info.content || '',
                    time: resp.msg.post_info.date_time
                }
            };
            (ans as EventKV<'forum.post.create'>[]).push({
                event: 'forum.post.create',
                resp: postCreateEvent
            });
            break;

        // 帖子删除事件
        case 'FORUM_POST_DELETE':
            let postDeleteEvent: PostEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                user: {
                    id: resp.msg.author_id
                },
                thread: {
                    id: resp.msg.post_info.thread_id
                },
                post: {
                    id: resp.msg.post_info.post_id,
                    content: resp.msg.post_info.content || '',
                    time: resp.msg.post_info.date_time
                }
            };
            (ans as EventKV<'forum.post.delete'>[]).push({
                event: 'forum.post.delete',
                resp: postDeleteEvent
            });
            break;

        // 回复创建事件
        case 'FORUM_REPLY_CREATE':
            let replyCreateEvent: ReplyEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                user: {
                    id: resp.msg.author_id
                },
                thread: {
                    id: resp.msg.reply_info.thread_id
                },
                post: {
                    id: resp.msg.reply_info.post_id
                },
                reply: {
                    id: resp.msg.reply_info.reply_id,
                    content: resp.msg.reply_info.content || '',
                    time: resp.msg.reply_info.date_time
                }
            };
            (ans as EventKV<'forum.reply.create'>[]).push({
                event: 'forum.reply.create',
                resp: replyCreateEvent
            });
            break;

        // 回复删除事件
        case 'FORUM_REPLY_DELETE':
            let replyDeleteEvent: ReplyEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                user: {
                    id: resp.msg.author_id
                },
                thread: {
                    id: resp.msg.reply_info.thread_id
                },
                post: {
                    id: resp.msg.reply_info.post_id
                },
                reply: {
                    id: resp.msg.reply_info.reply_id,
                    content: resp.msg.reply_info.content || '',
                    time: resp.msg.reply_info.date_time
                }
            };
            (ans as EventKV<'forum.reply.delete'>[]).push({
                event: 'forum.reply.delete',
                resp: replyDeleteEvent
            });
            break;

        // 论坛审核事件
        case 'FORUM_PUBLISH_AUDIT_RESULT':
            let forumAuditEvent: ForumAuditEvent = {
                guild: {
                    id: resp.msg.guild_id
                },
                channel: {
                    id: resp.msg.channel_id
                },
                thread: resp.msg.thread_id ? { id: resp.msg.thread_id } : undefined,
                post: resp.msg.post_id ? { id: resp.msg.post_id } : undefined,
                reply: resp.msg.reply_id ? { id: resp.msg.reply_id } : undefined,
                user: {
                    id: resp.msg.author_id
                },
                audit: {
                    type: resp.msg.type === 1 ? 'thread' : resp.msg.type === 2 ? 'post' : 'reply',
                    pass: resp.msg.result === 0,
                    reason: resp.msg.err_msg || undefined
                }
            };
            (ans as EventKV<'forum.publish.result'>[]).push({
                event: 'forum.publish.result',
                resp: forumAuditEvent
            });
            break;

        default:
            console.warn('Unknown raw WebSocket event, skipping...')
            break;
    }
    return ans as EventKV<T>[];
}

export class CocotaisBotEvent extends EventEmitter {
    constructor(bot: IOpenAPI, ws: EventEmitter) {
        super();
        events.forEach(event => {
            ws.on(event, (resp: WsResponse) => {
                let translated = translateWsEvent(resp.eventType, resp, bot)
                translated.forEach(e => {
                    this.emit('internal.event', e.event, e.resp)
                    this.emit(e.event, e.resp)
                })
            });
        });
    }
}