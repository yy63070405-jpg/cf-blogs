# 零门槛！手把手教你用 Cloudflare 搭建免费高速节点

你是否在为找不到好用的网络节点而烦恼？

你是否想要一个稳定、快速、免费的网络访问工具？

今天给大家分享一个利用 **Cloudflare** 搭建免费节点的教程，让你轻松实现网络自由！

---

## 为什么选择 Cloudflare？

Cloudflare 是全球最大的 CDN 服务商之一，提供免费额度，非常适合搭建个人使用的网络节点。

### 优势

- 🌐 **全球加速**：全球 330+ 数据中心，覆盖面广
- ⚡ **高速稳定**：边缘计算，延迟低速度快
- 💰 **完全免费**：免费额度足够个人使用
- 🔒 **安全可靠**：企业级安全防护
- 🚀 **一键部署**：无需复杂配置

---

## 准备工作

在开始之前，你需要准备以下内容：

1. **Cloudflare 账号**：访问 https://cloudflare.com 用邮箱免费注册
2. **一个 GitHub 账号**：用于部署开源项目
3. **代理客户端**：如 Clash、V2RayN、Surge 等

---

## 部署步骤

### 方法一：使用 Cloudflare Workers 部署

#### 第一步：创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **Workers 和 Pages**
3. 点击 **创建应用程序**
4. 选择 **创建 Worker**
5. 给 Worker 命名（如：`my-proxy`）
6. 点击 **部署**

#### 第二步：配置代码

在 Worker 编辑器中，删除默认代码，粘贴以下代理代码：

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/') {
      return new Response('代理服务运行中', { 
        status: 200,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
    }
    
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      return new Response('请提供目标URL: /?url=目标地址', { 
        status: 400 
      });
    }
    
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key !== 'Host' && key !== 'CF-Connecting-IP') {
        headers.set(key, value);
      }
    });
    
    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: headers,
        body: request.body
      });
      
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    } catch (err) {
      return new Response('代理请求失败: ' + err.message, { 
        status: 500 
      });
    }
  }
};
```

点击 **保存并部署**。

#### 第三步：使用代理

访问：`https://你的-worker.workers.dev/?url=目标网址`

---

### 方法二：使用 GitHub 项目一键部署

这里推荐几个热门开源项目：

#### 推荐项目

1. **workers-proxy** - 轻量级代理
2. **CloudflareProxy** - 功能完善
3. **v2ray-workers** - V2Ray 协议支持

#### 部署步骤（以 workers-proxy 为例）

1. 访问 GitHub 项目页面
2. 点击 **Fork** 到自己的仓库
3. 在 Cloudflare 创建 Workers
4. 导入 GitHub 仓库
5. 自动部署完成

---

## 配置客户端

### 获取节点信息

部署完成后，你需要获取节点链接：

- **直连链接**：`https://你的-worker.workers.dev`
- **代理格式**：`https://你的-worker.workers.dev/你的目标地址`

### 客户端配置

#### V2RayN 配置

1. 打开 V2RayN
2. 右键 → 添加 VMess / VLESS 节点
3. 地址：填写你的 Worker 域名
4. 端口：443
5. 传输协议：ws（WebSocket）
6. 路径：填写项目指定的路径

#### Clash 配置

```yaml
proxies:
  - name: "Cloudflare代理"
    type: ss
    server: 你的worker域名
    port: 443
    cipher: aes-256-gcm
    password: 你的密码
```

---

## 进阶优化

### 1. 绑定自定义域名

1. 在 Cloudflare 添加你的域名
2. 创建 Worker 的路由
3. 配置自定义域名访问

### 2. 优化速度

- 选择距离你最近的 Cloudflare 节点
- 启用 HTTP/3 支持
- 开启 Brotli 压缩

### 3. 增强稳定性

- 避免大量数据传输
- 合理设置超时时间
- 定期更换节点

---

## 注意事项

⚠️ **免责声明**：本文仅供技术学习交流，请勿用于非法用途。使用前请了解当地法律法规。

### 建议

- 免费节点适合轻度使用
- 不要超过免费额度限制
- 敏感操作建议使用正规付费服务
- 保护好你的节点链接

---

## 总结

通过 Cloudflare 搭建免费节点，是一个性价比很高的选择：

- ✅ **零成本**：免费额度完全够用
- ✅ **速度快**：全球 CDN 加速
- ✅ **稳定可靠**：企业级基础设施
- ✅ **易于维护**：无需服务器管理

希望这个教程对你有帮助！如果有任何问题，欢迎在评论区留言讨论。

---

**推荐指数**：⭐⭐⭐⭐⭐

**适用人群**：技术爱好者、开发者、学习研究
