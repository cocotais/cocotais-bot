import { Context } from "@satorijs/satori";
import QQBot from "@satorijs/adapter-qq";
import { botHandler } from "./bot";

export async function startBot(options: QQBot.Config) {

    const ctx = new Context()
    options.intents = 0 | 1 << 30 | 1 << 25 | 1 << 9
    ctx.plugin(QQBot, options)
    ctx.start()
        .then(() => {
            botHandler(ctx)
        })
}
