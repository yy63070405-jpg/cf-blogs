# 基于Cloudflare Workers搭建免费博客系统，零服务器成本！

今天给大家介绍我开发的这个博客系统 —— **天聊博客**，一个完全基于 Cloudflare Workers 搭建的现代博客系统，零服务器成本，全球加速访问！

---

## 项目简介

天聊博客是一个基于 **Cloudflare Workers + KV + R2** 构建的全栈博客系统，无需购买服务器，无需担心运维，完全免费运行在 Cloudflare 的边缘网络上。

### 技术栈

- **运行时**：Cloudflare Workers
- **数据库**：Cloudflare KV（键值存储）
- **图床**：Cloudflare R2（对象存储）
- **前端**：原生 HTML/CSS/JavaScript
- **编辑器**：EasyMDE（Markdown 编辑器）

---

## 核心功能

### 前台功能

- **文章展示**：支持 Markdown 渲染，代码高亮
- **分类浏览**：按分类查看文章
- **标签系统**：文章标签聚合
- **搜索功能**：全文搜索文章
- **评论系统**：支持评论和点赞
- **相关文章**：智能推荐相关内容
- **响应式设计**：完美适配移动端

### 后台功能

- **文章管理**：新建、编辑、删除文章
- **分类管理**：管理文章分类
- **广告管理**：支持多种广告位
- **系统设置**：站点配置、统计代码
- **Markdown 编辑器**：支持图片上传、实时预览
- **图片上传**：集成 R2 图床

---

## 为什么选择 Cloudflare Workers？

### 1. 完全免费

Cloudflare Workers 提供免费套餐：
- 每天 100,000 次请求
- 10ms CPU 时间
- 无限带宽

对于个人博客来说完全够用！

### 2. 全球加速

Cloudflare 在全球有 300+ 边缘节点，你的博客会被自动部署到离用户最近的节点，访问速度极快。

### 3. 无需运维

不需要购买服务器、配置环境、担心安全更新，一切由 Cloudflare 托管。

### 4. 自定义域名

支持绑定自己的域名，并自动配置 HTTPS。

---

## 部署教程

### 前置要求

- Node.js 18+
- Cloudflare 账号
- Git

### 快速开始

**1. 克隆项目**

```bash
git clone https://github.com/yourname/tianliao-blog.git
cd tianliao-blog/cf-blog
npm install
```

**2. 登录 Cloudflare**

```bash
npx wrangler login
```

**3. 创建 KV 命名空间**

```bash
npx wrangler kv:namespace create BLOG_KV
```

**4. 创建 R2 存储桶**

在 Cloudflare Dashboard 创建 R2 存储桶，名称为 `img`

**5. 配置 wrangler.toml**

```toml
name = "tianliao-blog"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "BLOG_KV"
id = "your-kv-id"

[[r2_buckets]]
binding = "IMG_BUCKET"
bucket_name = "img"

[vars]
SITE_TITLE = "我的博客"
SITE_DESCRIPTION = "一个基于 Cloudflare Workers 的博客"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "your-password"
```

**6. 部署**

```bash
npx wrangler deploy
```

部署完成后，访问 `https://your-worker.your-subdomain.workers.dev` 即可看到博客！

---

## 项目结构

```
cf-blog/
├── src/
│   ├── index.js          # 主入口，路由和 API
│   ├── templates.js      # 前台模板
│   ├── admin-templates.js # 后台模板
│   └── models.js         # 数据模型
├── wrangler.toml         # Cloudflare 配置
└── package.json
```

---

## 特色功能详解

### Markdown 编辑器

后台集成了 **EasyMDE** 编辑器，支持：

- 工具栏快捷操作
- 实时预览
- 图片上传到 R2
- 代码高亮
- 全屏编辑

### 图片存储

使用 Cloudflare R2 存储图片：

- 免费额度：10GB 存储 + 每月 1000 万次读取
- 支持自定义域名
- 全球 CDN 加速

### SEO 优化

- 自动生成 sitemap.xml
- 自动生成 robots.txt
- Open Graph 标签
- 结构化数据

### 安全特性

- 后台路径隐藏
- Cookie 认证
- XSS 防护
- CSRF 防护

---

## 性能表现

经过测试，博客的加载速度非常快：

| 指标 | 数值 |
|------|------|
| 首屏加载 | < 500ms |
| TTFB | < 50ms |
| Lighthouse 评分 | 95+ |

---

## 成本分析

完全免费运行！

| 服务 | 免费额度 | 博客使用 |
|------|---------|---------|
| Workers | 10万次/天 | 足够 |
| KV | 1GB 存储 | 足够 |
| R2 | 10GB 存储 | 足够 |

---

## 后续计划

- [ ] 支持多用户
- [ ] 支持文章草稿自动保存
- [ ] 支持文章导入导出
- [ ] 支持主题切换
- [ ] 支持插件系统

---

## 总结

如果你想要：

- 零成本搭建个人博客
- 不想折腾服务器
- 追求极致访问速度
- 喜欢折腾技术

那么这个项目非常适合你！

---

## 项目地址

- **在线演示**：https://www.tianliaos.com
- **GitHub**：https://github.com/yourname/tianliao-blog

欢迎 Star 和 Fork！

---

**推荐指数**：⭐⭐⭐⭐⭐

如果你觉得这个项目有帮助，欢迎分享给更多人！
