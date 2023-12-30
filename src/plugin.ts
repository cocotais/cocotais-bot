import EventEmitter from "events";
import { IOpenAPI } from "qq-bot-sdk";
class CocotaisBotPlugin extends EventEmitter {
    private botContext: IOpenAPI | null;
    private botWs: EventEmitter | null
    protected _mount: () => void
    protected _unmount: () => void
    public events: string[]
    constructor() {
        super()
        this.botContext = null;
        this.botWs = null
        this._mount = () => { };
        this._unmount = () => { };
        this.events = []
    }
    isBotEnabled() {
        return (this.botContext == null || this.botWs == null) ? false : true
    }
    enableBot(context: IOpenAPI, ws: EventEmitter) {
        this.botContext = context
        this.botWs = ws
        try { this._mount() } catch (e) { console.error('Plugin execute error:' + String(e)) }

        this.events.forEach((evt) => {
            console.log(evt + ' turns on.')
            const handler = (e: any) => {

                this.emit(evt, e);

            };
            // 插件收到事件时，将事件及数据 emit 给插件里定义的处理函数
            this.botWs?.on(evt, (e: any) => {
                if (this.isBotEnabled()) {
                    console.log(evt + ' recieved.')
                    handler(e)
                }
            });
        });
    }
    disableBot() {
        this.removeAllHandler();
        try { this._unmount() } catch (e) { console.error('Plugin unmount error:' + String(e)) }
        this.botWs = null
        this.botContext = null
    }
    removeAllHandler() {
        this.events.forEach((evt) => {
            const handler = (e: any) => {

                this.emit(evt, e);

            };
            // 插件收到事件时，将事件及数据 emit 给插件里定义的处理函数
            this.off(evt, handler);
            console.log(evt + ' turns off.')
        });
    }
    onMounted(fun: ()=>void) {
        this._mount = fun
    }
    onUnloaded(fun: ()=>void) {
        this._unmount = fun
    }
}
exports.CocotaisBotPlugin = CocotaisBotPlugin