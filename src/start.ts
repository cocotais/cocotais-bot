import { GetWsParam, Config, createOpenAPI, createWebsocket } from 'qq-bot-sdk';
import { botHandler } from './bot';
import { globalStage } from '.';
import { CocotaisBotEvent } from './event';

/**
 * 启动机器人
 * @param options 配置信息
 */

export async function startBot(options: GetWsParam & Config) {
    const testConfig = options;

    // 创建 client
    const client = createOpenAPI(testConfig);

    // 创建 websocket 连接
    const ws = createWebsocket(testConfig);

    if (!client || !ws){
        console.error("[ERR(000)] 创建机器人实例失败")
        console.error("[ERR(000)] 请检查网络连接，随后重启机器人")
    }

    const event = new CocotaisBotEvent(client, ws)

    globalStage.botObject.bot = client
    globalStage.botObject.event = event
    globalStage.botObject.ws = ws
    
    botHandler(client,ws,event)
}
