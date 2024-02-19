import { globalStage } from ".";
import { CocotaisBotPlugin } from "./plugin";

export function getBuiltinPlugins(){
    return [
        function(){
            const plugin = new CocotaisBotPlugin("builtin:help","1.0.0")
            plugin.onMounted((bot) => {
                plugin.command.register("/help","显示帮助信息", (_msgs, event) => {
                    if(event.eventType == 'DIRECT_MESSAGE_CREATE'){
                        bot.messageApi.postMessage(event.msg.channel_id, {
                            content: '帮助信息: \n' + globalStage.commands.map((cmd) => {
                                return `${cmd.match} - ${cmd.description}`
                            }).join('\n'),
                            msg_id: event.msg.id
                        })
                    }
                    else if(event.eventType == 'GROUP_AT_MESSAGE_CREATE'){
                        bot.groupApi.postMessage(event.msg.group_id, {
                            content: '帮助信息: \n' + globalStage.commands.map((cmd) => {
                                return `${cmd.match} - ${cmd.description}`
                            }).join('\n'),
                            msg_type: 0,
                            msg_id: event.msg.id
                        })
                    }
                    else if(event.eventType == 'DIRECT_MESSAGE_CREATE'){
                        bot.directMessageApi.postDirectMessage(event.msg.guild_id,{
                            content: '帮助信息: \n' + globalStage.commands.map((cmd) => {
                                return `${cmd.match} - ${cmd.description}`
                            }).join('\n'),
                            msg_id: event.msg.id
                        })
                    }
                    else if(event.eventType == 'C2C_MESSAGE_CREATE'){
                        // TODO: 发送私聊消息
                    }
                })
            })
            return plugin
        }()
    ]
}