// 后台管理模板 - 全新设计

// 后台基础模板
const adminBaseTemplate = (title, content, env, adminPrefix, extraStyles = '') => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 管理后台</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/css/all.min.css">
  <!-- EasyMDE -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css">
  <script src="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js"></script>
  <style>
    :root {
      --sidebar-width: 260px;
      --header-height: 60px;
      --primary: #4f46e5;
      --primary-dark: #4338ca;
      --secondary: #64748b;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --bg-dark: #1e293b;
      --bg-sidebar: #0f172a;
      --bg-content: #f1f5f9;
      --text-light: #f8fafc;
      --text-dark: #334155;
      --border: #e2e8f0;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Noto Sans SC', sans-serif;
      background: var(--bg-content);
      color: var(--text-dark);
    }
    
    /* 侧边栏 */
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--bg-sidebar);
      color: var(--text-light);
      overflow-y: auto;
      z-index: 1000;
    }
    
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .sidebar-header h1 {
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .sidebar-header p {
      font-size: 12px;
      opacity: 0.6;
      margin-top: 4px;
    }
    
    .nav-menu {
      list-style: none;
      padding: 16px 0;
    }
    
    .nav-item {
      margin: 4px 12px;
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.3s;
    }
    
    .nav-link:hover,
    .nav-link.active {
      background: var(--primary);
      color: #fff;
    }
    
    .nav-link i {
      width: 20px;
      text-align: center;
    }
    
    /* 主内容区 */
    .main-content {
      margin-left: var(--sidebar-width);
      min-height: 100vh;
    }
    
    /* 顶部栏 */
    .top-header {
      height: var(--header-height);
      background: #fff;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .mobile-menu-toggle {
      display: none;
      background: var(--primary);
      color: #fff;
      border: none;
      padding: 10px 15px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
    }
    
    .breadcrumb {
      font-size: 14px;
      color: var(--secondary);
    }
    
    .breadcrumb strong {
      color: var(--text-dark);
    }
    
    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      background: var(--bg-content);
      color: var(--secondary);
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .btn-icon:hover {
      background: var(--primary);
      color: #fff;
    }
    
    /* 内容区 */
    .content-wrapper {
      padding: 24px;
    }
    
    /* 统计卡片 */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .stat-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 12px;
    }
    
    .stat-card-icon.blue { background: #dbeafe; color: #2563eb; }
    .stat-card-icon.green { background: #d1fae5; color: #059669; }
    .stat-card-icon.orange { background: #ffedd5; color: #ea580c; }
    .stat-card-icon.purple { background: #f3e8ff; color: #9333ea; }
    
    .stat-card-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-dark);
    }
    
    .stat-card-label {
      font-size: 13px;
      color: var(--secondary);
      margin-top: 4px;
    }
    
    /* 卡片 */
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }
    
    .card-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .card-body {
      padding: 24px;
    }
    
    /* 按钮 */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
      text-decoration: none;
    }
    
    .btn-primary {
      background: var(--primary);
      color: #fff;
    }
    
    .btn-primary:hover {
      background: var(--primary-dark);
    }
    
    .btn-secondary {
      background: var(--bg-content);
      color: var(--text-dark);
    }
    
    .btn-secondary:hover {
      background: var(--border);
    }
    
    .btn-danger {
      background: #fee2e2;
      color: var(--danger);
    }
    
    .btn-danger:hover {
      background: var(--danger);
      color: #fff;
    }
    
    .btn-sm {
      padding: 6px 12px;
      font-size: 13px;
    }
    
    /* 表格 */
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .table th,
    .table td {
      padding: 14px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    
    .table th {
      background: var(--bg-content);
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      color: var(--secondary);
    }
    
    .table tr:hover {
      background: #f8fafc;
    }
    
    /* 表单 */
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    textarea.form-control {
      min-height: 120px;
      resize: vertical;
      font-family: monospace;
    }
    
    /* 状态标签 */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .badge-success {
      background: #d1fae5;
      color: #059669;
    }
    
    .badge-warning {
      background: #ffedd5;
      color: #ea580c;
    }
    
    .badge-secondary {
      background: #f1f5f9;
      color: var(--secondary);
    }
    
    /* 操作按钮组 */
    .action-btns {
      display: flex;
      gap: 8px;
    }
    
    /* 空状态 */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    
    .empty-state-icon {
      width: 80px;
      height: 80px;
      background: var(--bg-content);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 32px;
    }
    
    .empty-state h3 {
      font-size: 18px;
      color: var(--text-dark);
      margin-bottom: 8px;
    }
    
    .empty-state p {
      color: var(--secondary);
      margin-bottom: 20px;
    }
    
    /* 代码编辑器 */
    .code-editor {
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 13px;
      line-height: 1.6;
      background: #1e293b;
      color: #e2e8f0;
      padding: 16px;
      border-radius: 8px;
      min-height: 200px;
    }
    
    /* 响应式 */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        position: fixed;
        z-index: 1000;
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 0;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .mobile-menu-toggle {
        display: block;
        }
    }
    
    ${extraStyles}
  </style>
</head>
<body>
  <!-- 侧边栏 -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1><i class="fas fa-cog"></i> 管理后台</h1>
      <p>${env.SITE_TITLE || '天聊博客'}</p>
    </div>
    <ul class="nav-menu">
      <li class="nav-item">
        <a href="${adminPrefix}" class="nav-link ${title === '仪表盘' ? 'active' : ''}">
          <i class="fas fa-home"></i>
          <span>仪表盘</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="${adminPrefix}/posts" class="nav-link ${title.includes('文章') ? 'active' : ''}">
          <i class="fas fa-edit"></i>
          <span>文章管理</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="${adminPrefix}/categories" class="nav-link ${title.includes('分类') ? 'active' : ''}">
          <i class="fas fa-folder"></i>
          <span>分类管理</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="${adminPrefix}/ads" class="nav-link ${title.includes('广告') ? 'active' : ''}">
          <i class="fas fa-ad"></i>
          <span>广告管理</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="${adminPrefix}/settings" class="nav-link ${title.includes('设置') ? 'active' : ''}">
          <i class="fas fa-cog"></i>
          <span>系统设置</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="${adminPrefix}/logs" class="nav-link ${title.includes('日志') ? 'active' : ''}">
          <i class="fas fa-history"></i>
          <span>访问日志</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="${adminPrefix}/upload" class="nav-link ${title.includes('上传') ? 'active' : ''}">
          <i class="fas fa-image"></i>
          <span>图片上传</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/" class="nav-link" target="_blank">
          <i class="fas fa-external-link-alt"></i>
          <span>查看网站</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="${adminPrefix}/logout" class="nav-link">
          <i class="fas fa-sign-out-alt"></i>
          <span>退出登录</span>
        </a>
      </li>
    </ul>
  </aside>
  
  <!-- 主内容 -->
  <main class="main-content">
    <header class="top-header">
      <button class="mobile-menu-toggle" onclick="toggleSidebar()">☰</button>
      <div class="breadcrumb">
        <strong>${title}</strong>
      </div>
      <div class="user-menu">
        <button class="btn-icon" onclick="window.location.href='/'" title="查看网站">
          <i class="fas fa-globe"></i>
        </button>
        <button class="btn-icon" onclick="window.location.href='${adminPrefix}/logout'" title="退出">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </header>
    
    <div class="content-wrapper">
      ${content}
    </div>
  </main>
  
  <script>
    function toggleSidebar() {
      var sidebar = document.querySelector('.sidebar');
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      } else {
        sidebar.classList.add('open');
      }
    }
  </script>
</body>
</html>
`;

// 渲染仪表盘
export function renderDashboard(stats, env, adminPrefix) {
  const content = `
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-icon blue"><i class="fas fa-file-alt"></i></div>
        <div class="stat-card-value">${stats.posts || 0}</div>
        <div class="stat-card-label">文章总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon green"><i class="fas fa-eye"></i></div>
        <div class="stat-card-value">${stats.views || 0}</div>
        <div class="stat-card-label">总阅读量</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon orange"><i class="fas fa-folder"></i></div>
        <div class="stat-card-value">${stats.categories || 0}</div>
        <div class="stat-card-label">分类数量</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon purple"><i class="fas fa-ad"></i></div>
        <div class="stat-card-value">${stats.ads || 0}</div>
        <div class="stat-card-label">广告位</div>
      </div>
    </div>
    
    <!-- 快捷操作 -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-bolt"></i> 快捷操作</h3>
      </div>
      <div class="card-body">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="${adminPrefix}/post/new" class="btn btn-primary">
            <i class="fas fa-plus"></i> 新建文章
          </a>
          <a href="${adminPrefix}/ad/new" class="btn btn-secondary">
            <i class="fas fa-plus"></i> 添加广告
          </a>
          <a href="${adminPrefix}/categories" class="btn btn-secondary">
            <i class="fas fa-folder-plus"></i> 管理分类
          </a>
        </div>
      </div>
    </div>
  `;
  
  return adminBaseTemplate('仪表盘', content, env, adminPrefix);
}

// 渲染广告管理
export function renderAds(ads, env, adminPrefix) {
  const adsHtml = ads.map(ad => `
    <tr>
      <td><strong>${ad.name}</strong></td>
      <td><code>${ad.position}</code></td>
      <td>${ad.order || 0}</td>
      <td>
        <span class="badge ${ad.status === 'active' ? 'badge-success' : 'badge-secondary'}">
          <i class="fas fa-${ad.status === 'active' ? 'check' : 'pause'}"></i>
          ${ad.status === 'active' ? '启用' : '暂停'}
        </span>
      </td>
      <td>${new Date(ad.createdAt).toLocaleDateString('zh-CN')}</td>
      <td>
        <div class="action-btns">
          <a href="${adminPrefix}/ad/edit/${ad.id}" class="btn btn-sm btn-secondary">
            <i class="fas fa-edit"></i> 编辑
          </a>
          <form method="POST" action="${adminPrefix}/ad/delete/${ad.id}" style="display:inline;" onsubmit="return confirm('确定删除此广告？')">
            <button type="submit" class="btn btn-sm btn-danger">
              <i class="fas fa-trash"></i> 删除
            </button>
          </form>
        </div>
      </td>
    </tr>
  `).join('');
  
  const content = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-ad"></i> 广告管理</h3>
        <a href="${adminPrefix}/ad/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> 添加广告
        </a>
      </div>
      <div class="card-body" style="padding: 0;">
        ${ads.length > 0 ? `
          <table class="table">
            <thead>
              <tr>
                <th>广告名称</th>
                <th>位置</th>
                <th>排序</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>${adsHtml}</tbody>
          </table>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-ad"></i></div>
            <h3>暂无广告</h3>
            <p>点击右上角按钮添加广告代码</p>
          </div>
        `}
      </div>
    </div>
  `;
  
  return adminBaseTemplate('广告管理', content, env, adminPrefix);
}

// 渲染新建/编辑广告
export function renderNewAd(env, adminPrefix) {
  return renderAdForm(null, env, adminPrefix);
}

export function renderEditAd(ad, env, adminPrefix) {
  return renderAdForm(ad, env, adminPrefix);
}

function renderAdForm(ad, env, adminPrefix) {
  const isEdit = !!ad;
  const adId = ad ? ad.id : '';
  const adName = ad ? ad.name.replace(/"/g, '&quot;') : '';
  const adCode = ad ? ad.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
  const adStatus = ad ? ad.status : 'active';
  const adPosition = ad ? ad.position : 'sidebar';
  const adOrder = ad ? ad.order : '0';
  const content = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-${isEdit ? 'edit' : 'plus'}"></i> ${isEdit ? '编辑广告' : '添加广告'}</h3>
      </div>
      <div class="card-body">
        <form method="POST" action="${isEdit ? adminPrefix + '/ad/edit/' + adId : adminPrefix + '/ad/new'}">
          <div class="form-group">
            <label class="form-label">广告名称</label>
            <input type="text" name="name" class="form-control" value="${adName}" placeholder="如：侧边栏广告1" required>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
              <label class="form-label">广告位置</label>
              <select name="position" class="form-control">
                <option value="sidebar" ${adPosition === 'sidebar' ? 'selected' : ''}>侧边栏</option>
                <option value="header" ${adPosition === 'header' ? 'selected' : ''}>顶部横幅</option>
                <option value="footer" ${adPosition === 'footer' ? 'selected' : ''}>底部横幅</option>
                <option value="article_top" ${adPosition === 'article_top' ? 'selected' : ''}>文章顶部</option>
                <option value="article_bottom" ${adPosition === 'article_bottom' ? 'selected' : ''}>文章底部</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">排序</label>
              <input type="number" name="order" class="form-control" value="${adOrder}" placeholder="数字越小越靠前">
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">状态</label>
            <select name="status" class="form-control">
              <option value="active" ${adStatus === 'active' ? 'selected' : ''}>启用</option>
              <option value="inactive" ${adStatus === 'inactive' ? 'selected' : ''}>暂停</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">广告代码 (HTML/JS)</label>
            <textarea name="code" class="form-control code-editor" placeholder="粘贴广告代码，支持 HTML 和 JavaScript...">${adCode}</textarea>
            <small style="color: var(--secondary); margin-top: 6px; display: block;">
              <i class="fas fa-info-circle"></i> 支持 Google AdSense、百度联盟等广告代码
            </small>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <a href="${adminPrefix}/ads" class="btn btn-secondary">取消</a>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> ${isEdit ? '保存修改' : '添加广告'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  return adminBaseTemplate(isEdit ? '编辑广告' : '添加广告', content, env, adminPrefix);
}

// 渲染系统设置
export function renderSettings(settings, env, adminPrefix) {
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  };
  
  const content = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-chart-line"></i> 统计代码</h3>
      </div>
      <div class="card-body">
        <form method="POST" action="${adminPrefix}/settings/analytics">
          <div class="form-group">
            <label class="form-label">网站统计代码</label>
            <textarea name="analytics_code" class="form-control code-editor" placeholder="粘贴百度统计、Google Analytics 等统计代码...">${escapeHtml(settings.analytics_code)}</textarea>
            <small style="color: var(--secondary); margin-top: 6px; display: block;">
              <i class="fas fa-info-circle"></i> 代码将插入到所有页面的 &lt;/head&gt; 标签前
            </small>
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> 保存设置
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-cog"></i> 网站信息</h3>
      </div>
      <div class="card-body">
        <form method="POST" action="${adminPrefix}/settings/site">
          <div class="form-group">
            <label class="form-label">网站标题</label>
            <input type="text" name="site_title" class="form-control" value="${settings.site_title || env.SITE_TITLE || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">网站描述</label>
            <textarea name="site_description" class="form-control" rows="3">${settings.site_description || env.SITE_DESCRIPTION || ''}</textarea>
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> 保存设置
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-images"></i> 图床设置 (Cloudflare R2)</h3>
      </div>
      <div class="card-body">
        <form method="POST" action="${adminPrefix}/settings/imagehost">
          <div class="form-group">
            <label class="form-label">图片域名 (可选)</label>
            <input type="text" name="image_domain" class="form-control" value="${settings.image_domain || ''}" placeholder="例如: https://img.yourdomain.com">
            <small style="color: var(--secondary); margin-top: 6px; display: block;">
              <i class="fas fa-info-circle"></i> 绑定自定义域名后可填写，如未绑定则使用默认 /r2/ 路径
            </small>
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> 保存设置
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-key"></i> 修改密码</h3>
      </div>
      <div class="card-body">
        <form method="POST" action="${adminPrefix}/settings/password">
          <div class="form-group">
            <label class="form-label">当前密码</label>
            <input type="password" name="current_password" class="form-control" placeholder="请输入当前密码" required>
          </div>
          <div class="form-group">
            <label class="form-label">新密码</label>
            <input type="password" name="new_password" class="form-control" placeholder="请输入新密码" required minlength="6">
            <small style="color: var(--secondary); margin-top: 6px; display: block;">
              <i class="fas fa-info-circle"></i> 密码长度至少6位
            </small>
          </div>
          <div class="form-group">
            <label class="form-label">确认新密码</label>
            <input type="password" name="confirm_password" class="form-control" placeholder="请再次输入新密码" required>
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-key"></i> 修改密码
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-sitemap"></i> 站点地图</h3>
      </div>
      <div class="card-body">
        <p style="margin-bottom: 16px;">站点地图用于告知搜索引擎网站的所有页面，有助于 SEO 优化。</p>
        <div style="background: var(--bg-content); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <p style="font-size: 14px; color: var(--secondary); margin-bottom: 8px;">站点地图地址：</p>
          <code style="background: var(--border); padding: 8px 12px; border-radius: 4px; display: block; word-break: break-all;">https://www.tianliaos.com/sitemap.xml</code>
        </div>
        <div style="background: var(--bg-content); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <p style="font-size: 14px; color: var(--secondary); margin-bottom: 8px;">robots.txt 地址：</p>
          <code style="background: var(--border); padding: 8px 12px; border-radius: 4px; display: block; word-break: break-all;">https://www.tianliaos.com/robots.txt</code>
        </div>
        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 16px;">
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">提交到搜索引擎：</p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="https://search.google.com/search-console" target="_blank" class="btn btn-secondary">
              <i class="fab fa-google"></i> Google Search Console
            </a>
            <a href="https://ziyuan.baidu.com/linksubmit/url" target="_blank" class="btn btn-secondary">
              <i class="fas fa-search"></i> 百度站长平台
            </a>
            <a href="https://www.bing.com/webmasters" target="_blank" class="btn btn-secondary">
              <i class="fab fa-microsoft"></i> Bing Webmaster
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return adminBaseTemplate('系统设置', content, env, adminPrefix);
}

// 渲染访问日志页面
export function renderVisitLogs(logs, stats, env, adminPrefix, page = 1) {
  const logsHtml = logs.map(log => `
    <tr>
      <td><code style="font-size: 12px;">${log.path}</code></td>
      <td>
        ${log.isBot ?
          `<span class="badge badge-info"><i class="fas fa-robot"></i> ${log.botName || 'Bot'}</span>` :
          `<span class="badge badge-success">用户</span>`
        }
      </td>
      <td>${log.ip}</td>
      <td>${log.country || '-'}</td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${log.userAgent}">
        ${(log.userAgent || '').substring(0, 50)}${(log.userAgent || '').length > 50 ? '...' : ''}
      </td>
      <td>${new Date(log.timestamp).toLocaleString('zh-CN')}</td>
    </tr>
  `).join('');

  const dailyDataJson = JSON.stringify(stats.dailyData || []);
  const maxPv = Math.max(...(stats.dailyData || []).map(d => d.pv || 0), 1);

  const pathStatsHtml = (stats.pathStats || []).map(([path, count]) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
      <code style="font-size: 12px;">${path}</code>
      <span class="badge badge-secondary">${count}</span>
    </div>
  `).join('');

  const osStatsHtml = (stats.osStats || []).map(([os, count]) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
      <span>${os}</span>
      <span class="badge badge-secondary">${count}</span>
    </div>
  `).join('');

  const searchSourceStatsHtml = (stats.searchSourceStats || []).map(([source, count]) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
      <span>${source}</span>
      <span class="badge badge-secondary">${count}</span>
    </div>
  `).join('');

  const keywordStatsHtml = (stats.keywordStats || []).map(([keyword, count]) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
      <span style="font-size: 13px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${keyword}">${keyword}</span>
      <span class="badge badge-secondary">${count}</span>
    </div>
  `).join('');

  const refererStatsHtml = (stats.refererStats || []).map(([source, count]) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
      <span style="font-size: 13px;">${source}</span>
      <span class="badge badge-secondary">${count}</span>
    </div>
  `).join('');

  const countryStatsHtml = (stats.countryStats || []).map(([country, count]) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
      <span>${country || '未知'}</span>
      <span class="badge badge-secondary">${count}</span>
    </div>
  `).join('');

  const botStatsHtml = (stats.botStats || []).map(([name, count]) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border);">
      <span>${name}</span>
      <span class="badge badge-secondary">${count}</span>
    </div>
  `).join('');

  const content = `
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 24px;">
      <div class="card" style="padding: 20px; text-align: center;">
        <div style="font-size: 32px; font-weight: 700; color: var(--primary);">${stats.total}</div>
        <div style="color: var(--secondary); margin-top: 8px;">总访问量</div>
      </div>
      <div class="card" style="padding: 20px; text-align: center;">
        <div style="font-size: 32px; font-weight: 700; color: #28a745;">${stats.today}</div>
        <div style="color: var(--secondary); margin-top: 8px;">今日访问</div>
      </div>
      <div class="card" style="padding: 20px; text-align: center;">
        <div style="font-size: 32px; font-weight: 700; color: #17a2b8;">${stats.uv}</div>
        <div style="color: var(--secondary); margin-top: 8px;">今日UV</div>
      </div>
      <div class="card" style="padding: 20px; text-align: center;">
        <div style="font-size: 32px; font-weight: 700; color: #ffc107;">${stats.online}</div>
        <div style="color: var(--secondary); margin-top: 8px;">在线人数</div>
      </div>
      <div class="card" style="padding: 20px; text-align: center;">
        <div style="font-size: 32px; font-weight: 700; color: #17a2b8;">${stats.humans}</div>
        <div style="color: var(--secondary); margin-top: 8px;">真实用户</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-chart-line"></i> 近7天访问趋势</h3>
      </div>
      <div class="card-body" style="padding: 20px;">
        <div id="dailyChart" style="height: 200px; display: flex; align-items: flex-end; gap: 8px; padding: 10px 0;">
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--secondary);">
          <span>日期</span>
          <span>PV</span>
          <span>UV</span>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px;">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-desktop"></i> 操作系统</h3>
        </div>
        <div class="card-body" style="padding: 16px; max-height: 300px; overflow-y: auto;">
          ${osStatsHtml || '<p style="color: var(--secondary); text-align: center;">暂无数据</p>'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-search"></i> 搜索来源</h3>
        </div>
        <div class="card-body" style="padding: 16px; max-height: 300px; overflow-y: auto;">
          ${searchSourceStatsHtml || '<p style="color: var(--secondary); text-align: center;">暂无数据</p>'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-key"></i> 搜索关键词</h3>
        </div>
        <div class="card-body" style="padding: 16px; max-height: 300px; overflow-y: auto;">
          ${keywordStatsHtml || '<p style="color: var(--secondary); text-align: center;">暂无数据</p>'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-robot"></i> 蜘蛛爬虫</h3>
        </div>
        <div class="card-body" style="padding: 16px; max-height: 300px; overflow-y: auto;">
          ${botStatsHtml || '<p style="color: var(--secondary); text-align: center;">暂无数据</p>'}
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px;">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-file-alt"></i> 热门页面</h3>
        </div>
        <div class="card-body" style="padding: 16px; max-height: 300px; overflow-y: auto;">
          ${pathStatsHtml || '<p style="color: var(--secondary); text-align: center;">暂无数据</p>'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-link"></i> 外部来源</h3>
        </div>
        <div class="card-body" style="padding: 16px; max-height: 300px; overflow-y: auto;">
          ${refererStatsHtml || '<p style="color: var(--secondary); text-align: center;">暂无数据</p>'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-globe"></i> 访问地区</h3>
        </div>
        <div class="card-body" style="padding: 16px; max-height: 300px; overflow-y: auto;">
          ${countryStatsHtml || '<p style="color: var(--secondary); text-align: center;">暂无数据</p>'}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-share-alt"></i> 分享统计</h3>
        </div>
        <div class="card-body" style="padding: 16px;">
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 24px; font-weight: 700; color: var(--primary);">${stats.total}</div>
            <div style="color: var(--secondary); margin-top: 8px;">总分享次数</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-list"></i> 访问日志</h3>
        <form method="POST" action="${adminPrefix}/logs/clear" style="display: inline;" onsubmit="return confirm('确定清空所有日志？')">
          <button type="submit" class="btn btn-danger btn-sm">
            <i class="fas fa-trash"></i> 清空日志
          </button>
        </form>
      </div>
      <div class="card-body" style="padding: 0; overflow-x: auto;">
        ${logs.length > 0 ? `
          <table class="table">
            <thead>
              <tr>
                <th>访问路径</th>
                <th>类型</th>
                <th>IP</th>
                <th>国家</th>
                <th>User-Agent</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>${logsHtml}</tbody>
          </table>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-history"></i></div>
            <h3>暂无访问日志</h3>
            <p>有访客访问时将自动记录</p>
          </div>
        `}
      </div>
    </div>

    <script>
      (function() {
        var dailyData = ${dailyDataJson};
        var maxPv = ${maxPv};
        var chartContainer = document.getElementById('dailyChart');
        
        if (dailyData && dailyData.length > 0) {
          var html = '';
          dailyData.forEach(function(d) {
            var pvHeight = Math.max(Math.round((d.pv / maxPv) * 150), d.pv > 0 ? 4 : 0);
            var uvHeight = Math.max(Math.round((d.uv / maxPv) * 150), d.uv > 0 ? 4 : 0);
            html += '<div style="flex: 1; text-align: center;">';
            html += '<div style="display: flex; align-items: flex-end; justify-content: center; height: 160px; gap: 4px;">';
            html += '<div style="width: 20px; background: #007bff; border-radius: 4px 4px 0 0; min-height: ' + pvHeight + 'px;" title="PV: ' + d.pv + '"></div>';
            html += '<div style="width: 20px; background: #28a745; border-radius: 4px 4px 0 0; min-height: ' + uvHeight + 'px;" title="UV: ' + d.uv + '"></div>';
            html += '</div>';
            html += '<div style="font-size: 11px; color: #666; margin-top: 4px;">' + (d.dateShort || '') + '</div>';
            html += '<div style="font-size: 10px; color: #999;">PV:' + (d.pv || 0) + '</div>';
            html += '<div style="font-size: 10px; color: #999;">UV:' + (d.uv || 0) + '</div>';
            html += '</div>';
          });
          chartContainer.innerHTML = html;
        } else {
          chartContainer.innerHTML = '<div style="text-align: center; color: #999; width: 100%; padding: 40px;">暂无数据</div>';
        }
      })();
    </script>
  `;

  return adminBaseTemplate('访问日志', content, env, adminPrefix);
}

// 渲染图片上传页面
export function renderImageUpload(env, adminPrefix) {
  const content = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-upload"></i> 上传图片</h3>
      </div>
      <div class="card-body">
        <div style="border: 2px dashed var(--border); border-radius: 12px; padding: 40px; text-align: center; margin-bottom: 20px;">
          <input type="file" id="imageInput" accept="image/*" multiple style="display: none;">
          <div style="font-size: 48px; color: var(--primary); margin-bottom: 16px;">
            <i class="fas fa-cloud-upload-alt"></i>
          </div>
          <h3 style="margin-bottom: 8px;">点击或拖拽图片到这里</h3>
          <p style="color: var(--secondary);">支持 JPEG, PNG, GIF, WebP 格式，单个文件最大 5MB</p>
          <button type="button" class="btn btn-primary" style="margin-top: 16px;" onclick="document.getElementById('imageInput').click()">
            选择图片
          </button>
        </div>
        
        <div id="uploadResults" style="display: none;">
          <h4 style="margin-bottom: 16px;">上传结果：</h4>
          <div id="imageList"></div>
        </div>
        
        <div id="uploadProgress" style="display: none; margin-top: 20px;">
          <div style="background: var(--border); border-radius: 8px; height: 8px; overflow: hidden;">
            <div id="progressBar" style="background: var(--primary); height: 100%; width: 0%; transition: width 0.3s;"></div>
          </div>
          <p style="margin-top: 8px; color: var(--secondary);">上传中...</p>
        </div>
      </div>
    </div>
    
    <script>
      const imageInput = document.getElementById('imageInput');
      const uploadResults = document.getElementById('uploadResults');
      const imageList = document.getElementById('imageList');
      const uploadProgress = document.getElementById('uploadProgress');
      const progressBar = document.getElementById('progressBar');
      
      imageInput.addEventListener('change', async (e) => {
        const files = e.target.files;
        if (!files.length) return;
        
        uploadProgress.style.display = 'block';
        uploadResults.style.display = 'none';
        progressBar.style.width = '0%';
        
        for (let i = 0; i < files.length; i++) {
          await uploadImage(files[i], i, files.length);
        }
        
        uploadProgress.style.display = 'none';
        uploadResults.style.display = 'block';
      });
      
      async function uploadImage(file, index, total) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('${adminPrefix}/api/upload', {
            method: 'POST',
            body: formData
          });
          
          const result = await response.json();
          
          progressBar.style.width = ((index + 1) / total * 100) + '%';
          
          if (result.success) {
            const div = document.createElement('div');
            div.style.cssText = 'background: var(--bg-content); padding: 16px; border-radius: 8px; margin-bottom: 12px;';
            div.innerHTML = \`
              <p style="margin-bottom: 8px; font-weight: 500;">\${file.name}</p>
              <input type="text" class="form-control" value="\${result.url}" readonly onclick="this.select()" style="margin-bottom: 8px;">
              <img src="\${result.url}" style="max-width: 200px; border-radius: 8px;" onerror="this.style.display='none'">
              <button class="btn btn-sm btn-secondary" onclick="copyToClipboard('\${result.url}')" style="margin-top: 8px;">
                <i class="fas fa-copy"></i> 复制链接
              </button>
            \`;
            imageList.appendChild(div);
          } else {
            alert('上传失败: ' + result.error);
          }
        } catch (err) {
          alert('上传失败: ' + err.message);
        }
      }
      
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          alert('复制成功！');
        });
      }
    </script>
  `;
  
  return adminBaseTemplate('图片上传', content, env, adminPrefix);
}

// ========== 文章管理 ==========

// 渲染文章列表
export function renderPostsList(posts, env, adminPrefix) {
  const postsHtml = posts.map(post => `
    <tr>
      <td><input type="checkbox" class="post-checkbox" value="${post.id}"></td>
      <td>
        <strong>${post.title}</strong>
        ${post.coverImage ? '<i class="fas fa-image" style="color: var(--primary); margin-left: 8px;" title="有封面图"></i>' : ''}
        ${post.videoUrl ? '<i class="fas fa-video" style="color: var(--accent-color); margin-left: 8px;" title="有视频"></i>' : ''}
      </td>
      <td><span class="badge badge-secondary">${post.category || '未分类'}</span></td>
      <td>
        <span class="badge ${post.status === 'published' ? 'badge-success' : 'badge-warning'}">
          <i class="fas fa-${post.status === 'published' ? 'check' : 'draft'}"></i>
          ${post.status === 'published' ? '已发布' : '草稿'}
        </span>
      </td>
      <td><i class="fas fa-eye"></i> ${post.views || 0}</td>
      <td>${new Date(post.createdAt).toLocaleDateString('zh-CN')}</td>
      <td>
        <div class="action-btns">
          <a href="${adminPrefix}/post/edit/${post.id}" class="btn btn-sm btn-secondary">
            <i class="fas fa-edit"></i> 编辑
          </a>
          <form method="POST" action="${adminPrefix}/post/delete/${post.id}" style="display:inline;" onsubmit="return confirm('确定删除此文章？')">
            <button type="submit" class="btn btn-sm btn-danger">
              <i class="fas fa-trash"></i> 删除
            </button>
          </form>
        </div>
      </td>
    </tr>
  `).join('');
  
  const content = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-file-alt"></i> 文章列表</h3>
        <div style="display: flex; gap: 10px;">
          <button type="button" class="btn btn-secondary" onclick="exportPosts()">
            <i class="fas fa-download"></i> 导出文章
          </button>
          <label class="btn btn-secondary" style="margin: 0; cursor: pointer;">
            <i class="fas fa-upload"></i> 导入文章
            <input type="file" id="importFile" accept=".json,.md" style="display: none;" onchange="importPosts(this)">
          </label>
          <a href="${adminPrefix}/post/new" class="btn btn-primary">
            <i class="fas fa-plus"></i> 新建文章
          </a>
        </div>
      </div>
      <div class="card-body" style="padding: 0;">
        ${posts.length > 0 ? `
          <table class="table">
            <thead>
              <tr>
                <th><input type="checkbox" id="selectAll" onchange="toggleSelectAll(this)"></th>
                <th>标题</th>
                <th>分类</th>
                <th>状态</th>
                <th>阅读量</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>${postsHtml}</tbody>
          </table>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon"><i class="fas fa-file-alt"></i></div>
            <h3>暂无文章</h3>
            <p>点击右上角按钮创建第一篇文章</p>
          </div>
        `}
      </div>
    </div>
    
    <script>
      function toggleSelectAll(cb) {
        var cbs = document.querySelectorAll('.post-checkbox');
        cbs.forEach(function(c) { c.checked = cb.checked; });
      }
      
      function getSelectedPosts() {
        var cbs = document.querySelectorAll('.post-checkbox:checked');
        return Array.from(cbs).map(function(c) { return c.value; });
      }
      
      function exportPosts() {
        var selected = getSelectedPosts();
        if (selected.length === 0) {
          alert('请先选择要导出的文章');
          return;
        }
        
        var posts = ${JSON.stringify(posts)};
        var exportData = posts.filter(function(p) { return selected.includes(p.id); });
        
        var blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'posts_export_' + new Date().toISOString().slice(0,10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
      }
      
      function importPosts(input) {
        if (!input.files[0]) return;
        var file = input.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          try {
            var data = JSON.parse(e.target.result);
            if (!Array.isArray(data)) data = [data];
            
            var count = 0;
            data.forEach(function(post) {
              if (post.title && post.content) {
                var fd = new FormData();
                fd.append('title', post.title);
                fd.append('content', post.content);
                fd.append('category', post.category || '');
                fd.append('tags', post.tags ? post.tags.join(', ') : '');
                fd.append('status', 'draft');
                fd.append('coverImage', post.coverImage || '');
                fd.append('videoUrl', post.videoUrl || '');
                
                fetch('${adminPrefix}/post/new', {method: 'POST', body: fd})
                  .then(function() { count++; })
                  .catch(function(err) { console.error(err); });
              }
            });
            
            setTimeout(function() {
              alert('成功导入 ' + count + ' 篇文章');
              location.reload();
            }, 1000);
          } catch(err) {
            alert('导入失败: 文件格式错误');
          }
        };
        reader.readAsText(file);
        input.value = '';
      }
      
      function handleCoverUpload(input) {
        var file = input.files[0];
        if (!file) return;

        var fd = new FormData();
        fd.append('file', file);

        fetch('${adminPrefix}/api/upload', {method: 'POST', body: fd})
          .then(function(r) { return r.json(); })
          .then(function(r) {
            if (r.success) {
              document.getElementById('coverImageInput').value = r.url;
              alert('上传成功! URL: ' + r.url);
            } else {
              alert('上传失败: ' + (r.error || '未知错误'));
            }
          })
          .catch(function(e) { alert('上传失败: ' + e.message); });
      }
    </script>
  `;
  
  return adminBaseTemplate('文章管理', content, env, adminPrefix);
}

// 渲染新建/编辑文章表单
export function renderNewPost(categories, env, adminPrefix) {
  return renderPostForm(null, categories, env, adminPrefix);
}

export function renderEditPost(post, categories, env, adminPrefix) {
  return renderPostForm(post, categories, env, adminPrefix);
}

function renderPostForm(post, categories, env, adminPrefix) {
  const isEdit = !!post;
  const categoryOptions = categories.map(c => 
    `<option value="${c.slug}" ${post?.category === c.slug ? 'selected' : ''}>${c.name}</option>`
  ).join('');
  
  const postId = post ? post.id : 'new';
  const postTitle = post ? post.title.replace(/"/g, '&quot;') : '';
  const postContentRaw = post ? post.content : '';
  const postContent = post ? post.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
  const postCategory = post ? post.category : '';
  const postTags = post ? post.tags.join(', ') : '';
  const postCover = post ? post.coverImage : '';
  const postVideo = post ? post.videoUrl : '';
  const postStatus = post ? post.status : 'published';
  
  const content = `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-${isEdit ? 'edit' : 'plus'}"></i> ${isEdit ? '编辑文章' : '新建文章'}</h3>
        ${!isEdit ? `
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('mdUploadFile').click()">
            <i class="fas fa-file-upload"></i> 上传 MD 文件
          </button>
          <input type="file" id="mdUploadFile" accept=".md,.markdown,.txt" style="display: none;">
        ` : ''}
      </div>
      <div class="card-body">
        <form method="POST" action="${isEdit ? adminPrefix + '/post/edit/' + postId : adminPrefix + '/post/new'}">
          <div class="form-group">
            <label class="form-label">文章标题</label>
            <input type="text" name="title" class="form-control" value="${postTitle}" placeholder="请输入文章标题" required>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
              <label class="form-label">分类</label>
              <select name="category" class="form-control" required>
                <option value="">请选择分类</option>
                ${categoryOptions}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">标签</label>
              <input type="text" name="tags" class="form-control" value="${postTags}" placeholder="标签1, 标签2, 标签3">
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">封面图片</label>
            <div style="display: flex; gap: 10px;">
              <input type="file" id="coverUp" accept="image/*" class="form-control" style="flex: 1; padding: 8px;">
              <button type="button" class="btn btn-primary" onclick="var f=document.getElementById('coverUp');if(f.files[0]){var fd=new FormData();fd.append('file',f.files[0]);fetch('${adminPrefix}/api/upload',{method:'POST',body:fd}).then(r=>r.json()).then(r=>{if(r.success){document.getElementById('coverImageInput').value=r.url;alert('上传成功:'+r.url);}else{alert('上传失败');}}).catch(e=>alert('错误:'+e));}else{alert('请先选择图片');}">上传图片</button>
            </div>
            <input type="url" name="coverImage" id="coverImageInput" class="form-control" value="${postCover}" placeholder="上传图片后会自动填充图片地址，或手动输入图片链接" style="margin-top: 10px;">
            <small style="color: var(--secondary); margin-top: 6px; display: block;">
               <i class="fas fa-info-circle"></i> 支持 JPG、PNG、GIF 等图片格式
             </small>
           </div>
          
          <div class="form-group">
            <label class="form-label">视频链接</label>
            <input type="url" name="videoUrl" class="form-control" value="${postVideo}" placeholder="https://www.youtube.com/watch?v=xxx 或 Bilibili 链接">
            <small style="color: var(--secondary); margin-top: 6px; display: block;">
              <i class="fas fa-info-circle"></i> 支持 YouTube、Bilibili 或直接视频链接
            </small>
          </div>
          
          <div class="form-group">
            <label class="form-label">文章内容（支持 Markdown）</label>
            <textarea id="editor" name="content">${postContent}</textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">发布状态</label>
            <select name="status" class="form-control">
              <option value="draft" ${postStatus === 'draft' ? 'selected' : ''}>草稿</option>
              <option value="published" ${postStatus === 'published' ? 'selected' : ''}>立即发布</option>
            </select>
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <a href="${adminPrefix}/posts" class="btn btn-secondary">
              <i class="fas fa-times"></i> 取消
            </a>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> ${isEdit ? '保存修改' : '发布文章'}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <script>
      (function() {
        var coverUp = document.getElementById('coverUp');
        var titleInput = document.querySelector('input[name="title"]');
        var categorySelect = document.querySelector('select[name="category"]');
        var tagsInput = document.querySelector('input[name="tags"]');
        var videoUrlInput = document.querySelector('input[name="videoUrl"]');
        var statusSelect = document.querySelector('select[name="status"]');
        var coverImageInput = document.getElementById('coverImageInput');
        
        var draftKey = "post_draft_" + "${postId}";
        
        // 初始化 EasyMDE 编辑器
        const easyMDE = new EasyMDE({
          element: document.getElementById("editor"),
          spellChecker: false,
          autosave: {
            enabled: true,
            uniqueId: "post-editor",
            delay: 1000
          },
          toolbar: [
            "bold", "italic", "heading", "|",
            "quote", "unordered-list", "ordered-list", "|",
            "link", "image", "|",
            "preview", "side-by-side", "fullscreen", "|",
            "guide"
          ]
        });
        
        function saveDraft() {
          var content = easyMDE.value();
          var draft = {
            title: titleInput.value,
            content: content,
            category: categorySelect.value,
            tags: tagsInput.value,
            videoUrl: videoUrlInput.value,
            status: statusSelect.value,
            coverImage: coverImageInput.value,
            savedAt: new Date().toISOString()
          };
          localStorage.setItem(draftKey, JSON.stringify(draft));
        }
        
        function loadDraft() {
          var saved = localStorage.getItem(draftKey);
          if (saved) {
            try {
              var draft = JSON.parse(saved);
              if (draft.title) titleInput.value = draft.title;
              if (draft.content) easyMDE.value(draft.content);
              if (draft.category) categorySelect.value = draft.category;
              if (draft.tags) tagsInput.value = draft.tags;
              if (draft.videoUrl) videoUrlInput.value = draft.videoUrl;
              if (draft.status) statusSelect.value = draft.status;
              if (draft.coverImage) coverImageInput.value = draft.coverImage;
            } catch(e) {}
          }
        }
        
        document.querySelector('form').addEventListener('submit', function() {
          localStorage.removeItem(draftKey);
        });
        
        var mdUploadFile = document.getElementById('mdUploadFile');
        if (mdUploadFile) {
          mdUploadFile.addEventListener('change', function() {
            handleMdUpload(this);
          });
        }
        
        function handleMdUpload(input) {
          if (!input.files[0]) return;
          var file = input.files[0];
          var reader = new FileReader();
          reader.onload = function(e) {
            var content = e.target.result;
            var lines = content.split('\n');
            var title = '';
            var bodyStart = 0;
            for (var i = 0; i < Math.min(10, lines.length); i++) {
              var line = lines[i].trim();
              if (line.indexOf('# ') === 0) {
                title = line.substring(2).trim();
                bodyStart = i + 1;
                break;
              }
            }
            if (!title) {
              title = file.name.replace(/\.(md|markdown|txt)$/i, '');
            }
            var body = lines.slice(bodyStart).join('\n').trim();
            titleInput.value = title;
            easyMDE.value(body);
            alert('文件已导入！请检查并补充其他信息。');
          };
          reader.readAsText(file);
          input.value = '';
        }
        
        loadDraft();
        setInterval(saveDraft, 30000);
      })();
    </script>
  `;
  
  const extraStyles = `
    /* EasyMDE 编辑器样式 */
    .EasyMDEContainer {
      margin-bottom: 20px;
    }
    .CodeMirror {
      min-height: 400px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 14px;
    }
    .editor-toolbar {
      border: 1px solid var(--border);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      background: var(--bg-content);
    }
    .editor-toolbar button {
      color: var(--text-dark);
    }
    .editor-toolbar button:hover {
      background: var(--primary);
      color: white;
    }
  `;
  
  return adminBaseTemplate(isEdit ? '编辑文章' : '新建文章', content, env, adminPrefix, extraStyles);
}
