import pm2 from 'pm2'

function cleanBot(name: string){
    pm2.delete(name, (e) => {
        if (e) console.log(e)
        console.log('[守护进程] 已删除')
        pm2.disconnect()
        process.exit()
    })
}

if (process.argv[2] == "start") {

    let name = 'CocotaisBot' + Date.now()
    pm2.connect((e) => {
        if (e) {
            console.log("[守护进程] 连接PM2失败："+e.message)
            process.exit()
        }
        pm2.start({
            name,
            script: './lib/index.js',
            autorestart: false
        }, (e) => {
            if (e) {
                console.log("[守护进程] 启动失败：" + e.message)
                pm2.disconnect()
                process.exit()
            }
            
            console.log("[守护进程] 已启动")
            pm2.sendDataToProcessId(0, {
                id: 0,
                type: 'process:msg',
                topic: true,
                data: {
                    type: 'ping'
                }
            }, (e) => {
                if (e) {
                    console.log("[守护进程] 发送测试消息失败：" + e.message)
                }
            })
        })
    })
    pm2.launchBus((err, pm2_bus) => {
        if (err) {
            console.log("[守护进程] LaunchBus失败：" + err.message)
            pm2.disconnect()
            process.exit()
        }
        console.log("[守护进程] LaunchBus成功")
        pm2_bus.on('process:msg', function (packet: any) {
            if (packet.data.type == 'ping') {
                console.log('[后台进程] 成功收到Ping消息')
            }
            else if (packet.data.type == 'pong') {
                console.log('[后台进程] 成功收到测试消息回复')
            }
            else if (packet.data.type == 'internal.profile_missing') {
                console.log('[后台进程] 启动失败：config.json未创建，已为您创建')
                cleanBot(name)
            }
            else if (packet.data.type == 'login.success') {
                console.log('[后台进程] 登录成功')
                pm2.disconnect()
                process.exit()
            }
            else if (packet.data.type == 'login.error') {
                console.log('[后台进程] 登录失败：' + packet.data.data.msg)
                cleanBot(name)

            }
        })
    })
}


