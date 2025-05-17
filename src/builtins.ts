import { globalStage } from ".";
import { havePermission } from "./bot";
import { CocotaisBotPlugin } from "./plugin";

export function getBuiltinPlugins(){
    return [
        function(){
            const plugin = new CocotaisBotPlugin("builtin:help","1.0.0")
            plugin.onMounted((bot) => {
                plugin.command.register("/help","显示帮助信息", (type, _msgs, event) => {
                    let content = '帮助信息: \n' + globalStage.commands
                        .filter(cmd => {
                            if (!cmd.option) return true;
                            return havePermission(type, cmd.option, event.user.id
                                , 'guild' in event ? event.guild.id : undefined
                                , 'channel' in event ? event.channel.id : undefined
                                , 'group' in event ? event.group.id : undefined)
                        })
                        .map((cmd) => {
                            return `${cmd.match} - ${cmd.description}`
                        })
                        .join('\n')
                    event.reply(content)
                })
            })
            return plugin
        }()
    ]
}