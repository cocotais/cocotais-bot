import { GetWsParam, Config, createOpenAPI, createWebsocket } from 'qq-bot-sdk';
import { botHandler } from './bot';

export async function startBot(options: GetWsParam & Config) {
    const testConfig = options;

    // 创建 client
    const client = createOpenAPI(testConfig);

    // 创建 websocket 连接
    const ws = createWebsocket(testConfig);

    botHandler(client,ws)
}
