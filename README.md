# HALO MVP — 移动端 H5

跑通两个最短闭环：
1. 拍 / 选一张图 → 和小满聊 → 生成记忆卡 → 收进小满记忆簿
2. 打开 → 看记忆簿 / 卡片详情 → 再聊一件 / 回首页

## 快速开始

```bash
cp .env.example .env.local
# 在 .env.local 填入 OPENAI_API_KEY（仅服务端使用，永不暴露到前端）

npm install
npm run dev
# 打开 http://localhost:3000
```

如果没有配置 `OPENAI_API_KEY`：
- `/api/chat` 会自动 fallback 到温柔的兜底开场池（PRD §5.4）；
- `/api/generate-card` 会自动 fallback 到通用模板（PRD §7.2），仍能跑通全流程。

## 真机调试

在和电脑同网段的手机上访问 `http://<电脑局域网 IP>:3000`，比如：

```bash
ipconfig getifaddr en0
# 然后手机浏览器打开 http://192.168.x.x:3000
```

## 路由

| 路径 | 文件 | 说明 |
|------|------|------|
| `/` | `app/page.tsx` | 首页两入口 |
| `/capture` | `app/capture/page.tsx` | 拍 / 选图 + 本地压缩 |
| `/chat` | `app/chat/page.tsx` | 小满聊天，含语音 mock、`canGenerateCard` 规则 |
| `/card` | `app/card/page.tsx` | 卡片生成 + loading + 保存 |
| `/book` | `app/book/page.tsx` | 小满记忆簿列表 + 空状态 |
| `/book/[id]` | `app/book/[id]/page.tsx` | 卡片详情 + 删除 |
| `/api/chat` | `app/api/chat/route.ts` | 小满回复（含图片识别） |
| `/api/generate-card` | `app/api/generate-card/route.ts` | JSON 模式生成记忆卡 |

## 数据存储

- 卡片列表 → `localStorage`（key: `halo.cards.v1`）
- 当前聊天草稿 → `sessionStorage`（key: `halo.draft.v1`）
- 图片：MVP 直接放在 base64 data URL 里（已在前端压缩到长边 ≤ 1280px、JPEG 0.82）。生产环境再迁移到 IndexedDB / 对象存储。

## 安全

- `OPENAI_API_KEY` 仅在 Next.js 服务器路由读取，绝不出现在客户端 bundle。
- 图片以 data URL 发到服务端，再以 OpenAI vision input 形式上行；不留存。
