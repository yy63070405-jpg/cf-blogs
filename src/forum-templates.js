// 交流频道模板

// 交流频道基础模板
const forumBaseTemplate = (title, content, env, extraStyles = '', categories = []) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${env.SITE_TITLE || '天聊博客'}</title>
  <meta name="description" content="${env.SITE_DESCRIPTION || '一个基于 Cloudflare Workers 的博客'}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
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
      --shadow-hover: 0 4px 16px rgba(0,0,0,0.12);
      --radius: 8px;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: var(--text-primary);
      background: var(--bg-primary);
    }
    
    /* 导航栏 */
    header {
      background: var(--secondary-color);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    header .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    
    /* 主内容 */
    .main-wrapper {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px 20px;
    }
    
    /* 论坛头部 */
    .forum-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 40px;
      border-radius: var(--radius);
      margin-bottom: 24px;
      text-align: center;
    }
    
    .forum-header h1 {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .forum-header p {
      opacity: 0.9;
      font-size: 16px;
    }
    
    .forum-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-top: 24px;
    }
    
    .forum-stat {
      text-align: center;
    }
    
    .forum-stat-value {
      font-size: 28px;
      font-weight: 700;
    }
    
    .forum-stat-label {
      font-size: 14px;
      opacity: 0.8;
    }
    
    /* 发帖按钮 */
    .new-topic-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: var(--accent-color);
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      margin-bottom: 20px;
      transition: all 0.3s;
    }
    
    .new-topic-btn:hover {
      background: #d63d56;
      transform: translateY(-2px);
    }
    
    /* 话题列表 */
    .topic-list {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .topic-item {
      display: flex;
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
      transition: background 0.3s;
    }
    
    .topic-item:hover {
      background: #f8f9fa;
    }
    
    .topic-item:last-child {
      border-bottom: none;
    }
    
    .topic-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      flex-shrink: 0;
      margin-right: 16px;
    }
    
    .topic-content {
      flex: 1;
      min-width: 0;
    }
    
    .topic-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .topic-title a {
      color: var(--text-primary);
      text-decoration: none;
    }
    
    .topic-title a:hover {
      color: var(--accent-color);
    }
    
    .topic-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      color: var(--text-light);
    }
    
    .topic-stats {
      display: flex;
      gap: 20px;
      margin-left: auto;
      padding-left: 20px;
    }
    
    .topic-stat {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--text-light);
    }
    
    /* 话题详情 */
    .topic-detail {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    
    .topic-main {
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .topic-header {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .topic-body {
      line-height: 1.8;
      color: var(--text-secondary);
    }
    
    .topic-body p {
      margin-bottom: 12px;
    }
    
    .topic-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }
    
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .action-btn:hover {
      background: var(--accent-color);
      color: #fff;
      border-color: var(--accent-color);
    }
    
    /* 回复列表 */
    .replies-section {
      padding: 24px;
    }
    
    .replies-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--accent-color);
    }
    
    .reply-item {
      display: flex;
      gap: 16px;
      padding: 20px 0;
      border-bottom: 1px solid var(--border-color);
    }
    
    .reply-item:last-child {
      border-bottom: none;
    }
    
    .reply-content {
      flex: 1;
    }
    
    .reply-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .reply-author {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .reply-time {
      font-size: 13px;
      color: var(--text-light);
    }
    
    .reply-body {
      color: var(--text-secondary);
      line-height: 1.8;
    }
    
    /* 回复表单 */
    .reply-form {
      margin-top: 24px;
      padding: 24px;
      background: var(--bg-primary);
      border-radius: var(--radius);
    }
    
    .reply-form h3 {
      margin-bottom: 16px;
      font-size: 16px;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--accent-color);
    }
    
    textarea.form-control {
      min-height: 120px;
      resize: vertical;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: var(--accent-color);
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn:hover {
      background: #d63d56;
    }
    
    .btn-secondary {
      background: var(--secondary-color);
    }
    
    .btn-secondary:hover {
      background: var(--primary-color);
    }
    
    /* 发帖表单 */
    .new-topic-form {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 32px;
    }
    
    .new-topic-form h2 {
      margin-bottom: 24px;
      font-size: 20px;
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
    
    /* 页脚 */
    footer {
      background: var(--primary-color);
      color: rgba(255,255,255,0.7);
      text-align: center;
      padding: 24px;
      margin-top: 40px;
    }
    
    ${extraStyles}
  </style>
</head>
<body>
  <header>
    <div class="container">
      <a href="/" class="logo">
        <span>💬</span>
        <span>${env.SITE_TITLE || '天聊博客'}</span>
      </a>
      <nav>
        <ul class="nav-menu">
          <li><a href="/">首页</a></li>
          <li><a href="/forum" class="active">交流</a></li>
          ${categories.map(cat => `<li><a href="/category/${cat.slug}">${cat.name}</a></li>`).join('')}
        </ul>
      </nav>
    </div>
  </header>
  
  <div class="main-wrapper">
    ${content}
  </div>
  
  <footer>
    <p>${env.SITE_FOOTER || '© 2024 天聊博客. All rights reserved.'}</p>
  </footer>
</body>
</html>
`;

// 渲染论坛首页
export function renderForumHome(topics, totalCount, env, page = 1, categories = []) {
  const topicsHtml = topics.length > 0 
    ? topics.map(topic => `
      <div class="topic-item">
        <div class="topic-avatar">${topic.nickname.charAt(0).toUpperCase()}</div>
        <div class="topic-content">
          <h3 class="topic-title">
            <a href="/forum/topic/${topic.id}">${escapeHtml(topic.title)}</a>
          </h3>
          <div class="topic-meta">
            <span>👤 ${escapeHtml(topic.nickname)}</span>
            <span>📅 ${formatTime(topic.createdAt)}</span>
          </div>
        </div>
        <div class="topic-stats">
          <span class="topic-stat">👁️ ${topic.views || 0}</span>
          <span class="topic-stat">💬 ${topic.replies || 0}</span>
          <span class="topic-stat">👍 ${topic.likes || 0}</span>
        </div>
      </div>
    `).join('')
    : `
      <div class="empty-state">
        <div class="empty-state-icon">💬</div>
        <h3>还没有话题</h3>
        <p>来做第一个发帖的人吧！</p>
      </div>
    `;
  
  const content = `
    <div class="forum-header">
      <h1>💬 交流频道</h1>
      <p>在这里分享你的想法，与其他人交流讨论</p>
      <div class="forum-stats">
        <div class="forum-stat">
          <div class="forum-stat-value">${totalCount}</div>
          <div class="forum-stat-label">话题</div>
        </div>
      </div>
    </div>
    
    <a href="/forum/new" class="new-topic-btn">
      <span>✏️</span>
      <span>发布新话题</span>
    </a>
    
    <div class="topic-list">
      ${topicsHtml}
    </div>
    
    ${page > 1 || topics.length === 20 ? `
      <div style="margin-top: 24px; text-align: center;">
        ${page > 1 ? `<a href="/forum?page=${page - 1}" class="btn btn-secondary">上一页</a>` : ''}
        ${topics.length === 20 ? `<a href="/forum?page=${page + 1}" class="btn btn-secondary" style="margin-left: 12px;">下一页</a>` : ''}
      </div>
    ` : ''}
  `;
  
  return forumBaseTemplate('交流频道', content, env, '', categories);
}

// 渲染话题详情
export function renderTopicDetail(topic, replies, env, categories = []) {
  const repliesHtml = replies.length > 0 
    ? replies.map((reply, index) => `
      <div class="reply-item" id="reply-${reply.id}">
        <div class="topic-avatar" style="width: 40px; height: 40px; font-size: 14px;">${reply.nickname.charAt(0).toUpperCase()}</div>
        <div class="reply-content">
          <div class="reply-header">
            <span class="reply-author">${escapeHtml(reply.nickname)}</span>
            <span class="reply-time">${formatTime(reply.createdAt)}</span>
            <span style="margin-left: auto; font-size: 12px; color: var(--text-light);">#${index + 1}</span>
          </div>
          <div class="reply-body">${escapeHtml(reply.content).replace(/\n/g, '<br>')}</div>
          <div style="margin-top: 8px;">
            <button class="action-btn" onclick="likeReply('${reply.id}')" style="padding: 4px 10px; font-size: 12px;">
              👍 <span id="reply-likes-${reply.id}">${reply.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    `).join('')
    : '<p style="text-align: center; color: var(--text-light); padding: 20px;">暂无回复，快来抢沙发吧！</p>';
  
  const content = `
    <div class="topic-detail">
      <div class="topic-main">
        <div class="topic-header">
          <div class="topic-avatar" style="width: 56px; height: 56px; font-size: 20px;">${topic.nickname.charAt(0).toUpperCase()}</div>
          <div>
            <h1 style="font-size: 22px; margin-bottom: 8px;">${escapeHtml(topic.title)}</h1>
            <div class="topic-meta">
              <span>👤 ${escapeHtml(topic.nickname)}</span>
              <span>📅 ${new Date(topic.createdAt).toLocaleString('zh-CN')}</span>
              <span>👁️ ${topic.views || 0} 浏览</span>
            </div>
          </div>
        </div>
        <div class="topic-body">
          ${escapeHtml(topic.content).replace(/\n/g, '<br>')}
        </div>
        <div class="topic-actions">
          <button class="action-btn" onclick="likeTopic('${topic.id}')">
            👍 点赞 <span id="topic-likes">${topic.likes || 0}</span>
          </button>
          <a href="#reply-form" class="action-btn">💬 回复</a>
          <a href="/forum" class="action-btn">← 返回列表</a>
        </div>
      </div>
      
      <div class="replies-section">
        <h3 class="replies-title">💬 回复 (${replies.length})</h3>
        <div class="replies-list">
          ${repliesHtml}
        </div>
        
        <div class="reply-form" id="reply-form">
          <h3>✏️ 发表回复</h3>
          <form onsubmit="submitReply(event, '${topic.id}')">
            <div class="form-group">
              <label>你的昵称</label>
              <input type="text" name="nickname" class="form-control" placeholder="怎么称呼你？" required maxlength="20">
            </div>
            <div class="form-group">
              <label>回复内容</label>
              <textarea name="content" class="form-control" placeholder="说点什么吧..." required maxlength="1000"></textarea>
            </div>
            <button type="submit" class="btn">发表回复</button>
          </form>
        </div>
      </div>
    </div>
    
    <script>
      async function likeTopic(topicId) {
        try {
          const res = await fetch('/api/topic/like/' + topicId, { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            document.getElementById('topic-likes').textContent = data.likes;
          }
        } catch (e) {
          console.error('点赞失败');
        }
      }
      
      async function likeReply(replyId) {
        try {
          const res = await fetch('/api/reply/like/' + replyId, { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            document.getElementById('reply-likes-' + replyId).textContent = data.likes;
          }
        } catch (e) {
          console.error('点赞失败');
        }
      }
      
      async function submitReply(e, topicId) {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button');
        btn.disabled = true;
        btn.textContent = '提交中...';
        
        try {
          const formData = new FormData(form);
          formData.append('topic_id', topicId);
          
          const res = await fetch('/api/reply', {
            method: 'POST',
            body: formData
          });
          
          const data = await res.json();
          if (data.success) {
            alert('回复成功！');
            location.reload();
          } else {
            alert(data.error || '回复失败');
          }
        } catch (e) {
          alert('提交失败，请重试');
        }
        
        btn.disabled = false;
        btn.textContent = '发表回复';
      }
    </script>
  `;
  
  return forumBaseTemplate(topic.title, content, env, '', categories);
}

// 渲染发帖表单
export function renderNewTopic(env, categories = []) {
  const content = `
    <div class="new-topic-form">
      <h2>✏️ 发布新话题</h2>
      <form onsubmit="submitTopic(event)">
        <div class="form-group">
          <label>你的昵称</label>
          <input type="text" name="nickname" class="form-control" placeholder="怎么称呼你？" required maxlength="20">
        </div>
        <div class="form-group">
          <label>话题标题</label>
          <input type="text" name="title" class="form-control" placeholder="简短描述你的话题" required maxlength="100">
        </div>
        <div class="form-group">
          <label>话题内容</label>
          <textarea name="content" class="form-control" placeholder="详细描述你想讨论的内容..." required maxlength="2000" rows="8"></textarea>
        </div>
        <div style="display: flex; gap: 12px;">
          <a href="/forum" class="btn btn-secondary">取消</a>
          <button type="submit" class="btn">发布话题</button>
        </div>
      </form>
    </div>
    
    <script>
      async function submitTopic(e) {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = '发布中...';
        
        try {
          const formData = new FormData(form);
          const res = await fetch('/api/topic', {
            method: 'POST',
            body: formData
          });
          
          const data = await res.json();
          if (data.success) {
            alert('发布成功！');
            window.location.href = '/forum/topic/' + data.topic.id;
          } else {
            alert(data.error || '发布失败');
          }
        } catch (e) {
          alert('提交失败，请重试');
        }
        
        btn.disabled = false;
        btn.textContent = '发布话题';
      }
    </script>
  `;
  
  return forumBaseTemplate('发布话题', content, env, '', categories);
}

// 辅助函数
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
