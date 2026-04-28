# 天聊博客 - Cloudflare Workers 版

一个基于 Cloudflare Workers 和 KV 存储的无服务器博客系统。

## 特性

- ⚡ **极速响应** - 部署在 Cloudflare 全球边缘网络
- 🆓 **完全免费** - 使用 Cloudflare Workers 免费额度
- 🔒 **安全可靠** - 内置 HMAC 认证机制
- 📝 **Markdown 支持** - 文章支持 Markdown 格式
- 📱 **响应式设计** - 适配各种设备
- 🔍 **搜索功能** - 支持文章搜索
- 🏷️ **分类标签** - 文章分类和标签管理

## 项目结构

```
cf-blog/
├── src/
│   ├── index.js      # Worker 入口
│   ├── router.js     # 路由系统
│   ├── models.js     # 数据模型
│   └── templates.js  # HTML 模板
├── wrangler.toml     # Cloudflare 配置
├── package.json
└── README.md
```

## 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 登录 Cloudflare

```bash
npx wrangler login
```

### 3. 创建 KV 命名空间

```bash
npx wrangler kv:namespace create "BLOG_KV"
npx wrangler kv:namespace create "BLOG_KV" --preview
```

将返回的 id 和 preview_id 填入 `wrangler.toml`。

### 4. 设置管理员密码

```bash
npx wrangler secret put ADMIN_PASSWORD
```

输入你的管理员密码。

### 5. 本地开发

```bash
npm run dev
```

### 6. 部署到生产环境

```bash
npm run deploy
```

## 初始数据

首次使用前，需要创建一些初始数据：

### 创建分类

```bash
# 使用 wrangler CLI 添加分类数据
npx wrangler kv:key put --binding=BLOG_KV "categories" '[
  {"id":"1","name":"技术","slug":"tech","description":"技术文章","createdAt":"2024-01-01T00:00:00Z"},
  {"id":"2","name":"生活","slug":"life","description":"生活随笔","createdAt":"2024-01-01T00:00:00Z"}
]'
```

### 创建示例文章

```bash
npx wrangler kv:key put --binding=BLOG_KV "posts" '[
  {
    "id":"1",
    "title":"欢迎使用天聊博客",
    "slug":"welcome",
    "content":"这是一篇示例文章，支持 **Markdown** 格式。\\n\\n## 特性\\n\\n- 快速\\n- 免费\\n- 易用",
    "category":"tech",
    "tags":["intro","welcome"],
    "status":"published",
    "views":0,
    "createdAt":"2024-01-01T00:00:00Z",
    "updatedAt":"2024-01-01T00:00:00Z"
  }
]'
```

## 配置说明

编辑 `wrangler.toml` 文件：

```toml
name = "your-blog-name"  # Worker 名称

[[kv_namespaces]]
binding = "BLOG_KV"
id = "your_kv_id"           # 生产环境 KV ID
preview_id = "your_preview_id"  # 预览环境 KV ID

[vars]
SITE_TITLE = "你的博客名称"
SITE_DESCRIPTION = "博客描述"
ADMIN_USERNAME = "admin"    # 管理员用户名
```

## 使用说明

### 前台访问

- 首页：`https://your-worker.your-subdomain.workers.dev/`
- 文章页：`/post/文章slug`
- 分类页：`/category/分类slug`
- 标签页：`/tag/标签slug`
- 搜索：`/search?q=关键词`

### 管理后台

- 登录：`/admin/login`
- 管理首页：`/admin`
- 新建文章：`/admin/post/new`
- 分类管理：`/admin/categories`

默认管理员账号：
- 用户名：`admin`（可在 wrangler.toml 中修改）
- 密码：通过 `wrangler secret put` 设置

## 自定义域名（可选）

1. 在 Cloudflare Dashboard 中添加你的域名
2. 在 Workers & Pages 中选择你的 Worker
3. 点击 "Triggers" → "Custom Domains"
4. 添加你的域名或子域名

## 注意事项

1. **KV 存储限制**：免费版每天有 100,000 次读取限制
2. **数据备份**：定期导出 KV 数据备份
3. **图片存储**：建议使用 Cloudflare R2 或外部图床
4. **缓存策略**：可以配置 Cloudflare Cache Rules 优化性能

## 技术栈

- Cloudflare Workers
- Cloudflare KV
- Vanilla JavaScript (ES Modules)
- 原生 Web Crypto API

## License

MIT
