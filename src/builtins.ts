import { globalStage } from ".";
import { CocotaisBotPlugin } from "./plugin";
import { C2cMessageEvent, GroupMessageEvent, GuildMessageEvent } from "./types";

export function getBuiltinPlugins(){
    return [
        function(){
            const plugin = new CocotaisBotPlugin("builtin:help","1.0.0")
            plugin.onMounted((bot) => {
                plugin.command.register("/help","显示帮助信息", (type, _msgs, event) => {
                    let content = '帮助信息: \n' + globalStage.commands.map((cmd) => {
                        return `${cmd.match} - ${cmd.description}`
                    }).join('\n')
                    if(type == 'c2c'){
                        let uid = (event as C2cMessageEvent).user.id
                        let mid = (event as C2cMessageEvent).id
                        bot.c2cApi.postMessage(uid, {
                            msg_type: 0,
                            content: content,
                            msg_id: mid
                        })
                    }
                    else if(type == 'group'){
                        let gid = (event as GroupMessageEvent).group.id
                        let mid = (event as GroupMessageEvent).id
                        bot.groupApi.postMessage(gid, {
                            msg_type: 0,
                            content: content,
                            msg_id: mid
                        })
                    }
                    else if(type == 'guild'){
                        let cid = (event as GuildMessageEvent).channel.id
                        let mid = (event as GuildMessageEvent).id
                        bot.messageApi.postMessage(cid, {
                            content: content,
                            msg_id: mid
                        })
                    }
                    else if(type == 'direct'){
                        let gid = (event as GuildMessageEvent).guild.id
                        bot.directMessageApi.postDirectMessage(gid, {
                            content: content,
                            msg_id: (event as GuildMessageEvent).id
                        })
                    }
                })
            })
            return plugin
        }()
    ]
}