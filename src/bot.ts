import { Context } from "@satorijs/satori";

export function botHandler(context: Context){
    context.on('message',(message)=>{
        console.log(message.content)
    })
}