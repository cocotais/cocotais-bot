import { Context } from "@satorijs/satori";
import QQBot from "@satorijs/adapter-qq";

export async function startBot(options: QQBot.Config) {

    const ctx = new Context()

    ctx.plugin(QQBot, options)

    await ctx.start()
}
