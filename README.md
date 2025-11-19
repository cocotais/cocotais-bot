<div align="center"><a name="readme-top"></a>

<img height="160" src="https://static.codemao.cn/coco/player/unstable/ryYpO7wja.image/png?hash=Fk5MB4bIWWoeu5uaE4GQ2VJM0L3o">

<h1>Cocotais Bot</h1>

基于 [qq-bot-sdk](https://www.npmjs.com/package/qq-bot-sdk) 实现的的QQ官方机器人框架

> 项目现使用 qq-bot-sdk 的 fork 版本 [@liulyxandy/qq-bot-sdk](https://www.npmjs.com/package/@liulyxandy/qq-bot-sdk)

[![][cocotais-bot-文档-shield]][cocotais-bot-文档-link]


[![][npm-release-shield]][npm-release-link]
[![][npm-types-shield]][npm-types-link]




[Changelog](https://bot.cocotais.cn/reference/changelog)

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

## 🚫 停止维护

由于项目现存架构陈旧，且上游依赖包不活跃无法及时跟进QQ官方API更新，导致项目可用性不佳。综合考虑后，决定停止对 Cocotais Bot 的维护。

在最后一个稳定版本 v1.7.0 版本发布后，本项目将不再继续更新。

## 📦 安装

要安装 `cocotais-bot`，请参阅 [快速开始](https://bot.cocotais.cn/starter/quickstart)。你也可以这样快速安装
:

```bash
$ npm install cocotais-bot
```
#### 使用方法

1. 在项目目录下运行 `npm i cocotais-bot`
2. 在项目目录下运行 `npx cocotais-bot start` 生成配置文件
3. 按照QQ官方文档，填写config.json中相关信息
4. 在项目目录下运行 `npx cocotais-bot start` 启动机器人，使用 `--no-autoload` 阻止框架从项目目录的 `plugins` 文件夹自动加载插件
5. 在项目目录下运行 `npx cocotais-bot plugin apply <插件目录>` 以装载插件
6. 在项目目录下运行 `npx cocotais-bot plugin list` 以查看插件列表
7. 在项目目录下运行 `npx cocotais-bot plugin reload <插件ID>` 以重载插件
8. 在项目目录下运行 `npx cocotais-bot plugin remove <插件ID>` 以删除插件
9. 在项目目录下运行 `npx cocotais-bot stop` 以停止机器人

---

#### 📝 许可证

Copyright © 2024-2025 [Cocotais Team][profile-link]. <br />
许可证：[Apache 2.0](./LICENSE)

[profile-link]: https://github.com/cocotais
[cocotais-bot-文档-shield]: https://img.shields.io/website?down_message=%E7%A6%BB%E7%BA%BF&label=Cocotais%20Bot%20%E6%96%87%E6%A1%A3&labelColor=black&style=flat-square&up_message=%E5%9C%A8%E7%BA%BF&url=https%3A%2F%2Fbot.cocotais.cn%2F
[cocotais-bot-文档-link]: https://bot.cocotais.cn/
[npm-release-shield]: https://img.shields.io/npm/v/cocotais-bot?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/cocotais-bot
[npm-types-shield]: https://img.shields.io/npm/types/cocotais-bot?labelColor=black&style=flat-square
[npm-types-link]: https://www.npmjs.com/package/cocotais-bot