import { IOpenAPI } from "qq-bot-sdk"
import { CocotaisBotPlugin } from "./plugin"
import { EventEmitter } from "ws"

export const events = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE', 'FORUMS_EVENT', 'AUDIO_ACTION', 'PUBLIC_GUILD_MESSAGES', 'MESSAGE_AUDIT', 'INTERACTION', 'GROUP_AND_C2C_EVENT']

export type EventList = {}

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