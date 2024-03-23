import path from 'path'
import pm2 from 'pm2'

let packagePath = path.dirname(require.resolve("cocotais-bot")) + '/'


function cleanBot(name: string | number) {
    pm2.delete(name, (e) => {
        if (e) {
            console.log('[守护进程] 删除失败：')
            console.log(JSON.stringify(e))
        }
        else {
            console.log('[守护进程] 已删除')
        }
        pm2.disconnect()
        process.exit()
    })
}

if (process.argv[2] == "start") {

    let name = 'CocotaisBot' + Date.now()
    pm2.connect((e) => {
        if (e) {
            console.log("[守护进程] 连接PM2失败：")
            console.log(JSON.stringify(e))
            process.exit()
        }
        pm2.list((e, list) => {
            if (e) {
                console.log("[守护进程] 获取PM2列表失败：")
                console.log(JSON.stringify(e))
                pm2.disconnect()
                process.exit()
            }
            if (list.length != 0) {
                console.log("[守护进行] PM2有其余运行进程。当前版本仅支持独占PM2运行。")
                pm2.disconnect()
                process.exit()
            }
        })
        pm2.start({
            name,
            script: packagePath + 'index.js',
            autorestart: false
        }, (e) => {
            if (e) {
                console.log("[守护进程] 启动失败：")
                console.log(JSON.stringify(e))
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
                    console.log("[守护进程] 发送测试消息失败：")
                    console.log(JSON.stringify(e))
                }
            })
        })
    })
    pm2.launchBus((err, pm2_bus) => {
        if (err) {
            console.log("[守护进程] LaunchBus失败：")
            console.log(JSON.stringify(err))
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
                if (process.argv[3] != '--no-autoload') {
                    pm2.sendDataToProcessId(0, {
                        id: 0,
                        type: 'process:msg',
                        topic: true,
                        data: {
                            type: 'plugin.autoload'
                        }
                    }, (e) => {
                        if (e) {
                            console.log("[守护进程] 发送自动加载插件消息失败：")
                            console.log(JSON.stringify(e))
                            pm2.disconnect()
                            process.exit()
                        }
                    })
                }
                else {
                    pm2.disconnect()
                    process.exit()
                }

            }
            else if (packet.data.type == 'login.error') {
                console.log('[后台进程] 登录失败：' + JSON.stringify(packet.data.data))
                if (process.argv[3] != '--no-killbot') {
                    console.log("[守护进程] 设置了不结束机器人进程，直接退出。")
                    pm2.disconnect()
                    process.exit()
                }
                else{
                    cleanBot(name)
                }
            }
            else if (packet.data.type == 'plugin.autoload.success') {
                console.log('[后台进程] 插件已自动装载')
                pm2.disconnect()
                process.exit()
            }
            else if (packet.data.type == 'plugin.autoload.error') {
                console.log('[后台进程] 插件自动装载失败')
                pm2.disconnect()
                process.exit()
            }
        })
    })
}
else if (process.argv[2] == "plugin") {
    if (process.argv[3] == "apply") {
        pm2.connect((e) => {
            if (e) {
                console.log("[守护进程] 连接PM2失败：")
                console.log(JSON.stringify(e))
                process.exit()
            }
            pm2.sendDataToProcessId(0, {
                id: 0,
                type: 'process:msg',
                topic: true,
                data: {
                    type: 'plugin.apply',
                    data: {
                        name: "plugin",
                        path: path.resolve(process.argv[4])
                    }
                }
            }, (e) => {
                if (e) {
                    console.log("[守护进程] 发送数据包失败：")
                    console.log(JSON.stringify(e))
                }
            })
        })
        pm2.launchBus((err, pm2_bus) => {
            if (err) {
                console.log("[守护进程] LaunchBus失败：")
                console.log(JSON.stringify(err))
                pm2.disconnect()
                process.exit()
            }
            console.log("[守护进程] LaunchBus成功")
            pm2_bus.on('process:msg', function (packet: any) {
                if (packet.data.type == 'plugin.apply.success') {
                    console.log('[后台进程] 插件已应用')
                    pm2.disconnect()
                    process.exit()
                }
                else if (packet.data.type == 'plugin.apply.error') {
                    console.log(packet)
                    console.log('[后台进程] 插件应用失败：' + JSON.stringify(packet.data.data))
                    pm2.disconnect()
                    process.exit()
                }
            })
        })
    }
    else if (process.argv[3] == "remove") {
        pm2.connect((e) => {
            if (e) {
                console.log("[守护进程] 连接PM2失败：")
                console.log(JSON.stringify(e))
                process.exit()
            }
            pm2.sendDataToProcessId(0, {
                id: 0,
                type: 'process:msg',
                topic: true,
                data: {
                    type: 'plugin.remove',
                    data: {
                        id: process.argv[4]
                    }
                }
            }, (e) => {
                if (e) {
                    console.log("[守护进程] 发送数据包失败：")
                    console.log(JSON.stringify(e))
                }
            })
        })
        pm2.launchBus((err, pm2_bus) => {
            if (err) {
                console.log("[守护进程] LaunchBus失败：")
                console.log(JSON.stringify(err))
                pm2.disconnect()
                process.exit()
            }
            console.log("[守护进程] LaunchBus成功")
            pm2_bus.on('process:msg', function (packet: any) {
                if (packet.data.type == 'plugin.remove.success') {
                    console.log('[后台进程] 插件已删除')
                    pm2.disconnect()
                    process.exit()
                }
                else if (packet.data.type == 'plugin.remove.error') {
                    console.log('[后台进程] 插件删除失败：' + JSON.stringify(packet.data.data))
                    pm2.disconnect()
                    process.exit()
                }
            })
        })
    }
    else if (process.argv[3] == "reload") {
        pm2.connect((e) => {
            if (e) {
                console.log("[守护进程] 连接PM2失败：")
                console.log(JSON.stringify(e))
                process.exit()
            }
            pm2.sendDataToProcessId(0, {
                id: 0,
                type: 'process:msg',
                topic: true,
                data: {
                    type: 'plugin.reload',
                    data: {
                        id: process.argv[4]
                    }
                }
            }, (e) => {
                if (e) {
                    console.log("[守护进程] 发送数据包失败：")
                    console.log(JSON.stringify(e))
                }
            })
        })
        pm2.launchBus((err, pm2_bus) => {
            if (err) {
                console.log("[守护进程] LaunchBus失败：")
                console.log(JSON.stringify(err))
                pm2.disconnect()
                process.exit()
            }
            console.log("[守护进程] LaunchBus成功")
            pm2_bus.on('process:msg', function (packet: any) {
                if (packet.data.type == 'plugin.reload.success') {
                    console.log('[后台进程] 插件已重载')
                    pm2.disconnect()
                    process.exit()
                }
                else if (packet.data.type == 'plugin.reload.error') {
                    console.log('[后台进程] 插件重载失败：' + JSON.stringify(packet.data.data))
                    pm2.disconnect()
                    process.exit()
                }
            })
        })
    }
    else if (process.argv[3] == "list") {
        pm2.connect((e) => {
            if (e) {
                console.log("[守护进程] 连接PM2失败：")
                console.log(JSON.stringify(e))
                process.exit()
            }
            pm2.sendDataToProcessId(0, {
                id: 0,
                type: 'process:msg',
                topic: true,
                data: {
                    type: 'plugin.list'
                }
            }, (e) => {
                if (e) {
                    console.log("[守护进程] 发送数据包失败：")
                    console.log(JSON.stringify(e))
                }
            })
        })
        pm2.launchBus((err, pm2_bus) => {
            if (err) {
                console.log("[守护进程] LaunchBus失败：")
                console.log(JSON.stringify(err))
                pm2.disconnect()
                process.exit()
            }
            console.log("[守护进程] LaunchBus成功")
            pm2_bus.on('process:msg', function (packet: any) {
                if (packet.data.type == 'plugin.list') {
                    console.log("[后台进程] 插件列表：")
                    console.log(JSON.stringify(packet.data.data))
                    pm2.disconnect()
                    process.exit()
                }

            })
        })
    }
}
else if (process.argv[2] == "stop") {
    cleanBot(0)
}
else {
    console.log('Cocotais Bot 守护进程帮助')
    console.log('版本：' + require(packagePath + '../package.json').version)
    console.log('使用方法：')
    console.log('  start: 启动机器人')
    console.log('  plugin apply: 装载机器人插件')
    console.log('  plugin reload: 重新装载机器人插件')
    console.log('  plugin delete: 卸载机器人插件')
    console.log('  stop: 停止机器人')
}