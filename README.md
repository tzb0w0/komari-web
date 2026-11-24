# komari-web（定制分支：线路显示 + 重传测试）

Komari 的**前端主题**（React + Vite）。它不独立部署，构建产物会被打包进服务端二进制（`web/public/defaultTheme/dist.tar.zst`）。

本分支在服务器卡片上新增：

- **当前线路**：显示探针自动识别的出口线路（线路名 + ASN + 自动识别标记），纯展示、无任何输入控件
- **重传测试**：在延迟信息下方显示 TCP 重传率、重传报文数、发送报文数

> 原版 README 已移除，本文档为本分支唯一说明。服务端与探针见 [komari](https://github.com/tzb0w0/komari) / [komari-agent](https://github.com/tzb0w0/komari-agent)。

---

## 一、正常使用：不需要单独构建本仓库

完整系统请用服务端仓库的一键脚本，它会自动构建本仓库并把产物塞进服务端：

```bash
curl -fsSL https://raw.githubusercontent.com/tzb0w0/komari/main/build-from-source.sh | bash
```

升级已装好的服务：

```bash
curl -fsSLO https://raw.githubusercontent.com/tzb0w0/komari/main/build-from-source.sh
sudo bash build-from-source.sh --upgrade
```

> 面板生成的「一键安装探针」命令来自本仓库的 `src/pages/admin/servers/installCommand.ts`，
> 本分支已将其指向 `tzb0w0/komari-agent`，因此面板给出的命令安装的是带新功能的定制探针。

---

## 二、单独开发 / 构建

```bash
npm ci          # 或 npm install
npm run dev     # 本地开发，默认 http://localhost:5173
npm run build   # 产物输出到 dist/
```

后端地址默认 `http://127.0.0.1:25774`，可用环境变量覆盖：

```bash
VITE_API_TARGET=http://your-panel:25774 npm run dev
```

构建完成后，若要手动打包给服务端：

```bash
tar -cf /tmp/dist.tar -C dist .
zstd -19 -T0 -f /tmp/dist.tar -o ../komari/web/public/defaultTheme/dist.tar.zst
cp komari-theme.json ../komari/web/public/defaultTheme/
```

---

## 三、本分支的改动

| 文件 | 改动 |
|---|---|
| `src/components/LineQualityPanel.tsx`（新增） | 线路徽章 + 重传测试区组件 |
| `src/components/Node.tsx` | 引入并渲染 `LineQualityPanel` |
| `src/contexts/NodeListContext.tsx` | 新增 `line_info` 字段与 `parseLineInfo()` 解析器 |
| `src/contexts/LiveDataContext.tsx` | 实时数据中接入 `retransmit` 映射与变更比较 |
| `src/types/LiveData.tsx` | 新增 `retransmit` 类型 |
| `src/pages/admin/servers/installCommand.ts` | 一键命令脚本地址指向本分支探针 |
| `src/i18n/locales/zh_CN.json`、`en.json` | 新增 `lineQuality` 词条 |

数据来源：线路来自 `common:getNodes` 的 `line_info`；重传来自 `common:getNodesLatestStatus` 的 `retransmit`。

---

## 四、翻译

欢迎直接提 PR。本分支对文案的改动仅新增 `lineQuality` 一组词条，其余沿用上游。
注意：仓库内有 i18n 同步工作流，启用时会重排 locale 文件的 key 顺序（本分支已禁用该工作流）。

---

## 五、许可证

MIT，见 [LICENSE](./LICENSE)。上游版权归 Komari Moniter 所有。
