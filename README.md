<div align="center"><a name="readme-top"></a>

> WARNING: 此版本(1.5.0-test*)并非稳定版本，仅用于测试，勿用于生产环境。
>
> 请使用稳定版本[1.4.3](https://www.npmjs.com/package/cocotais-bot/v/1.4.3)

<img height="160" src="https://static.codemao.cn/coco/player/unstable/ryYpO7wja.image/png?hash=Fk5MB4bIWWoeu5uaE4GQ2VJM0L3o">

<h1>Cocotais Bot</h1>

基于 [qq-bot-sdk](https://www.npmjs.com/package/qq-bot-sdk) 实现的的QQ官方机器人框架

[![][cocotais-bot-文档-shield]][cocotais-bot-文档-link]
[![][share-qq-shield]][share-qq-link]


[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][npm-types-shield]][npm-types-link]




[Changelog](https://bot.cocotais.cn/reference/changelog)

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

## ✨ 特性

- 💨 **快速**: 使用NodeJS+NPM即可快速部署机器人实例。
- 🐈 **轻量**: 打包后仅18个文件，70KB。
- 🗣️ **易用**: 提供了详细的文档，丰富的代码补全。


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

Copyright © 2024 [Cocotais Team][profile-link]. <br />
许可证：[Apache 2.0](./LICENSE)

[profile-link]: https://github.com/cocotais
[share-qq-shield]: https://img.shields.io/badge/-share%20on%20qq-black?labelColor=black&logo=tencentqq&logoColor=white&style=flat-square
[share-qq-link]: http://connect.qq.com/widget/shareqq/index.html?desc=Cocotais%20Bot%20%E6%98%AF%E5%9F%BA%E4%BA%8E%20qq-bot-sdk%20%E5%AE%9E%E7%8E%B0%E7%9A%84QQ%E5%AE%98%E6%96%B9%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%A1%86%E6%9E%B6%20%23bot%20%23QQ&sharesource=qzone&summary=%E5%BF%AB%E6%9D%A5%E7%9C%8B%EF%BC%81%E5%BF%AB%E6%8D%B7%E3%80%81%E8%BD%BB%E9%87%8F%E3%80%81%E6%98%93%E7%94%A8%E7%9A%84QQ%E5%AE%98%E6%96%B9%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%A1%86%E6%9E%B6%EF%BC%81%20-%20Cocotais%20Bot%20%E6%98%AF%E5%9F%BA%E4%BA%8E%20qq-bot-sdk%20%E5%AE%9E%E7%8E%B0%E7%9A%84QQ%E5%AE%98%E6%96%B9%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%A1%86%E6%9E%B6&title=%E5%BF%AB%E6%9D%A5%E7%9C%8B%EF%BC%81%E5%BF%AB%E6%8D%B7%E3%80%81%E8%BD%BB%E9%87%8F%E3%80%81%E6%98%93%E7%94%A8%E7%9A%84QQ%E5%AE%98%E6%96%B9%E6%9C%BA%E5%99%A8%E4%BA%BA%E6%A1%86%E6%9E%B6%EF%BC%81&url=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcocotais-bot
[cocotais-bot-文档-shield]: https://img.shields.io/website?down_message=%E7%A6%BB%E7%BA%BF&label=Cocotais%20Bot%20%E6%96%87%E6%A1%A3&labelColor=black&style=flat-square&up_message=%E5%9C%A8%E7%BA%BF&url=https%3A%2F%2Fbot.cocotais.cn%2F
[cocotais-bot-文档-link]: https://bot.cocotais.cn/
[npm-release-shield]: https://img.shields.io/npm/v/cocotais-bot?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/cocotais-bot
[npm-downloads-shield]: https://img.shields.io/npm/dt/cocotais-bot?labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/cocotais-bot
[npm-types-shield]: https://img.shields.io/npm/types/cocotais-bot?labelColor=black&style=flat-square
[npm-types-link]: https://www.npmjs.com/package/cocotais-bot