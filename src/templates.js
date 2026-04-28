// SEO 助手函数
function buildSeoMeta(title, description, url, image, type = 'website') {
  const siteName = '天聊博客';
  const fullTitle = title ? `${title} - ${siteName}` : siteName;
  const siteDesc = description || '一个基于 Cloudflare Workers 的博客系统，快速、免费、易用。';
  const siteUrl = url || 'https://www.tianliaos.com';
  const ogImage = image || '';
  
  return `
  <title>${fullTitle}</title>
  <meta name="description" content="${siteDesc}">
  <meta name="keywords" content="博客,技术,生活,Cloudflare,Workers">
  <meta name="author" content="天聊博客">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <link rel="canonical" href="${siteUrl}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${siteUrl}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${siteDesc}">
  <meta property="og:site_name" content="${siteName}">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${siteUrl}">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${siteDesc}">
  ${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ''}
  
  <!-- JSON-LD 结构化数据 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "${siteName}",
    "url": "${siteUrl}",
    "description": "${siteDesc}",
    "publisher": {
      "@type": "Organization",
      "name": "${siteName}"
    }
  }
  </script>
  `;
}

// HTML 模板基础结构 - 零度风格
const baseTemplate = (title, content, env, extraStyles = '', ads = {}, analyticsCode = '', seoData = {}, categories = []) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${buildSeoMeta(seoData.title, seoData.description, seoData.url, seoData.image, seoData.type)}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
  ${analyticsCode || ''}
  <style>
    :root {
      --primary-color: #1a1a2e;
      --secondary-color: #16213e;
      --accent-color: #e94560;
      --text-primary: #333;
      --text-secondary: #666;
      --text-light: #999;
      --bg-primary: #f8f9fa;
      --bg-secondary: #fff;
      --border-color: #e8e8e8;
      --shadow: 0 2px 8px rgba(0,0,0,0.08);
      --text-on-primary: #fff;
      --code-bg: #f5f5f5;
    }
    
    [data-theme="dark"] {
      --primary-color: #0f0f23;
      --secondary-color: #1a1a2e;
      --accent-color: #ff6b6b;
      --text-primary: #e0e0e0;
      --text-secondary: #b0b0b0;
      --text-light: #808080;
      --bg-primary: #0a0a0f;
      --bg-secondary: #12121a;
      --border-color: #2a2a3a;
      --shadow: 0 2px 8px rgba(0,0,0,0.3);
      --text-on-primary: #fff;
      --code-bg: #1e1e2e;
    }
    
    .theme-toggle {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.3s;
    }
    
    .theme-toggle:hover {
      background: rgba(255,255,255,0.1);
    }
      --shadow-hover: 0 4px 16px rgba(0,0,0,0.12);
      --radius: 8px;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: var(--text-primary);
      background: var(--bg-primary);
    }
    
    /* 顶部导航栏 - 深色风格 */
    .top-bar {
      background: var(--primary-color);
      color: #fff;
      padding: 8px 0;
      font-size: 13px;
    }
    
    .top-bar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .top-bar a {
      color: #fff;
      text-decoration: none;
      opacity: 0.9;
      transition: opacity 0.3s;
    }
    
    .top-bar a:hover {
      opacity: 1;
      color: var(--accent-color);
    }
    
    /* 主导航 */
    header {
      background: var(--secondary-color);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 60px;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      text-decoration: none;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .logo:hover {
      color: var(--accent-color);
    }
    
    .mobile-menu-btn {
      display: none;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      padding: 8px;
    }
    
    .nav-menu {
      display: flex;
      list-style: none;
      gap: 0;
    }
    
    .nav-menu a {
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      padding: 0 20px;
      height: 60px;
      display: flex;
      align-items: center;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.3s;
      border-bottom: 3px solid transparent;
    }
    
    .nav-menu a:hover,
    .nav-menu a.active {
      color: #fff;
      background: rgba(255,255,255,0.05);
      border-bottom-color: var(--accent-color);
    }
    
    /* 搜索框 */
    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 4px;
      transition: background 0.3s;
    }
    
    .search-box:hover {
      background: rgba(255,255,255,0.15);
    }
    
    .search-box input {
      background: transparent;
      border: none;
      padding: 6px 12px;
      color: #fff;
      width: 180px;
      font-size: 14px;
      outline: none;
    }
    
    .search-box input::placeholder {
      color: rgba(255,255,255,0.5);
    }
    
    .search-box button {
      background: var(--accent-color);
      border: none;
      color: #fff;
      padding: 6px 16px;
      border-radius: 16px;
      cursor: pointer;
      font-size: 13px;
      transition: background 0.3s;
    }
    
    .search-box button:hover {
      background: #d63d56;
    }
    
    /* 主内容区 */
    .main-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 20px;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;
    }
    
    /* 文章卡片 */
    .post-card {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: all 0.3s ease;
      margin-bottom: 20px;
      border: 1px solid var(--border-color);
    }
    
    .post-card:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }
    
    .post-card-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .post-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .post-card:hover .post-card-image img {
      transform: scale(1.05);
    }
    
    .post-card-content {
      padding: 20px;
    }
    
    .post-category {
      display: inline-block;
      background: var(--accent-color);
      color: #fff;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 12px;
    }
    
    .post-title {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    
    .post-title a {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.3s;
    }
    
    .post-title a:hover {
      color: var(--accent-color);
    }
    
    .post-excerpt {
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.8;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .post-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      color: var(--text-light);
      font-size: 13px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }
    
    .post-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    /* 侧边栏 */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .widget {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 20px;
      border: 1px solid var(--border-color);
    }
    
    .widget-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      padding-bottom: 12px;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--accent-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .related-posts-list {
      list-style: none;
    }
    
    .related-post-item {
      margin-bottom: 12px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;
    }
    
    .related-post-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .related-post-item a {
      display: flex;
      gap: 12px;
      text-decoration: none;
      color: inherit;
    }
    
    .related-post-item a:hover h4 {
      color: var(--accent-color);
    }
    
    .related-post-thumb {
      width: 60px;
      height: 60px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
    }
    
    .related-post-noimg {
      background: var(--accent-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .related-post-info {
      flex: 1;
      min-width: 0;
    }
    
    .related-post-info h4 {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      margin: 0 0 6px 0;
      color: var(--text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .related-post-date {
      font-size: 12px;
      color: var(--text-light);
    }
    
    .category-list {
      list-style: none;
    }
    
    .hot-posts-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .hot-post-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-color);
      gap: 10px;
    }
    
    .hot-post-item:last-child {
      border-bottom: none;
    }
    
    .hot-post-rank {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      background: var(--accent-color);
      color: white;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .hot-post-title {
      flex: 1;
      font-size: 14px;
      color: var(--text-primary);
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .hot-post-title:hover {
      color: var(--accent-color);
    }
    
    .hot-post-views {
      font-size: 12px;
      color: var(--text-light);
    }
    
    /* 分页样式 */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    
    .pagination a, .pagination span {
      display: inline-block;
      padding: 8px 14px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      text-decoration: none;
      color: var(--text-primary);
      background: var(--bg-secondary);
      transition: all 0.2s;
    }
    
    .pagination a:hover {
      background: var(--accent-color);
      color: white;
      border-color: var(--accent-color);
    }
    
    .pagination a.active {
      background: var(--accent-color);
      color: white;
      border-color: var(--accent-color);
    }
    
    .pagination .ellipsis {
      border: none;
      background: transparent;
    }
    
    .pagination .prev, .pagination .next {
      font-weight: 500;
      white-space: nowrap;
    }
    
    .pagination .prev::before {
      content: "‹ ";
    }
    
    .pagination .next::after {
      content: " ›";
    }
    
    .category-list li {
      border-bottom: 1px solid var(--border-color);
    }
    
    .category-list li:last-child {
      border-bottom: none;
    }
    
    .category-list a {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .category-list a:hover {
      color: var(--accent-color);
      padding-left: 8px;
    }
    
    .category-count {
      background: var(--bg-primary);
      color: var(--text-light);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
    }
    
    /* 标签云 */
    .tag-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .tag-cloud a {
      display: inline-block;
      padding: 6px 14px;
      background: var(--bg-primary);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 4px;
      font-size: 13px;
      transition: all 0.3s;
      border: 1px solid var(--border-color);
    }
    
    .tag-cloud a:hover {
      background: var(--accent-color);
      color: #fff;
      border-color: var(--accent-color);
    }
    
    /* 页脚 */
    footer {
      background: var(--primary-color);
      color: rgba(255,255,255,0.7);
      padding: 40px 0 20px;
      margin-top: 40px;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 30px;
    }
    
    .footer-section h3 {
      color: #fff;
      font-size: 16px;
      margin-bottom: 16px;
    }
    
    .footer-section p,
    .footer-section a {
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      font-size: 14px;
      line-height: 1.8;
    }
    
    .footer-section a:hover {
      color: var(--accent-color);
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
      font-size: 13px;
    }
    
    /* 按钮 */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: var(--accent-color);
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .btn:hover {
      background: #d63d56;
      transform: translateY(-1px);
    }
    
    .btn-secondary {
      background: var(--secondary-color);
    }
    
    .btn-secondary:hover {
      background: var(--primary-color);
    }
    
    /* 文章详情 */
    .post-detail {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 32px;
      border: 1px solid var(--border-color);
    }
    
    .post-header {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .post-header h1 {
      font-size: 28px;
      font-weight: 700;
      line-height: 1.4;
      margin-bottom: 16px;
    }
    
    .post-content {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-primary);
    }
    
    .post-content h2 {
      font-size: 22px;
      font-weight: 700;
      margin: 32px 0 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .post-content h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 24px 0 12px;
    }
    
    .post-content p {
      margin-bottom: 16px;
    }
    
    .post-content pre {
      background: #f4f4f4;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 16px 0;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    
    .post-content code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    
    .post-content ul,
    .post-content ol {
      margin: 16px 0;
      padding-left: 24px;
    }
    
    .post-content li {
      margin-bottom: 8px;
    }
    
    .post-content a {
      color: var(--accent-color);
      text-decoration: none;
    }
    
    .post-content a:hover {
      text-decoration: underline;
    }
    
    /* 空状态 */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-light);
    }
    
    .empty-state-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
    
    /* 分页 */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
    }
    
    .pagination a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      transition: all 0.3s;
    }
    
    .pagination a:hover,
    .pagination a.active {
      background: var(--accent-color);
      color: #fff;
      border-color: var(--accent-color);
    }
    
    /* 代码块样式 */
    .code-block {
      background: #1e1e1e;
      border-radius: 8px;
      margin: 16px 0;
      overflow: hidden;
    }
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      background: #2d2d2d;
      color: #888;
      font-size: 12px;
    }
    .copy-btn {
      background: #444;
      color: #fff;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .copy-btn:hover {
      background: #555;
    }
    .code-block pre {
      margin: 0;
      padding: 16px;
      overflow-x: auto;
      color: #d4d4d4;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
      line-height: 1.5;
    }
    .code-block code {
      background: transparent;
      padding: 0;
    }
    .inline-code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
      color: #e83e8c;
    }
    
    /* 评论区样式 */
    .comments-section {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      padding: 24px;
      margin-top: 32px;
      border: 1px solid var(--border-color);
    }
    
    .comments-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--accent-color);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .comment-form {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .comment-form .form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .comment-form input[type="text"] {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 14px;
    }
    
    .comment-form input:focus,
    .comment-form textarea:focus {
      outline: none;
      border-color: var(--accent-color);
    }
    
    .comment-form textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 14px;
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }
    
    .comment-form .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }
    
    .char-count {
      font-size: 12px;
      color: var(--text-light);
    }
    
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .comment-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: var(--bg-primary);
      border-radius: 8px;
    }
    
    .comment-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }
    
    .comment-body {
      flex: 1;
    }
    
    .comment-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .comment-nickname {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .comment-time {
      font-size: 12px;
      color: var(--text-light);
    }
    
    .comment-content {
      color: var(--text-secondary);
      line-height: 1.6;
      word-break: break-word;
    }
    
    .comment-actions {
      margin-top: 8px;
    }
    
    .like-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      font-size: 12px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .like-btn:hover {
      background: var(--accent-color);
      color: #fff;
      border-color: var(--accent-color);
    }
    
    /* 响应式 */
    @media (max-width: 768px) {
      * {
        max-width: 100%;
        box-sizing: border-box;
      }
      
      html, body {
        overflow-x: hidden;
        width: 100%;
      }
      
      .container {
        padding: 0 12px;
        width: 100%;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .main-content {
        width: 100%;
        overflow-x: hidden;
      }
      
      .sidebar {
        width: 100%;
      }
      
      .post-card {
        width: 100%;
      }
      
      .post-card-image {
        height: 150px;
      }
      
      .post-card-content {
        padding: 12px;
      }
      
      .post-title {
        font-size: 18px;
      }
      
      .post-excerpt {
        font-size: 14px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .post-meta {
        font-size: 12px;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .pagination {
        gap: 5px;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .pagination a, .pagination span {
        padding: 6px 10px;
        font-size: 14px;
      }
      
      .nav-menu {
        display: none;
      }
      
      .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        background: var(--bg-secondary);
        padding: 16px;
        box-shadow: var(--shadow);
        z-index: 100;
      }
      
      .nav-menu.active li {
        margin: 8px 0;
      }
      
      .mobile-menu-btn {
        display: block;
      }
      
      .search-box {
        display: none;
      }
      
      .footer-content {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .post-detail {
        padding: 16px;
      }
      
      .post-header h1 {
        font-size: 22px;
      }
      
      .post-content {
        font-size: 16px;
        line-height: 1.8;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .post-content img {
        max-width: 100%;
        height: auto;
      }
      
      .post-content pre {
        overflow-x: auto;
        font-size: 13px;
      }
      
      .widget {
        margin: 16px 0;
      }
      
      .hot-posts-list li {
        padding: 8px 0;
      }
      
      .header {
        padding: 12px;
      }
      
      .site-title {
        font-size: 18px;
      }
    }
    
    ${extraStyles}
  </style>
</head>
<body>
  <!-- 主导航 -->
  <header>
    <div class="container">
      <a href="/" class="logo">
        <span>📝</span>
        <span>${env.SITE_TITLE || '天聊博客'}</span>
      </a>
      
      <button class="mobile-menu-btn" onclick="toggleMobileMenu()">☰</button>
      
      <nav>
        <ul class="nav-menu" id="navMenu">
          <li><a href="/" class="active">首页</a></li>
          ${categories.map(cat => `<li><a href="/category/${cat.slug}">${cat.name}</a></li>`).join('')}
          <li><a href="/forum">交流频道</a></li>
        </ul>
      </nav>
      
      <form class="search-box" action="/search" method="GET">
        <input type="text" name="q" placeholder="搜索文章..." required>
        <button type="submit">搜索</button>
      </form>
      
      <button class="theme-toggle" onclick="toggleTheme()" title="切换主题">
        <span id="themeIcon">🌙</span>
      </button>
    </div>
  </header>
  
  <script>
    function toggleMobileMenu() {
      var menu = document.getElementById('navMenu');
      if (menu.style.display === 'block') {
        menu.style.display = 'none';
      } else {
        menu.style.display = 'block';
      }
    }
    
    function toggleTheme() {
      var html = document.documentElement;
      var icon = document.getElementById('themeIcon');
      if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        icon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        icon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
      }
    }
    
    (function() {
      var saved = localStorage.getItem('theme');
      if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.addEventListener('DOMContentLoaded', function() {
          var icon = document.getElementById('themeIcon');
          if (icon) icon.textContent = '☀️';
        });
      }
    })();
  </script>
  
  <!-- 主内容 -->
  <div class="main-wrapper">
    ${content}
  </div>
  
  <!-- 页脚 -->
  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h3>${env.SITE_TITLE || '天聊博客'}</h3>
        <p>${env.SITE_DESCRIPTION || '一个基于 Cloudflare Workers 的博客系统，快速、免费、易用。'}</p>
      </div>
      <div class="footer-section">
        <h3>快速链接</h3>
        <p><a href="/">首页</a></p>
        <p><a href="/category/tech">技术文章</a></p>
        <p><a href="/category/life">生活随笔</a></p>
        <p><a href="/forum">交流频道</a></p>
      </div>
      <div class="footer-section">
        <h3>联系方式</h3>
        <p>Powered by Cloudflare Workers</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>${env.SITE_FOOTER || '© ' + new Date().getFullYear() + ' 天聊博客. All rights reserved.'}</p>
    </div>
  </footer>
</body>
</html>
`;

// 渲染首页
export function renderHome(posts, categories, env, subtitle = '', ads = {}) {
  const { sidebarAds = [], headerAds = [], footerAds = [], analyticsCode = '', hotPosts = [], pagination = null } = ads;
  
  // 渲染广告位
  const renderAdWidget = (adsList, title) => {
    if (!adsList || adsList.length === 0) return '';
    return `
      <div class="widget ad-widget">
        <h3 class="widget-title">
          <span>📢</span>
          <span>${title}</span>
        </h3>
        <div class="ad-content">
          ${adsList.sort((a, b) => (a.order || 0) - (b.order || 0)).map(ad => `
            <div class="ad-item">${ad.code}</div>
          `).join('')}
        </div>
      </div>
    `;
  };
  
  const postsHtml = posts.length > 0 
    ? posts.map(post => `
      <article class="post-card">
        ${post.coverImage ? `
          <div class="post-card-image">
            <img src="${post.coverImage}" alt="${post.title}" onerror="this.parentElement.style.display='none'">
          </div>
        ` : ''}
        <div class="post-card-content">
          ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
          <h2 class="post-title">
            <a href="/post/${post.slug}">${post.title}</a>
          </h2>
          <p class="post-excerpt">
            ${post.content.substring(0, 150).replace(/[#*`\[\]!]/g, '').trim()}...
          </p>
          <div class="post-meta">
            <span>📅 ${new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
            <span>👁️ ${post.views || 0} 阅读</span>
            <span>🏷️ ${post.tags ? post.tags.slice(0, 3).join(', ') : '无标签'}</span>
          </div>
        </div>
      </article>
    `).join('')
    : `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>暂无文章</h3>
        <p>还没有发布任何文章，去管理后台创建一篇吧！</p>
      </div>
    `;
  
  // 分页 HTML
  let paginationHtml = '';
  if (pagination && pagination.totalPages > 1) {
    const { page, totalPages } = pagination;
    let pagesHtml = '';
    
    // 生成页码
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
        pagesHtml += `<a href="/?page=${i}" class="${i === page ? 'active' : ''}">${i}</a>`;
      } else if (i === page - 3 || i === page + 3) {
        pagesHtml += `<span class="ellipsis">...</span>`;
      }
    }
    
    paginationHtml = `
      <div class="pagination">
        ${page > 1 ? `<a href="/?page=${page - 1}" class="prev"></a>` : ''}
        ${pagesHtml}
        ${page < totalPages ? `<a href="/?page=${page + 1}" class="next"></a>` : ''}
      </div>
    `;
  }
  
  const categoriesHtml = categories.map(cat => `
    <li>
      <a href="/category/${cat.slug}">
        <span>${cat.name}</span>
        <span class="category-count">${cat.count || 0}</span>
      </a>
    </li>
  `).join('');
  
  // 提取所有标签
  const allTags = posts.flatMap(p => p.tags || []);
  const uniqueTags = [...new Set(allTags)].slice(0, 20);
  const tagsHtml = uniqueTags.map(tag => `
    <a href="/tag/${tag}">${tag}</a>
  `).join('');
  
  const content = `
    ${headerAds.length > 0 ? `
      <div class="header-ads" style="margin-bottom: 24px;">
        ${headerAds.sort((a, b) => (a.order || 0) - (b.order || 0)).map(ad => ad.code).join('')}
      </div>
    ` : ''}
    
    <div class="content-grid">
      <div class="main-content">
        <div style="margin-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: 700; color: var(--text-primary);">
            ${subtitle || '最新文章'}
          </h1>
        </div>
        ${postsHtml}
        ${paginationHtml}
      </div>
      
      <aside class="sidebar">
        ${renderAdWidget(sidebarAds, '赞助商')}
        
        ${hotPosts.length > 0 ? `
        <div class="widget">
          <h3 class="widget-title">
            <span>🔥</span>
            <span>热门文章</span>
          </h3>
          <ul class="hot-posts-list">
            ${hotPosts.map((post, index) => `
              <li class="hot-post-item">
                <span class="hot-post-rank">${index + 1}</span>
                <a href="/post/${post.slug || post.id}" class="hot-post-title">${post.title}</a>
                <span class="hot-post-views">${post.views || 0} 阅读</span>
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
        
        <div class="widget">
          <h3 class="widget-title">
            <span>👋</span>
            <span>关于本站</span>
          </h3>
          <div style="font-size: 14px; line-height: 1.8; color: var(--text-secondary);">
            <p>欢迎来到天聊博客！</p>
            <p>分享科技前沿、技术教程和互联网趣闻。</p>
            <p>关注我，一起探索AI时代！</p>
          </div>
        </div>
        
        <div class="widget">
          <h3 class="widget-title">
            <span>📱</span>
            <span>关注我们</span>
          </h3>
          <div style="text-align: center;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: white; margin-bottom: 12px;">
              <div style="font-size: 32px; margin-bottom: 8px;">🦞</div>
              <div style="font-weight: 500;">天聊博客</div>
              <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">AI · 科技 · 教程</div>
            </div>
            <div style="display: flex; gap: 8px; justify-content: center;">
              <a href="https://www.tianliaos.com/forum" style="flex: 1; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; text-align: center; font-size: 13px; color: var(--text-primary); text-decoration: none;">论坛</a>
              <a href="https://www.tianliaos.com/sitemap.xml" style="flex: 1; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; text-align: center; font-size: 13px; color: var(--text-primary); text-decoration: none;">网站地图</a>
            </div>
          </div>
        </div>
        
        <div class="widget">
          <h3 class="widget-title">
            <span>📁</span>
            <span>分类目录</span>
          </h3>
          <ul class="category-list">
            ${categoriesHtml || '<li style="padding: 12px 0; color: var(--text-light);">暂无分类</li>'}
          </ul>
        </div>
        
        <div class="widget">
          <h3 class="widget-title">
            <span>🏷️</span>
            <span>热门标签</span>
          </h3>
          <div class="tag-cloud">
            ${tagsHtml || '<span style="color: var(--text-light);">暂无标签</span>'}
          </div>
        </div>
        
        <div class="widget">
          <h3 class="widget-title">
            <span>📅</span>
            <span>文章归档</span>
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
              <a href="/?page=1" style="color: var(--text-primary); text-decoration: none; display: flex; justify-content: space-between;">
                <span>2026年3月</span>
                <span style="color: var(--text-light); font-size: 13px;">查看</span>
              </a>
            </li>
            <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">
              <a href="/?page=1" style="color: var(--text-primary); text-decoration: none; display: flex; justify-content: space-between;">
                <span>所有文章</span>
                <span style="color: var(--text-light); font-size: 13px;">查看</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
    
    ${footerAds.length > 0 ? `
      <div class="footer-ads" style="margin-top: 24px; padding: 20px; background: var(--bg-secondary); border-radius: var(--radius);">
        ${footerAds.sort((a, b) => (a.order || 0) - (b.order || 0)).map(ad => ad.code).join('')}
      </div>
    ` : ''}
  `;
  
  const siteUrl = 'https://www.tianliaos.com';
  return baseTemplate(subtitle || '首页', content, env, '', ads, analyticsCode, {
    title: subtitle || '首页',
    description: '天聊博客 - 分享技术文章和生活随笔',
    url: siteUrl,
    type: 'website'
  }, categories);
}

// 渲染文章详情页
export function renderPost(post, categories, env, ads = {}, relatedPosts = []) {
  const { sidebarAds = [], articleTopAds = [], articleBottomAds = [], analyticsCode = '', comments = [] } = ads;
  
  const renderAdBlock = (adsList) => {
    if (!adsList || adsList.length === 0) return '';
    return `
      <div class="ad-block" style="margin: 20px 0; text-align: center;">
        ${adsList.sort((a, b) => (a.order || 0) - (b.order || 0)).map(ad => ad.code).join('')}
      </div>
    `;
  };
  
  // 渲染视频播放器
  const renderVideo = (url) => {
    if (!url) return '';
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
      if (videoId) {
        return `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 20px 0; border-radius: 8px;">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
            src="https://www.youtube.com/embed/${videoId}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen></iframe>
        </div>`;
      }
    }
    
    // Bilibili
    if (url.includes('bilibili.com')) {
      const bvid = url.match(/bilibili\.com\/video\/(BV[^\/\?]+)/)?.[1];
      if (bvid) {
        return `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 20px 0; border-radius: 8px;">
          <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
            src="https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1" 
            frameborder="0" 
            allowfullscreen></iframe>
        </div>`;
      }
    }
    
    // 直接视频链接
    return `<div class="video-container" style="margin: 20px 0; border-radius: 8px; overflow: hidden;">
      <video controls style="width: 100%; max-height: 500px;">
        <source src="${url}" type="video/mp4">
        您的浏览器不支持视频播放
      </video>
    </div>`;
  };
  
  // 渲染评论区
  const renderComments = () => {
    const commentsHtml = comments.length > 0 ? comments.map(c => `
      <div class="comment-item" id="comment-${c.id}">
        <div class="comment-avatar">${c.nickname.charAt(0).toUpperCase()}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-nickname">${escapeHtml(c.nickname)}</span>
            <span class="comment-time">${formatTime(c.createdAt)}</span>
          </div>
          <div class="comment-content">${escapeHtml(c.content)}</div>
          <div class="comment-actions">
            <button class="like-btn" onclick="likeComment('${c.id}')">
              <span>👍</span>
              <span class="like-count">${c.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    `).join('') : '<p style="color: var(--text-light); text-align: center; padding: 20px;">暂无评论，快来抢沙发吧！</p>';
    
    return `
      <div class="comments-section">
        <h3 class="comments-title">
          <span>💬</span>
          <span>评论区 (${comments.length})</span>
        </h3>
        
        <div class="comment-form">
          <form id="commentForm" onsubmit="submitComment(event, '${post.id}')">
            <div class="form-row">
              <input type="text" name="nickname" id="commentNickname" placeholder="您的昵称" required maxlength="20" style="flex: 1;">
            </div>
            <textarea name="content" id="commentContent" placeholder="说点什么吧... (每天最多5条评论)" required maxlength="500" rows="3"></textarea>
            <div class="form-footer">
              <span class="char-count"><span id="charCount">0</span>/500</span>
              <button type="submit" class="btn">发表评论</button>
            </div>
          </form>
        </div>
        
        <div class="comments-list">
          ${commentsHtml}
        </div>
      </div>
      
      <script>
        // 字数统计
        document.getElementById('commentContent').addEventListener('input', function() {
          document.getElementById('charCount').textContent = this.value.length;
        });
        
        // 提交评论
        async function submitComment(e, postId) {
          e.preventDefault();
          const form = e.target;
          const nickname = form.nickname.value.trim();
          const content = form.content.value.trim();
          
          if (!nickname || !content) {
            alert('请填写昵称和评论内容');
            return;
          }
          
          const btn = form.querySelector('button[type="submit"]');
          btn.disabled = true;
          btn.textContent = '提交中...';
          
          try {
            const formData = new FormData();
            formData.append('post_id', postId);
            formData.append('nickname', nickname);
            formData.append('content', content);
            
            const res = await fetch('/api/comment', {
              method: 'POST',
              body: formData
            });
            
            const data = await res.json();
            
            if (data.error) {
              alert(data.error);
            } else {
              alert('评论成功！');
              location.reload();
            }
          } catch (err) {
            alert('评论失败，请稍后重试');
          }
          
          btn.disabled = false;
          btn.textContent = '发表评论';
        }
        
        // 点赞评论
        async function likeComment(commentId) {
          try {
            const res = await fetch('/api/comment/like/' + commentId, {
              method: 'POST'
            });
            const data = await res.json();
        
        // 复制代码
        function copyCode(id) {
          var codeEl = document.getElementById(id);
          if (codeEl) {
            var code = codeEl.textContent;
            navigator.clipboard.writeText(code).then(function() {
              var btn = codeEl.parentElement.previousElementSibling.querySelector('.copy-btn');
              var originalText = btn.textContent;
              btn.textContent = '已复制!';
              setTimeout(function() { btn.textContent = originalText; }, 2000);
            });
          }
        }
            
            if (data.success) {
              const countEl = document.querySelector('#comment-' + commentId + ' .like-count');
              if (countEl) {
                countEl.textContent = data.likes;
              }
            } else if (data.message) {
              // 静默处理已点赞的情况
            }
          } catch (err) {
            console.error('点赞失败');
          }
        }
      </script>
    `;
  };
  
  const content = `
    <div class="content-grid">
      <div class="main-content">
        <article class="post-detail">
          <div class="post-header">
            ${post.category ? `<span class="post-category">${post.category}</span>` : ''}
            <h1>${post.title}</h1>
            <div class="post-meta" style="border: none; padding: 0; margin-top: 16px;">
              <span>📅 ${new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
              <span>👁️ ${post.views || 0} 阅读</span>
              <span>✏️ ${new Date(post.updatedAt).toLocaleDateString('zh-CN')} 更新</span>
            </div>
          </div>
          
          ${post.coverImage ? `
            <div class="post-cover" style="margin: 20px 0; border-radius: 8px; overflow: hidden;">
              <img src="${post.coverImage}" alt="${post.title}" style="width: 100%; display: block;">
            </div>
          ` : ''}
          
          ${renderVideo(post.videoUrl)}
          
          ${renderAdBlock(articleTopAds)}
          
          <div class="post-content">
            ${insertAdAfterParagraph(renderMarkdown(post.content))}
          </div>
          
          ${renderAdBlock(articleBottomAds)}
          
          ${post.tags && post.tags.length > 0 ? `
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color);">
              <strong style="color: var(--text-secondary);">标签：</strong>
              <div class="tag-cloud" style="display: inline-flex; margin-left: 8px;">
                ${post.tags.map(tag => `<a href="/tag/${tag}">${tag}</a>`).join('')}
              </div>
            </div>
          ` : ''}
        </article>
        
        ${renderComments()}
      </div>
      
      <aside class="sidebar">
        ${sidebarAds.length > 0 ? `
          <div class="widget ad-widget">
            <h3 class="widget-title">
              <span>📢</span>
              <span>赞助商</span>
            </h3>
            <div class="ad-content">
              ${sidebarAds.sort((a, b) => (a.order || 0) - (b.order || 0)).map(ad => `
                <div class="ad-item">${ad.code}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="widget">
          <h3 class="widget-title">
            <span>📁</span>
            <span>分类目录</span>
          </h3>
          <ul class="category-list">
            ${categories.map(cat => `
              <li>
                <a href="/category/${cat.slug}">
                  <span>${cat.name}</span>
                  <span class="category-count">${cat.count || 0}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="widget">
          <h3 class="widget-title">
            <span>🔥</span>
            <span>相关文章</span>
          </h3>
          ${relatedPosts.length > 0 ? `
            <ul class="related-posts-list">
              ${relatedPosts.map(p => `
                <li class="related-post-item">
                  <a href="/post/${p.slug || p.id}">
                    ${p.coverImage ? `<img src="${p.coverImage}" alt="${p.title}" class="related-post-thumb">` : '<div class="related-post-thumb related-post-noimg">📝</div>'}
                    <div class="related-post-info">
                      <h4>${p.title}</h4>
                      <span class="related-post-date">${new Date(p.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </a>
                </li>
              `).join('')}
            </ul>
          ` : '<p style="color: var(--text-light); font-size: 14px;">暂无相关文章</p>'}
        </div>
      </aside>
    </div>
  `;
  
  const siteUrl = 'https://www.tianliaos.com';
  const postDesc = post.content ? post.content.substring(0, 150).replace(/[#*`\n]/g, '') + '...' : '天聊博客文章';
  return baseTemplate(post.title, content, env, '', ads, analyticsCode, {
    title: post.title,
    description: postDesc,
    url: `${siteUrl}/post/${post.slug || post.id}`,
    image: post.coverImage || '',
    type: 'article'
  }, categories);
}

// 渲染登录页
export function renderLogin(env, error = '', adminPrefix = '/admin') {
  const extraStyles = `
    .login-page {
      min-height: 100vh;
      display: flex;
      background: #f8f9fa;
    }
    
    .login-left {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .login-left::before {
      content: '';
      position: absolute;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
      animation: pulse 15s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: translate(-25%, -25%) scale(1); }
      50% { transform: translate(-25%, -25%) scale(1.1); }
    }
    
    .login-illustration {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
      padding: 40px;
    }
    
    .login-illustration h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .login-illustration p {
      font-size: 18px;
      opacity: 0.9;
    }
    
    .geometric-characters {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 40px;
    }
    
    .geo-char {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      animation: float 3s ease-in-out infinite;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .geo-char:nth-child(1) {
      background: #ff6b35;
      animation-delay: 0s;
    }
    
    .geo-char:nth-child(2) {
      background: #7c3aed;
      animation-delay: 0.5s;
      border-radius: 50%;
    }
    
    .geo-char:nth-child(3) {
      background: #1a1a2e;
      animation-delay: 1s;
      transform: rotate(45deg);
    }
    
    .geo-char:nth-child(3) span {
      transform: rotate(-45deg);
    }
    
    .geo-char:nth-child(4) {
      background: #feca57;
      animation-delay: 1.5s;
      border-radius: 12px;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    
    .geo-char:nth-child(3) {
      animation-name: floatRotate;
    }
    
    @keyframes floatRotate {
      0%, 100% { transform: translateY(0) rotate(45deg); }
      50% { transform: translateY(-15px) rotate(45deg); }
    }
    
    .login-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: white;
    }
    
    .login-form-container {
      width: 100%;
      max-width: 400px;
    }
    
    .login-form-header {
      margin-bottom: 40px;
    }
    
    .login-form-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    
    .login-form-header p {
      color: #6b7280;
      font-size: 16px;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .form-input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-input-group label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
    
    .form-input-group input {
      padding: 14px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: #f9fafb;
    }
    
    .form-input-group input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }
    
    .form-input-group input::placeholder {
      color: #9ca3af;
    }
    
    .login-btn {
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 8px;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }
    
    .login-btn:active {
      transform: translateY(0);
    }
    
    .divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 8px 0;
    }
    
    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }
    
    .divider span {
      color: #9ca3af;
      font-size: 14px;
    }
    
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 14px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .google-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
    
    .google-icon {
      width: 20px;
      height: 20px;
    }
    
    .error-message {
      background: #fef2f2;
      color: #dc2626;
      padding: 14px 16px;
      border-radius: 12px;
      font-size: 14px;
      border: 1px solid #fecaca;
      margin-bottom: 8px;
    }
    
    .login-footer {
      text-align: center;
      margin-top: 32px;
      color: #6b7280;
      font-size: 14px;
    }
    
    .login-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    
    .login-footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 900px) {
      .login-left {
        display: none;
      }
      
      .login-right {
        padding: 20px;
      }
    }
  `;
  
  const content = `
    <div class="login-page">
      <div class="login-left">
        <div class="login-illustration">
          <div class="geometric-characters">
            <div class="geo-char">😊</div>
            <div class="geo-char">🚀</div>
            <div class="geo-char"><span>✨</span></div>
            <div class="geo-char">💡</div>
          </div>
          <h2>天聊博客</h2>
          <p>记录生活，分享技术</p>
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-form-container">
          <div class="login-form-header">
            <h1>Welcome back!</h1>
            <p>请登录您的管理员账号</p>
          </div>
          
          ${error ? `<div class="error-message">${error}</div>` : ''}
          
          <form method="POST" action="${adminPrefix}/login" class="login-form">
            <div class="form-input-group">
              <label for="username">用户名</label>
              <input type="text" id="username" name="username" placeholder="请输入用户名" required autofocus>
            </div>
            
            <div class="form-input-group">
              <label for="password">密码</label>
              <input type="password" id="password" name="password" placeholder="请输入密码" required>
            </div>
            
            <button type="submit" class="login-btn">登 录</button>
          </form>
          
          <div class="divider">
            <span>或者</span>
          </div>
          
          <button type="button" class="google-btn" onclick="alert('暂未开放第三方登录')">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Log in with Google
          </button>
          
          <div class="login-footer">
            <p>Powered by <a href="/">天聊博客</a></p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return baseTemplate('管理登录', content, env, extraStyles, {}, '', {}, []);
}

// 渲染管理后台
export function renderAdmin(posts, env, adminPrefix = '/admin') {
  const extraStyles = `
    .admin-wrapper {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 24px;
      border: 1px solid var(--border-color);
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .admin-header h1 {
      font-size: 20px;
      font-weight: 700;
    }
    .admin-actions {
      display: flex;
      gap: 12px;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }
    .admin-table th,
    .admin-table td {
      padding: 14px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }
    .admin-table th {
      background: var(--bg-primary);
      font-weight: 600;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .admin-table tr:hover {
      background: var(--bg-primary);
    }
    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-published {
      background: #e6f7e6;
      color: #52c41a;
    }
    .status-draft {
      background: #fff7e6;
      color: #fa8c16;
    }
    .action-btns {
      display: flex;
      gap: 8px;
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }
  `;
  
  const postsHtml = posts.map(post => `
    <tr>
      <td>
        <strong>${post.title}</strong>
      </td>
      <td>${post.category || '-'}</td>
      <td>
        <span class="status-badge status-${post.status}">
          ${post.status === 'published' ? '已发布' : '草稿'}
        </span>
      </td>
      <td>${new Date(post.createdAt).toLocaleDateString('zh-CN')}</td>
      <td>${post.views || 0}</td>
      <td>
        <div class="action-btns">
          <a href="/post/${post.slug}" target="_blank" class="btn btn-sm btn-secondary">查看</a>
          <a href="${adminPrefix}/post/edit/${post.id}" class="btn btn-sm">编辑</a>
          <form method="POST" action="${adminPrefix}/post/delete/${post.id}" style="display:inline;" onsubmit="return confirm('确定要删除这篇文章吗？')">
            <button type="submit" class="btn btn-sm" style="background: #ff4d4f;">删除</button>
          </form>
        </div>
      </td>
    </tr>
  `).join('');
  
  const content = `
    <div class="admin-wrapper">
      <div class="admin-header">
        <h1>📊 文章管理</h1>
        <div class="admin-actions">
          <a href="${adminPrefix}/categories" class="btn btn-secondary">分类管理</a>
          <a href="${adminPrefix}/post/new" class="btn">+ 新建文章</a>
          <a href="${adminPrefix}/logout" class="btn btn-secondary">退出登录</a>
        </div>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>标题</th>
            <th>分类</th>
            <th>状态</th>
            <th>创建时间</th>
            <th>阅读量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${postsHtml || '<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:40px;">暂无文章，点击"新建文章"创建第一篇吧！</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
  
  return baseTemplate('管理后台', content, env, extraStyles, {}, '', {}, []);
}

// 渲染新建/编辑文章页面
export function renderNewPost(categories, env, adminPrefix = '/admin') {
  return renderPostForm(null, categories, env, adminPrefix);
}

export function renderEditPost(post, categories, env, adminPrefix = '/admin') {
  return renderPostForm(post, categories, env, adminPrefix);
}

function renderPostForm(post, categories, env, adminPrefix = '/admin') {
  const isEdit = !!post;
  const extraStyles = `
    .editor-wrapper {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 32px;
      border: 1px solid var(--border-color);
    }
    .editor-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .editor-header h1 {
      font-size: 22px;
      font-weight: 700;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 15px;
      font-family: inherit;
      transition: border-color 0.3s;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--accent-color);
    }
    .form-group textarea {
      min-height: 400px;
      resize: vertical;
      line-height: 1.8;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }
  `;
  
  const categoriesHtml = categories.map(cat => `
    <option value="${cat.slug}" ${post?.category === cat.slug ? 'selected' : ''}>${cat.name}</option>
  `).join('');
  
  const content = `
    <div class="editor-wrapper">
      <div class="editor-header">
        <h1>${isEdit ? '✏️ 编辑文章' : '📝 新建文章'}</h1>
      </div>
      <form method="POST" action="${isEdit ? `${adminPrefix}/post/edit/${post.id}` : `${adminPrefix}/post/new`}">
        <div class="form-group">
          <label>文章标题</label>
          <input type="text" name="title" value="${post?.title || ''}" placeholder="请输入文章标题" required>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>分类</label>
            <select name="category">
              <option value="">选择分类</option>
              ${categoriesHtml}
            </select>
          </div>
          <div class="form-group">
            <label>状态</label>
            <select name="status">
              <option value="draft" ${post?.status === 'draft' ? 'selected' : ''}>草稿</option>
              <option value="published" ${post?.status === 'published' ? 'selected' : ''}>发布</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>封面图片 URL</label>
            <input type="text" name="coverImage" value="${post?.coverImage || ''}" placeholder="https://example.com/image.jpg">
          </div>
          <div class="form-group">
            <label>视频链接 (YouTube/Bilibili/直链)</label>
            <input type="text" name="videoUrl" value="${post?.videoUrl || ''}" placeholder="https://www.youtube.com/watch?v=xxx">
          </div>
        </div>
        
        <div class="form-group">
          <label>标签</label>
          <input type="text" name="tags" value="${post?.tags ? post.tags.join(', ') : ''}" placeholder="多个标签用逗号分隔，如：技术,教程,Cloudflare">
        </div>
        
        <div class="form-group">
          <label>文章内容（支持 Markdown）</label>
          <textarea name="content" placeholder="请输入文章内容...">${post?.content || ''}</textarea>
        </div>
        
        <div class="form-actions">
          <a href="${adminPrefix}" class="btn btn-secondary">取消</a>
          <button type="submit" class="btn">${isEdit ? '更新文章' : '发布文章'}</button>
        </div>
      </form>
    </div>
  `;
  
  return baseTemplate(isEdit ? '编辑文章' : '新建文章', content, env, extraStyles, {}, '', {}, []);
}

// 渲染分类管理页面
export function renderCategories(categories, env, adminPrefix = '/admin') {
  const extraStyles = `
    .admin-wrapper {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 24px;
      border: 1px solid var(--border-color);
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    .category-form {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
      padding: 20px;
      background: var(--bg-primary);
      border-radius: 4px;
    }
    .category-form input {
      padding: 10px 14px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 14px;
    }
    .category-form input:focus {
      outline: none;
      border-color: var(--accent-color);
    }
  `;
  
  const categoriesHtml = categories.map(cat => `
    <tr>
      <td><strong>${cat.name}</strong></td>
      <td><code style="background: var(--bg-primary); padding: 4px 8px; border-radius: 4px;">${cat.slug}</code></td>
      <td>${cat.description || '-'}</td>
      <td>
        <form method="POST" action="${adminPrefix}/category/delete/${cat.id}" style="display:inline;" onsubmit="return confirm('确定要删除这个分类吗？')">
          <button type="submit" class="btn btn-sm" style="background: #ff4d4f;">删除</button>
        </form>
      </td>
    </tr>
  `).join('');
  
  const content = `
    <div class="admin-wrapper">
      <div class="admin-header">
        <h1>📁 分类管理</h1>
        <div>
          <a href="${adminPrefix}" class="btn btn-secondary">返回</a>
          <a href="${adminPrefix}/logout" class="btn btn-secondary">退出</a>
        </div>
      </div>
      
      <form method="POST" action="${adminPrefix}/category/new" class="category-form">
        <input type="text" name="name" placeholder="分类名称" required style="flex:1;">
        <input type="text" name="slug" placeholder="URL标识（可选）" style="flex:1;">
        <input type="text" name="description" placeholder="描述（可选）" style="flex:2;">
        <button type="submit" class="btn">添加分类</button>
      </form>
      
      <table class="admin-table" style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background: var(--bg-primary);">
            <th style="padding:14px; text-align:left; border-bottom:1px solid var(--border-color);">名称</th>
            <th style="padding:14px; text-align:left; border-bottom:1px solid var(--border-color);">标识</th>
            <th style="padding:14px; text-align:left; border-bottom:1px solid var(--border-color);">描述</th>
            <th style="padding:14px; text-align:left; border-bottom:1px solid var(--border-color);">操作</th>
          </tr>
        </thead>
        <tbody>
          ${categoriesHtml || '<tr><td colspan="4" style="text-align:center;color:var(--text-light);padding:40px;">暂无分类</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
  
  return baseTemplate('分类管理', content, env, extraStyles, {}, '', {}, []);
}

// 渲染标签页面（占位）
export function renderTags(tags, env) {
  return renderHome([], [], env, '标签');
}

// 在文章第二段后插入广告
function insertAdAfterParagraph(content) {
  const adCode = `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4953994726882790"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4953994726882790"
     data-ad-slot="9691157021"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;
  
  // 在第二段后插入广告
  const paragraphs = content.split('</p>');
  if (paragraphs.length >= 3) {
    paragraphs.splice(2, 0, `<div style="margin: 20px 0; text-align: center;">${adCode}</div>`);
    return paragraphs.join('</p>');
  }
  
  return content;
}

// Markdown 渲染器
function renderMarkdown(content) {
  if (!content) return '';
  
  let codeIndex = 0;
  
  let html = content
    .replace(/```(\w*)\r?\n([\s\S]*?)```/g, function(match, lang, code) {
      const id = 'code-' + (codeIndex++);
      const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
      return '<div class="code-block"><div class="code-header"><span>' + (lang || 'text') + '</span><button class="copy-btn" onclick="copyCode(\'' + id + '\')">复制</button></div><pre id="' + id + '"><code>' + escapedCode + '</code></pre></div>';
    })
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:4px;">')
    .replace(/^\s*[-*+]\s+(.+)$/gim, '<li>$1</li>')
    .replace(/^\s*\d+\.\s+(.+)$/gim, '<li>$1</li>')
    .replace(/^>\s*(.+)$/gim, '<blockquote style="border-left:4px solid var(--accent-color); padding-left:16px; margin:16px 0; color:var(--text-secondary);">$1</blockquote>')
    .replace(/^---+$/gim, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  return html;
}

// HTML 转义
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 格式化时间
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + ' 天前';
  
  return date.toLocaleDateString('zh-CN');
}
