import { Router } from './router';
import { renderHome, renderPost, renderLogin, renderCategories, renderTags } from './templates';
import { renderDashboard, renderAds, renderNewAd, renderEditAd, renderSettings, renderPostsList, renderImageUpload, renderNewPost, renderEditPost, renderVisitLogs } from './admin-templates';
import { renderForumHome, renderTopicDetail, renderNewTopic } from './forum-templates';
import { Post, Category, Tag, Ad, Setting, Comment, Topic, TopicReply, User, VisitLog, generateId, generateSlug } from './models';

function detectBot(userAgent) {
  if (!userAgent) return { isBot: false, botName: '' };
  const ua = userAgent.toLowerCase();
  const bots = [
    { name: 'Googlebot', patterns: ['googlebot', 'google.com/bot'] },
    { name: 'Bingbot', patterns: ['bingbot', 'msnbot'] },
    { name: 'Baiduspider', patterns: ['baiduspider'] },
    { name: 'Sogou', patterns: ['sogou'] },
    { name: '360Spider', patterns: ['360spider'] },
    { name: 'YandexBot', patterns: ['yandexbot'] },
    { name: 'DuckDuckBot', patterns: ['duckduckbot'] },
    { name: 'Slurp', patterns: ['slurp'] },
    { name: 'TwitterBot', patterns: ['twitterbot'] },
    { name: 'FacebookBot', patterns: ['facebookexternalhit', 'facebookbot'] },
    { name: 'LinkedInBot', patterns: ['linkedinbot'] },
    { name: 'Pinterest', patterns: ['pinterest'] },
    { name: 'Applebot', patterns: ['applebot'] },
    { name: 'SemrushBot', patterns: ['semrushbot'] },
    { name: 'AhrefsBot', patterns: ['ahrefsbot'] },
    { name: 'MJ12bot', patterns: ['mj12bot'] },
    { name: 'DotBot', patterns: ['dotbot'] },
    { name: 'PetalBot', patterns: ['petalbot'] },
    { name: 'Bytespider', patterns: ['bytespider'] },
    { name: 'GPTBot', patterns: ['gptbot', 'chatgpt'] },
    { name: 'ClaudeBot', patterns: ['claudebot', 'anthropic'] },
    { name: 'Other Bot', patterns: ['bot', 'crawler', 'spider', 'scraper'] }
  ];
  for (const bot of bots) {
    for (const pattern of bot.patterns) {
      if (ua.includes(pattern)) {
        return { isBot: true, botName: bot.name };
      }
    }
  }
  return { isBot: false, botName: '' };
}

const ADMIN_PREFIX = '/dong721';

const maliciousPatterns = [
  'wp-admin', 'wp-login', 'wp-content', 'wp-includes',
  'wordpress', 'blog', 'xmlrpc', 'wp-json',
  '.env', '.git', '.htaccess', 'config',
  'admin', 'login', 'shell', 'upload',
  'phpmyadmin', 'mysql', 'database',
  'cgi-bin', 'cgi', '.php', '.asp', '.exe',
  'vite', '@vite', 'node_modules', '.webpack'
];

const maliciousUserAgents = [
  'wpscan', 'nikto', 'sqlmap', 'nmap', 'masscan',
  'havij', 'pangolin', 'xsser', 'dirbuster',
  'gobuster', 'feroxbuster', 'wfuzz', 'burp',
  'metasploit', 'acunetix', 'netsparker', 'appscan',
  'insight', 'vulnerability', 'scanner', 'spider'
];

function isMaliciousRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();
  
  // 白名单 - 后台路径不检查
  if (path.startsWith(ADMIN_PREFIX)) {
    return false;
  }
  
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  
  // 检查恶意 User-Agent
  for (const pattern of maliciousUserAgents) {
    if (userAgent.includes(pattern)) {
      return true;
    }
  }
  
  // 检查可疑路径
  for (const pattern of maliciousPatterns) {
    if (path.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

async function logVisit(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    if (path.startsWith('/dong721') || path.startsWith('/static') || path.startsWith('/r2')) {
      return;
    }
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const country = request.headers.get('cf-ipcountry') || '';
    const city = request.headers.get('cf-ipcity') || '';
    const { isBot, botName } = detectBot(userAgent);
    ctx.waitUntil(VisitLog.create(env.BLOG_KV, {
      path,
      method: request.method,
      ip,
      userAgent,
      referer,
      country,
      city,
      isBot,
      botName
    }));
  } catch (e) {
    console.error('Log error:', e);
  }
}

export default {
  async fetch(request, env, ctx) {
    // 保存 env 供定时任务使用
    if (!globalThis.blogEnv && env.BLOG_KV) {
      globalThis.blogEnv = env;
    }
    
    // 检查恶意请求
    if (isMaliciousRequest(request)) {
      return new Response('403 Forbidden', { 
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const router = new Router(request, env);
    
    logVisit(request, env, ctx);
    
    // 静态资源
    router.get('/static/*', async (req, env) => {
      return serveStatic(req, env);
    });
    
    // robots.txt
    router.get('/robots.txt', async (req, env) => {
      const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://www.tianliaos.com/sitemap.xml

# 防止重复内容
Host: https://www.tianliaos.com`;
      return new Response(robotsTxt, {
        headers: { 'Content-Type': 'text/plain' }
      });
    });
    
    // ads.txt (Google AdSense)
    router.get('/ads.txt', async (req, env) => {
      const adsTxt = `google.com, pub-4953994726882790, DIRECT, f08c47fec0942fa0`;
      return new Response(adsTxt, {
        headers: { 'Content-Type': 'text/plain' }
      });
    });
    
    // sitemap.xml
    router.get('/sitemap.xml', async (req, env) => {
      const posts = await Post.getAll(env.BLOG_KV);
      const categories = await Category.getAll(env.BLOG_KV);
      const siteUrl = 'https://www.tianliaos.com';
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/forum</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
      
      // 添加分类页面
      for (const cat of categories) {
        sitemap += `
  <url>
    <loc>${siteUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
      
      // 添加文章页面
      for (const post of posts) {
        if (post.status === 'published') {
          sitemap += `
  <url>
    <loc>${siteUrl}/post/${post.slug || post.id}</loc>
    <lastmod>${post.updatedAt || post.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }
      }
      
      sitemap += `
</urlset>`;
      
      return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml;charset=UTF-8' }
      });
    });
    
    // 首页
    router.get('/', async (req, env) => {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const POSTS_PER_PAGE = 6;
      
      const allPosts = await Post.getAll(env.BLOG_KV);
      const categories = await Category.getAll(env.BLOG_KV);
      
      // 计算每个分类的文章数量
      const publishedPosts = allPosts.filter(p => p.status === 'published')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      categories.forEach(cat => {
        cat.count = publishedPosts.filter(p => 
          p.category === cat.slug || p.category === cat.name
        ).length;
      });
      
      // 分页
      const totalPosts = publishedPosts.length;
      const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const posts = publishedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
      
      const sidebarAds = await Ad.getByPosition(env.BLOG_KV, 'sidebar');
      const headerAds = await Ad.getByPosition(env.BLOG_KV, 'header');
      const footerAds = await Ad.getByPosition(env.BLOG_KV, 'footer');
      const analyticsCode = await Setting.get(env.BLOG_KV, 'analytics_code');
      
      // 按点击量排序获取热门文章
      const hotPosts = [...publishedPosts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);
      
      return new Response(renderHome(posts, categories, env, '', {
        sidebarAds,
        headerAds,
        footerAds,
        analyticsCode,
        hotPosts,
        pagination: { page, totalPages, totalPosts }
      }), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 文章详情页
    router.get('/post/:slug', async (req, env, params) => {
      const post = await Post.getBySlug(env.BLOG_KV, params.slug);
      if (!post) {
        return new Response('文章不存在', { status: 404 });
      }
      await Post.incrementViews(env.BLOG_KV, params.slug);
      const categories = await Category.getAll(env.BLOG_KV);
      const comments = await Comment.getByPostId(env.BLOG_KV, post.id);
      const sidebarAds = await Ad.getByPosition(env.BLOG_KV, 'sidebar');
      const articleTopAds = await Ad.getByPosition(env.BLOG_KV, 'article_top');
      const articleBottomAds = await Ad.getByPosition(env.BLOG_KV, 'article_bottom');
      const analyticsCode = await Setting.get(env.BLOG_KV, 'analytics_code');
      
      // 获取相关文章（同分类或同标签）
      const allPosts = await Post.getAll(env.BLOG_KV);
      let relatedPosts = allPosts
        .filter(p => p.id !== post.id && p.status === 'published')
        .filter(p => p.category === post.category || (p.tags && post.tags && p.tags.some(t => p.tags.includes(t))))
        .slice(0, 5);
      
      // 如果相关文章不足5篇，补充最新文章
      if (relatedPosts.length < 5) {
        const otherPosts = allPosts
          .filter(p => p.id !== post.id && p.status === 'published')
          .filter(p => !relatedPosts.includes(p))
          .slice(0, 5 - relatedPosts.length);
        relatedPosts = [...relatedPosts, ...otherPosts];
      }
      
      return new Response(renderPost(post, categories, env, {
        sidebarAds,
        articleTopAds,
        articleBottomAds,
        analyticsCode,
        comments
      }, relatedPosts), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 分类页面
    router.get('/category/:slug', async (req, env, params) => {
      const posts = await Post.getByCategory(env.BLOG_KV, params.slug);
      const categories = await Category.getAll(env.BLOG_KV);
      const category = await Category.getBySlug(env.BLOG_KV, params.slug);
      const sidebarAds = await Ad.getByPosition(env.BLOG_KV, 'sidebar');
      const headerAds = await Ad.getByPosition(env.BLOG_KV, 'header');
      const footerAds = await Ad.getByPosition(env.BLOG_KV, 'footer');
      const analyticsCode = await Setting.get(env.BLOG_KV, 'analytics_code');
      
      return new Response(renderHome(posts, categories, env, category?.name, {
        sidebarAds,
        headerAds,
        footerAds,
        analyticsCode
      }), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 标签页面
    router.get('/tag/:slug', async (req, env, params) => {
      const posts = await Post.getByTag(env.BLOG_KV, params.slug);
      const categories = await Category.getAll(env.BLOG_KV);
      const tag = await Tag.getBySlug(env.BLOG_KV, params.slug);
      const sidebarAds = await Ad.getByPosition(env.BLOG_KV, 'sidebar');
      const headerAds = await Ad.getByPosition(env.BLOG_KV, 'header');
      const footerAds = await Ad.getByPosition(env.BLOG_KV, 'footer');
      const analyticsCode = await Setting.get(env.BLOG_KV, 'analytics_code');
      
      return new Response(renderHome(posts, categories, env, tag?.name, {
        sidebarAds,
        headerAds,
        footerAds,
        analyticsCode
      }), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 搜索
    router.get('/search', async (req, env) => {
      const url = new URL(req.url);
      const keyword = url.searchParams.get('q') || '';
      const posts = await Post.search(env.BLOG_KV, keyword);
      const categories = await Category.getAll(env.BLOG_KV);
      const sidebarAds = await Ad.getByPosition(env.BLOG_KV, 'sidebar');
      const headerAds = await Ad.getByPosition(env.BLOG_KV, 'header');
      const footerAds = await Ad.getByPosition(env.BLOG_KV, 'footer');
      const analyticsCode = await Setting.get(env.BLOG_KV, 'analytics_code');
      
      return new Response(renderHome(posts, categories, env, `搜索: ${keyword}`, {
        sidebarAds,
        headerAds,
        footerAds,
        analyticsCode
      }), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // ==================== 交流频道路由 ====================
    
    // 交流频道首页
    router.get('/forum', async (req, env) => {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const topics = await Topic.getAll(env.BLOG_KV, page, 20);
      const totalCount = await Topic.getCount(env.BLOG_KV);
      const categories = await Category.getAll(env.BLOG_KV);
      return new Response(renderForumHome(topics, totalCount, env, page, categories), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 发布新话题页面
    router.get('/forum/new', async (req, env) => {
      const categories = await Category.getAll(env.BLOG_KV);
      return new Response(renderNewTopic(env, categories), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 话题详情页
    router.get('/forum/topic/:id', async (req, env, params) => {
      const topic = await Topic.getById(env.BLOG_KV, params.id);
      if (!topic) {
        return new Response('话题不存在', { status: 404 });
      }
      await Topic.incrementViews(env.BLOG_KV, params.id);
      const replies = await TopicReply.getByTopicId(env.BLOG_KV, params.id);
      const categories = await Category.getAll(env.BLOG_KV);
      return new Response(renderTopicDetail(topic, replies, env, categories), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // ==================== 隐藏的后台管理路由 ====================
    
    // 登录页面
    router.get(`${ADMIN_PREFIX}/login`, async (req, env) => {
      return new Response(renderLogin(env, '', ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 登录处理
    router.post(`${ADMIN_PREFIX}/login`, async (req, env) => {
      const formData = await req.formData();
      const username = formData.get('username');
      const password = formData.get('password');
      
      // 获取存储的密码（优先使用 KV 中修改过的密码）
      const storedPassword = await Setting.get(env.BLOG_KV, 'admin_password');
      const validPassword = storedPassword || env.ADMIN_PASSWORD;
      
      if (username === env.ADMIN_USERNAME && password === validPassword) {
        const token = await User.generateToken(env);
        return new Response('', {
          status: 302,
          headers: {
            'Location': ADMIN_PREFIX,
            'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=86400`
          }
        });
      }
      
      return new Response(renderLogin(env, '用户名或密码错误', ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 管理后台首页 - 仪表盘
    router.get(`${ADMIN_PREFIX}`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const posts = await Post.getAll(env.BLOG_KV);
      const ads = await Ad.getAll(env.BLOG_KV);
      const categories = await Category.getAll(env.BLOG_KV);
      
      const stats = {
        posts: posts.length,
        views: posts.reduce((sum, p) => sum + (p.views || 0), 0),
        categories: categories.length,
        ads: ads.length
      };
      
      return new Response(renderDashboard(stats, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 文章列表页面
    router.get(`${ADMIN_PREFIX}/posts`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const posts = await Post.getAll(env.BLOG_KV);
      return new Response(renderPostsList(posts, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 新建文章页面
    router.get(`${ADMIN_PREFIX}/post/new`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const categories = await Category.getAll(env.BLOG_KV);
      return new Response(renderNewPost(categories, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 创建文章
    router.post(`${ADMIN_PREFIX}/post/new`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      const post = await Post.create(env.BLOG_KV, {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        tags: formData.get('tags'),
        status: formData.get('status'),
        coverImage: formData.get('coverImage'),
        videoUrl: formData.get('videoUrl')
      });
      return new Response('', {
        status: 302,
        headers: { 'Location': ADMIN_PREFIX }
      });
    });
    
    // 编辑文章页面
    router.get(`${ADMIN_PREFIX}/post/edit/:id`, async (req, env, params) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const post = await Post.getById(env.BLOG_KV, params.id);
      const categories = await Category.getAll(env.BLOG_KV);
      return new Response(renderEditPost(post, categories, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 更新文章
    router.post(`${ADMIN_PREFIX}/post/edit/:id`, async (req, env, params) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      await Post.update(env.BLOG_KV, params.id, {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        tags: formData.get('tags'),
        status: formData.get('status')
      });
      return new Response('', {
        status: 302,
        headers: { 'Location': ADMIN_PREFIX }
      });
    });
    
    // 删除文章
    router.post(`${ADMIN_PREFIX}/post/delete/:id`, async (req, env, params) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      await Post.delete(env.BLOG_KV, params.id);
      return new Response('', {
        status: 302,
        headers: { 'Location': ADMIN_PREFIX }
      });
    });
    
    // 分类管理
    router.get(`${ADMIN_PREFIX}/categories`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const categories = await Category.getAll(env.BLOG_KV);
      return new Response(renderCategories(categories, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 创建分类
    router.post(`${ADMIN_PREFIX}/category/new`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      await Category.create(env.BLOG_KV, {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description')
      });
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/categories` }
      });
    });
    
    // 删除分类
    router.post(`${ADMIN_PREFIX}/category/delete/:id`, async (req, env, params) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      await Category.delete(env.BLOG_KV, params.id);
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/categories` }
      });
    });
    
    // 登出
    router.get(`${ADMIN_PREFIX}/logout`, async (req, env) => {
      return new Response('', {
        status: 302,
        headers: {
          'Location': `${ADMIN_PREFIX}/login`,
          'Set-Cookie': `token=; HttpOnly; Path=/; Max-Age=0`
        }
      });
    });
    
    // ==================== 广告管理路由 ====================
    
    // 广告列表
    router.get(`${ADMIN_PREFIX}/ads`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const ads = await Ad.getAll(env.BLOG_KV);
      return new Response(renderAds(ads, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 新建广告页面
    router.get(`${ADMIN_PREFIX}/ad/new`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      return new Response(renderNewAd(env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 创建广告
    router.post(`${ADMIN_PREFIX}/ad/new`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      await Ad.create(env.BLOG_KV, {
        name: formData.get('name'),
        code: formData.get('code'),
        position: formData.get('position'),
        order: formData.get('order'),
        status: formData.get('status')
      });
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/ads` }
      });
    });
    
    // 编辑广告页面
    router.get(`${ADMIN_PREFIX}/ad/edit/:id`, async (req, env, params) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const ad = await Ad.getById(env.BLOG_KV, params.id);
      return new Response(renderEditAd(ad, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 更新广告
    router.post(`${ADMIN_PREFIX}/ad/edit/:id`, async (req, env, params) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      await Ad.update(env.BLOG_KV, params.id, {
        name: formData.get('name'),
        code: formData.get('code'),
        position: formData.get('position'),
        order: formData.get('order'),
        status: formData.get('status')
      });
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/ads` }
      });
    });
    
    // 删除广告
    router.post(`${ADMIN_PREFIX}/ad/delete/:id`, async (req, env, params) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      await Ad.delete(env.BLOG_KV, params.id);
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/ads` }
      });
    });
    
    // ==================== 系统设置路由 ====================
    
    // 设置页面
    router.get(`${ADMIN_PREFIX}/settings`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const settings = await Setting.getAll(env.BLOG_KV);
      return new Response(renderSettings(settings, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 保存统计代码
    router.post(`${ADMIN_PREFIX}/settings/analytics`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      await Setting.set(env.BLOG_KV, 'analytics_code', formData.get('analytics_code'));
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/settings` }
      });
    });
    
    // 保存网站信息
    router.post(`${ADMIN_PREFIX}/settings/site`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      await Setting.set(env.BLOG_KV, 'site_title', formData.get('site_title'));
      await Setting.set(env.BLOG_KV, 'site_description', formData.get('site_description'));
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/settings` }
      });
    });
    
    // 保存图床设置
    router.post(`${ADMIN_PREFIX}/settings/imagehost`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      await Setting.set(env.BLOG_KV, 'image_domain', formData.get('image_domain'));
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/settings` }
      });
    });
    
    // 修改密码
    router.post(`${ADMIN_PREFIX}/settings/password`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      const formData = await req.formData();
      const currentPassword = formData.get('current_password');
      const newPassword = formData.get('new_password');
      const confirmPassword = formData.get('confirm_password');
      
      // 获取当前有效密码
      const storedPassword = await Setting.get(env.BLOG_KV, 'admin_password');
      const validPassword = storedPassword || env.ADMIN_PASSWORD;
      
      // 验证当前密码
      if (currentPassword !== validPassword) {
        return new Response('<script>alert("当前密码错误"); history.back();</script>', {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });
      }
      
      // 验证新密码
      if (newPassword.length < 6) {
        return new Response('<script>alert("新密码长度至少6位"); history.back();</script>', {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });
      }
      
      if (newPassword !== confirmPassword) {
        return new Response('<script>alert("两次输入的密码不一致"); history.back();</script>', {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' }
        });
      }
      
      // 保存新密码到 KV
      await Setting.set(env.BLOG_KV, 'admin_password', newPassword);
      
      return new Response('<script>alert("密码修改成功，请重新登录"); window.location.href = "' + ADMIN_PREFIX + '/logout";</script>', {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 访问日志页面
    router.get(`${ADMIN_PREFIX}/logs`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      const logs = await VisitLog.getAll(env.BLOG_KV, 1, 100);
      const stats = await VisitLog.getStats(env.BLOG_KV);
      return new Response(renderVisitLogs(logs, stats, env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 清空日志
    router.post(`${ADMIN_PREFIX}/logs/clear`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('Unauthorized', { status: 401 });
      }
      await VisitLog.clear(env.BLOG_KV);
      return new Response('', {
        status: 302,
        headers: { 'Location': `${ADMIN_PREFIX}/logs` }
      });
    });
    
    // 图片上传页面
    router.get(`${ADMIN_PREFIX}/upload`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response('', {
          status: 302,
          headers: { 'Location': `${ADMIN_PREFIX}/login` }
        });
      }
      return new Response(renderImageUpload(env, ADMIN_PREFIX), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    });
    
    // 图片上传 API (Cloudflare R2)
    router.post(`${ADMIN_PREFIX}/api/upload`, async (req, env) => {
      if (!await User.verifyToken(req, env)) {
        return new Response(JSON.stringify({ error: '未授权' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      try {
        const formData = await req.formData();
        const file = formData.get('file');
        
        if (!file || !file.name) {
          return new Response(JSON.stringify({ error: '请选择图片文件' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // 获取图片域名设置
        const settings = await Setting.getAll(env.BLOG_KV);
        const imgDomain = settings.image_domain || '';
        
        // 生成唯一文件名
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const arrayBuffer = await file.arrayBuffer();
        const fileData = new Uint8Array(arrayBuffer);
        
        // 获取 Content-Type
        const contentType = getContentType(ext);
        
        // 上传到 R2
        await env.IMG_BUCKET.put(fileName, fileData, {
          httpMetadata: {
            contentType: contentType
          }
        });
        
        // 生成公开访问 URL
        let publicUrl;
        if (imgDomain) {
          publicUrl = imgDomain + '/' + fileName;
        } else {
          // 如果没有设置域名，使用 Workers 路由
          publicUrl = '/r2/' + fileName;
        }
        
        return new Response(JSON.stringify({
          success: true,
          url: publicUrl
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    });
    
    // R2 公开访问路由
    router.get('/r2/:fileName', async (req, env, params) => {
      try {
        const object = await env.IMG_BUCKET.get(params.fileName);
        if (!object) {
          return new Response('Not Found', { status: 404 });
        }
        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata.contentType || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000'
          }
        });
      } catch (error) {
        return new Response('Error', { status: 500 });
      }
    });
    
    // 外部发布文章 API (需要密码)
    router.post('/api/publish', async (req, env) => {
      try {
        const formData = await req.formData();
        const password = formData.get('password');
        const title = formData.get('title');
        const content = formData.get('content');
        const category = formData.get('category') || '';
        const tags = formData.get('tags') || '';
        const coverImage = formData.get('coverImage') || '';
        const videoUrl = formData.get('videoUrl') || '';
        
        if (!password) {
          return new Response(JSON.stringify({ error: '请提供密码' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // 验证密码
        const adminPassword = await Setting.get(env.BLOG_KV, 'admin_password');
        const correctPassword = adminPassword || 'admin123';
        
        if (password !== correctPassword) {
          return new Response(JSON.stringify({ error: '密码错误' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (!title || !content) {
          return new Response(JSON.stringify({ error: '标题和内容不能为空' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // 创建文章
        const post = {
          id: generateId(),
          title: title,
          slug: generateSlug(title),
          content: content,
          category: category,
          tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : (Array.isArray(tags) ? tags : []),
          coverImage: coverImage,
          videoUrl: videoUrl,
          status: 'published',
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await Post.create(env.BLOG_KV, post);
        
        return new Response(JSON.stringify({
          success: true,
          message: '文章发布成功',
          post: {
            id: post.id,
            slug: post.slug,
            title: post.title
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    });
    
    function getContentType(ext) {
      const types = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml'
      };
      return types[ext.toLowerCase()] || 'image/jpeg';
    }
    
    // R2 公开访问路由
    router.get('/r2/:fileName', async (req, env, params) => {
      try {
        const object = await env.IMG_BUCKET.get(params.fileName);
        if (!object) {
          return new Response('Not Found', { status: 404 });
        }
        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata.contentType || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000'
          }
        });
      } catch (error) {
        return new Response('Error', { status: 500 });
      }
    });
    
    // ==================== 评论和点赞 API ====================
    
    // 提交评论
    router.post('/api/comment', async (req, env) => {
      const formData = await req.formData();
      const postId = formData.get('post_id');
      const nickname = formData.get('nickname');
      const content = formData.get('content');
      
      if (!postId || !nickname || !content) {
        return new Response(JSON.stringify({ error: '参数不完整' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 获取客户端 IP
      const ip = req.headers.get('CF-Connecting-IP') || 
                 req.headers.get('X-Forwarded-For') || 
                 'unknown';
      
      // 检查 IP 今日评论数量
      const todayCount = await Comment.getTodayCountByIP(env.BLOG_KV, ip);
      if (todayCount >= 5) {
        return new Response(JSON.stringify({ error: '您今天的评论次数已达上限（5条）' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const comment = await Comment.create(env.BLOG_KV, {
        postId,
        nickname,
        content
      }, ip);
      
      return new Response(JSON.stringify({ 
        success: true, 
        comment: {
          id: comment.id,
          nickname: comment.nickname,
          content: comment.content,
          likes: comment.likes,
          createdAt: comment.createdAt
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // 点赞评论
    router.post('/api/comment/like/:id', async (req, env, params) => {
      const ip = req.headers.get('CF-Connecting-IP') || 
                 req.headers.get('X-Forwarded-For') || 
                 'unknown';
      
      const result = await Comment.like(env.BLOG_KV, params.id, ip);
      
      if (!result) {
        return new Response(JSON.stringify({ error: '评论不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // ========== 论坛 API 路由 ==========
    // 获取话题列表
    router.get('/api/topics', async (req, env) => {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page')) || 1;
      const topics = await Topic.getAll(env.BLOG_KV, page, 20);
      return new Response(JSON.stringify(topics), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // 获取话题详情
    router.get('/api/topic/:id', async (req, env, params) => {
      const topic = await Topic.getById(env.BLOG_KV, params.id);
      if (!topic) {
        return new Response(JSON.stringify({ error: '话题不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify(topic), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // 创建话题
    router.post('/api/topic', async (req, env) => {
      const ip = req.headers.get('CF-Connecting-IP') || 
                 req.headers.get('X-Forwarded-For') || 
                 'unknown';
      
      try {
        const data = await req.json();
        const topic = await Topic.create(env.BLOG_KV, data, ip);
        return new Response(JSON.stringify({ success: true, topic }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    });
    
    // 点赞话题
    router.post('/api/topic/like/:id', async (req, env, params) => {
      const ip = req.headers.get('CF-Connecting-IP') || 
                 req.headers.get('X-Forwarded-For') || 
                 'unknown';
      
      const result = await Topic.like(env.BLOG_KV, params.id, ip);
      
      if (!result) {
        return new Response(JSON.stringify({ error: '话题不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // 获取回复列表
    router.get('/api/replies/:topicId', async (req, env, params) => {
      const replies = await TopicReply.getByTopicId(env.BLOG_KV, params.topicId);
      return new Response(JSON.stringify(replies), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // 创建回复
    router.post('/api/reply', async (req, env) => {
      const ip = req.headers.get('CF-Connecting-IP') || 
                 req.headers.get('X-Forwarded-For') || 
                 'unknown';
      
      try {
        const data = await req.json();
        const reply = await TopicReply.create(env.BLOG_KV, data, ip);
        return new Response(JSON.stringify({ success: true, reply }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    });
    
    // 点赞回复
    router.post('/api/reply/like/:id', async (req, env, params) => {
      const ip = req.headers.get('CF-Connecting-IP') || 
                 req.headers.get('X-Forwarded-For') || 
                 'unknown';
      
      const result = await TopicReply.like(env.BLOG_KV, params.id, ip);
      
      if (!result) {
        return new Response(JSON.stringify({ error: '回复不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // API 路由
    router.get('/api/posts', async (req, env) => {
      const posts = await Post.getAll(env.BLOG_KV);
      return new Response(JSON.stringify(posts), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // 初始化数据（首次使用）
    router.get('/api/init', async (req, env) => {
      // 检查是否已有数据
      const existingPosts = await env.BLOG_KV.get('posts');
      const existingData = existingPosts ? JSON.parse(existingPosts) : [];
      if (existingData.length > 0) {
        return new Response(JSON.stringify({ message: '数据已存在，无需初始化' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 初始化分类
      const categories = [
        { id: '1', name: '技术', slug: 'tech', description: '技术文章', createdAt: '2024-01-01T00:00:00Z' },
        { id: '2', name: '生活', slug: 'life', description: '生活随笔', createdAt: '2024-01-01T00:00:00Z' }
      ];
      
      // 初始化文章
      const posts = [{
        id: '1',
        title: '欢迎使用天聊博客',
        slug: 'welcome',
        content: `这是一篇示例文章，支持 **Markdown** 格式。

## 特性

- ⚡ 极速响应 - 部署在 Cloudflare 全球边缘网络
- 🆓 完全免费 - 使用 Cloudflare Workers 免费额度
- 🔒 安全可靠 - 内置 HMAC 认证机制
- 📝 Markdown 支持 - 文章支持 Markdown 格式
- 📱 响应式设计 - 适配各种设备

## 开始使用

1. 访问管理后台：${ADMIN_PREFIX}
2. 默认账号：admin / admin123
3. 创建新文章，开始你的博客之旅！

## 代码示例

\`\`\`javascript
console.log("Hello, Cloudflare Workers!");
\`\`\`

祝你使用愉快！`,
        category: 'tech',
        tags: ['intro', 'welcome'],
        status: 'published',
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
      
      await env.BLOG_KV.put('posts', JSON.stringify(posts));
      await env.BLOG_KV.put('categories', JSON.stringify(categories));
      await env.BLOG_KV.put('tags', JSON.stringify([]));
      await env.BLOG_KV.put('ads', JSON.stringify([]));
      await env.BLOG_KV.put('comments', JSON.stringify([]));
      await env.BLOG_KV.put('topics', JSON.stringify([]));
      await env.BLOG_KV.put('topic_replies', JSON.stringify([]));
      
      return new Response(JSON.stringify({ success: true, message: '数据初始化完成' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    });
    
    // 测试自动发布文章
    router.get('/api/test-auto-publish', async (req, env) => {
      // 直接调用内部发布函数，不依赖外部网络
      try {
        const topics = ['AI人工智能最新发展动态', '科技数码产品评测', '互联网行业趋势分析'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        const titles = [`${randomTopic}：2026年最新发展趋势分析`];
        const title = titles[0];
        
        const content = `# ${title}

## 引言

${randomTopic}是当前最受关注的领域之一。

## 总结

本文由AI自动生成测试。`;

        // 直接使用 Post.create 保存到数据库
        const post = {
          id: generateId(),
          title: title,
          slug: generateSlug(title),
          content: content,
          category: 'tech',
          tags: ['AI', '自动发布'],
          coverImage: '',
          videoUrl: '',
          status: 'published',
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await Post.create(env.BLOG_KV, post);
        
        return new Response(JSON.stringify({
          success: true,
          message: '文章发布成功',
          post: { id: post.id, title: post.title, slug: post.slug }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    });
    
    return router.handle();
  }
};

async function serveStatic(req, env) {
  const url = new URL(req.url);
  const path = url.pathname;
  
  // 这里可以添加静态资源的处理逻辑
  // 对于生产环境，建议使用 Cloudflare Pages 或 R2 存储静态资源
  
  return new Response('Not Found', { status: 404 });
}

// ========== 定时自动发布文章 ==========
const DEEPSEEK_API_KEY = 'sk-161eb55721b743878822d3c4329bc7b9';

addEventListener('scheduled', event => {
  const env = globalThis.blogEnv;
  event.waitUntil(autoPublishBlog(env));
});

async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      options.signal = controller.signal;
      
      const response = await fetch(url, options);
      clearTimeout(timeout);
      
      if (response.ok) {
        return response;
      }
      
      console.log(`请求失败，状态码: ${response.status}，重试 ${i + 1}/${maxRetries}`);
    } catch (error) {
      console.log(`请求错误: ${error.message}，重试 ${i + 1}/${maxRetries}`);
      if (i === maxRetries - 1) throw error;
    }
  }
  throw new Error('重试次数用尽');
}

async function autoPublishBlog(env) {
  try {
    console.log('开始自动发布文章...');
    
    const topics = [
      'AI人工智能最新发展动态',
      '科技数码产品评测',
      '互联网行业趋势分析',
      '编程技术教程',
      '生活科技小妙招'
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // 模拟生成内容（先用本地内容测试发布流程）
    const titles = [
      `${randomTopic}：2026年最新发展趋势分析`,
      `一文读懂${randomTopic}的核心要点`,
      `${randomTopic}：你不得不知道的5个技巧`,
      `深度解读${randomTopic}的未来方向`,
      `${randomTopic}实战指南：从入门到精通`
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];
    
    const content = `# ${title}

## 引言

${randomTopic}是当前最受关注的领域之一。本文将深入探讨这一主题，为读者提供全面的分析和实用的建议。

## 什么是${randomTopic}

${randomTopic}涉及到我们生活的方方面面，从技术实现到实际应用，都有着广泛的应用场景。理解这一概念对于把握时代发展脉络至关重要。

## 核心技术要点

1. **基础概念**：了解${randomTopic}的基本定义和原理
2. **技术实现**：掌握相关的核心技术和工具
3. **实践应用**：将理论应用到实际场景中
4. **优化改进**：不断迭代和优化解决方案

## 实际案例分析

在实际的开发和使用过程中，我们发现${randomTopic}的应用场景非常广泛。例如，在企业管理、个人效率提升、自动化处理等各个方面都有出色的表现。

通过不断的实践和总结，我们积累了一系列成功的案例和经验。这些案例不仅展示了${randomTopic}的强大能力，也为后来者提供了宝贵的参考。

## 未来发展趋势

展望未来，${randomTopic}将会继续快速发展。随着技术的进步和应用的深入，我们预期将看到更多创新的应用场景和解决方案。

- 智能化程度将进一步提高
- 与其他技术的融合将更加紧密
- 用户体验将持续优化
- 成本将逐步降低

## 总结

${randomTopic}是一个充满机遇和挑战的领域。无论是技术爱好者还是普通用户，都应该关注这一领域的发展。希望本文能够帮助你更好地理解和应用${randomTopic}的相关知识。

如果你对${randomTopic}感兴趣，不妨开始自己的探索之旅。记住，实践是最好的学习方法！

---

*本文由AI自动生成`;

    const bodyContent = content;

    const publishResponse = await fetch('https://www.tianliaos.com/api/publish', {
      method: 'POST',
      body: new URLSearchParams({
        password: 'admin123',
        title: title,
        content: bodyContent || content,
        category: '科技',
        tags: 'AI,自动发布,科技'
      })
    });

    const publishResult = await publishResponse.json();
    
    if (publishResult.success) {
      console.log(`文章发布成功: ${title}`);
    } else {
      console.error(`文章发布失败: ${publishResult.error}`);
    }
    
    return publishResult;
    
  } catch (error) {
    console.error('自动发布失败:', error);
    return { error: error.message };
  }
}
