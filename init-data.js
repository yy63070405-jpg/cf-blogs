// 初始化数据脚本
export async function initData(env) {
  // 初始化分类
  const categories = [
    {
      id: "1",
      name: "技术",
      slug: "tech",
      description: "技术文章",
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "生活",
      slug: "life",
      description: "生活随笔",
      createdAt: "2024-01-01T00:00:00Z"
    }
  ];
  
  // 初始化文章
  const posts = [
    {
      id: "1",
      title: "欢迎使用天聊博客",
      slug: "welcome",
      content: `这是一篇示例文章，支持 **Markdown** 格式。

## 特性

- ⚡ 极速响应 - 部署在 Cloudflare 全球边缘网络
- 🆓 完全免费 - 使用 Cloudflare Workers 免费额度
- 🔒 安全可靠 - 内置 HMAC 认证机制
- 📝 Markdown 支持 - 文章支持 Markdown 格式
- 📱 响应式设计 - 适配各种设备

## 开始使用

1. 访问管理后台：/admin
2. 默认账号：admin / admin123
3. 创建新文章，开始你的博客之旅！

## 代码示例

\`\`\`javascript
console.log("Hello, Cloudflare Workers!");
\`\`\`

祝你使用愉快！`,
      category: "tech",
      tags: ["intro", "welcome"],
      status: "published",
      views: 0,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z"
    }
  ];
  
  await env.BLOG_KV.put('categories', JSON.stringify(categories));
  await env.BLOG_KV.put('posts', JSON.stringify(posts));
  
  return { success: true, message: '数据初始化完成' };
}
