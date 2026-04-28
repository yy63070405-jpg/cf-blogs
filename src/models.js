// 生成唯一 ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 生成 slug
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

// 文章模型
export class Post {
  static async getAll(kv) {
    const data = await kv.get('posts');
    const posts = data ? JSON.parse(data) : [];
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  static async getById(kv, id) {
    const posts = await this.getAll(kv);
    return posts.find(p => p.id === id);
  }
  
  static async getBySlug(kv, slug) {
    const posts = await this.getAll(kv);
    return posts.find(p => p.slug === slug && p.status === 'published');
  }
  
  static async getByCategory(kv, categorySlug) {
    const posts = await this.getAll(kv);
    return posts.filter(p => p.category === categorySlug && p.status === 'published');
  }
  
  static async getByTag(kv, tagSlug) {
    const posts = await this.getAll(kv);
    return posts.filter(p => p.tags && p.tags.includes(tagSlug) && p.status === 'published');
  }
  
  static async search(kv, keyword) {
    const posts = await this.getAll(kv);
    const lowerKeyword = keyword.toLowerCase();
    return posts.filter(p => 
      p.status === 'published' && (
        p.title.toLowerCase().includes(lowerKeyword) ||
        p.content.toLowerCase().includes(lowerKeyword)
      )
    );
  }
  
  static async create(kv, data) {
    const posts = await this.getAll(kv);
    const post = {
      id: generateId(),
      title: data.title,
      slug: generateSlug(data.title),
      content: data.content,
      coverImage: data.coverImage || '',
      videoUrl: data.videoUrl || '',
      category: data.category,
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : (Array.isArray(data.tags) ? data.tags : []),
      status: data.status || 'draft',
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    posts.push(post);
    await kv.put('posts', JSON.stringify(posts));
    return post;
  }
  
  static async update(kv, id, data) {
    const posts = await this.getAll(kv);
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    posts[index] = {
      ...posts[index],
      title: data.title || posts[index].title,
      content: data.content || posts[index].content,
      coverImage: data.coverImage !== undefined ? data.coverImage : posts[index].coverImage,
      videoUrl: data.videoUrl !== undefined ? data.videoUrl : posts[index].videoUrl,
      category: data.category || posts[index].category,
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : (Array.isArray(data.tags) ? data.tags : posts[index].tags),
      status: data.status || posts[index].status,
      updatedAt: new Date().toISOString()
    };
    await kv.put('posts', JSON.stringify(posts));
    return posts[index];
  }
  
  static async delete(kv, id) {
    const posts = await this.getAll(kv);
    const filtered = posts.filter(p => p.id !== id);
    await kv.put('posts', JSON.stringify(filtered));
  }
  
  static async incrementViews(kv, slug) {
    const posts = await this.getAll(kv);
    const index = posts.findIndex(p => p.slug === slug);
    if (index !== -1) {
      posts[index].views = (posts[index].views || 0) + 1;
      await kv.put('posts', JSON.stringify(posts));
    }
  }
}

// 分类模型
export class Category {
  static async getAll(kv) {
    const data = await kv.get('categories');
    return data ? JSON.parse(data) : [];
  }
  
  static async getBySlug(kv, slug) {
    const categories = await this.getAll(kv);
    return categories.find(c => c.slug === slug);
  }
  
  static async create(kv, data) {
    const categories = await this.getAll(kv);
    const category = {
      id: generateId(),
      name: data.name,
      slug: data.slug || generateSlug(data.name),
      description: data.description || '',
      createdAt: new Date().toISOString()
    };
    categories.push(category);
    await kv.put('categories', JSON.stringify(categories));
    return category;
  }
  
  static async delete(kv, id) {
    const categories = await this.getAll(kv);
    const filtered = categories.filter(c => c.id !== id);
    await kv.put('categories', JSON.stringify(filtered));
  }
}

// 标签模型
export class Tag {
  static async getAll(kv) {
    const data = await kv.get('tags');
    return data ? JSON.parse(data) : [];
  }
  
  static async getBySlug(kv, slug) {
    const tags = await this.getAll(kv);
    return tags.find(t => t.slug === slug);
  }
  
  static async create(kv, data) {
    const tags = await this.getAll(kv);
    const tag = {
      id: generateId(),
      name: data.name,
      slug: data.slug || generateSlug(data.name),
      createdAt: new Date().toISOString()
    };
    tags.push(tag);
    await kv.put('tags', JSON.stringify(tags));
    return tag;
  }
  
  static async delete(kv, id) {
    const tags = await this.getAll(kv);
    const filtered = tags.filter(t => t.id !== id);
    await kv.put('tags', JSON.stringify(filtered));
  }
}

// 广告模型
export class Ad {
  static async getAll(kv) {
    const data = await kv.get('ads');
    return data ? JSON.parse(data) : [];
  }
  
  static async getById(kv, id) {
    const ads = await this.getAll(kv);
    return ads.find(a => a.id === id);
  }
  
  static async getByPosition(kv, position) {
    const ads = await this.getAll(kv);
    return ads.filter(a => a.position === position && a.status === 'active');
  }
  
  static async create(kv, data) {
    const ads = await this.getAll(kv);
    const ad = {
      id: generateId(),
      name: data.name,
      code: data.code,
      position: data.position || 'sidebar',
      status: data.status || 'active',
      order: parseInt(data.order) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    ads.push(ad);
    await kv.put('ads', JSON.stringify(ads));
    return ad;
  }
  
  static async update(kv, id, data) {
    const ads = await this.getAll(kv);
    const index = ads.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    ads[index] = {
      ...ads[index],
      name: data.name || ads[index].name,
      code: data.code || ads[index].code,
      position: data.position || ads[index].position,
      status: data.status || ads[index].status,
      order: parseInt(data.order) || ads[index].order,
      updatedAt: new Date().toISOString()
    };
    await kv.put('ads', JSON.stringify(ads));
    return ads[index];
  }
  
  static async delete(kv, id) {
    const ads = await this.getAll(kv);
    const filtered = ads.filter(a => a.id !== id);
    await kv.put('ads', JSON.stringify(filtered));
  }
}

// 设置模型（统计代码等）
export class Setting {
  static async get(kv, key) {
    const data = await kv.get('settings');
    const settings = data ? JSON.parse(data) : {};
    return settings[key] || null;
  }
  
  static async getAll(kv) {
    const data = await kv.get('settings');
    return data ? JSON.parse(data) : {};
  }
  
  static async set(kv, key, value) {
    const data = await kv.get('settings');
    const settings = data ? JSON.parse(data) : {};
    settings[key] = value;
    await kv.put('settings', JSON.stringify(settings));
    return settings;
  }
  
  static async delete(kv, key) {
    const data = await kv.get('settings');
    const settings = data ? JSON.parse(data) : {};
    delete settings[key];
    await kv.put('settings', JSON.stringify(settings));
    return settings;
  }
}

// 交流频道帖子模型
export class Topic {
  static async getAll(kv, page = 1, limit = 20) {
    const data = await kv.get('topics');
    const topics = data ? JSON.parse(data) : [];
    return topics
      .filter(t => t.status !== 'deleted')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice((page - 1) * limit, page * limit);
  }
  
  static async getById(kv, id) {
    const data = await kv.get('topics');
    const topics = data ? JSON.parse(data) : [];
    return topics.find(t => t.id === id && t.status !== 'deleted');
  }
  
  static async getCount(kv) {
    const data = await kv.get('topics');
    const topics = data ? JSON.parse(data) : [];
    return topics.filter(t => t.status !== 'deleted').length;
  }
  
  static async create(kv, data, ip) {
    const topics = await this.getAll(kv, 1, 10000);
    const topic = {
      id: generateId(),
      title: data.title.substring(0, 100),
      content: data.content.substring(0, 2000),
      nickname: data.nickname.substring(0, 20),
      ip: ip,
      views: 0,
      replies: 0,
      likes: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    topics.unshift(topic);
    await kv.put('topics', JSON.stringify(topics));
    return topic;
  }
  
  static async incrementViews(kv, id) {
    const topics = await this.getAll(kv, 1, 10000);
    const index = topics.findIndex(t => t.id === id);
    if (index !== -1) {
      topics[index].views = (topics[index].views || 0) + 1;
      await kv.put('topics', JSON.stringify(topics));
    }
  }
  
  static async incrementReplies(kv, id) {
    const topics = await this.getAll(kv, 1, 10000);
    const index = topics.findIndex(t => t.id === id);
    if (index !== -1) {
      topics[index].replies = (topics[index].replies || 0) + 1;
      topics[index].updatedAt = new Date().toISOString();
      await kv.put('topics', JSON.stringify(topics));
    }
  }
  
  static async like(kv, id, ip) {
    const topics = await this.getAll(kv, 1, 10000);
    const index = topics.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    const likeKey = `topic_like_${id}_${ip}`;
    const alreadyLiked = await kv.get(likeKey);
    if (alreadyLiked) {
      return { success: false, message: '已经点赞过了' };
    }
    
    topics[index].likes = (topics[index].likes || 0) + 1;
    await kv.put('topics', JSON.stringify(topics));
    await kv.put(likeKey, '1', { expirationTtl: 86400 * 365 });
    
    return { success: true, likes: topics[index].likes };
  }
  
  static async delete(kv, id) {
    const topics = await this.getAll(kv, 1, 10000);
    const index = topics.findIndex(t => t.id === id);
    if (index !== -1) {
      topics[index].status = 'deleted';
      await kv.put('topics', JSON.stringify(topics));
    }
  }
}

// 交流频道回复模型
export class TopicReply {
  static async getByTopicId(kv, topicId) {
    const data = await kv.get('topic_replies');
    const replies = data ? JSON.parse(data) : [];
    return replies
      .filter(r => r.topicId === topicId && r.status !== 'deleted')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  
  static async create(kv, data, ip) {
    const replies = await this.getAll(kv);
    const reply = {
      id: generateId(),
      topicId: data.topicId,
      content: data.content.substring(0, 1000),
      nickname: data.nickname.substring(0, 20),
      ip: ip,
      likes: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    replies.push(reply);
    await kv.put('topic_replies', JSON.stringify(replies));
    
    // 更新帖子回复数
    await Topic.incrementReplies(kv, data.topicId);
    
    return reply;
  }
  
  static async getAll(kv) {
    const data = await kv.get('topic_replies');
    return data ? JSON.parse(data) : [];
  }
  
  static async like(kv, id, ip) {
    const replies = await this.getAll(kv);
    const index = replies.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    const likeKey = `reply_like_${id}_${ip}`;
    const alreadyLiked = await kv.get(likeKey);
    if (alreadyLiked) {
      return { success: false, message: '已经点赞过了' };
    }
    
    replies[index].likes = (replies[index].likes || 0) + 1;
    await kv.put('topic_replies', JSON.stringify(replies));
    await kv.put(likeKey, '1', { expirationTtl: 86400 * 365 });
    
    return { success: true, likes: replies[index].likes };
  }
}

// 评论模型
export class Comment {
  static async getByPostId(kv, postId) {
    const data = await kv.get('comments');
    const comments = data ? JSON.parse(data) : [];
    return comments
      .filter(c => c.postId === postId && c.status !== 'deleted')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  static async getById(kv, id) {
    const data = await kv.get('comments');
    const comments = data ? JSON.parse(data) : [];
    return comments.find(c => c.id === id);
  }
  
  static async getTodayCountByIP(kv, ip) {
    const data = await kv.get('comments');
    const comments = data ? JSON.parse(data) : [];
    const today = new Date().toISOString().split('T')[0];
    return comments.filter(c => 
      c.ip === ip && 
      c.createdAt.startsWith(today)
    ).length;
  }
  
  static async create(kv, data, ip) {
    const comments = await this.getAll(kv);
    const comment = {
      id: generateId(),
      postId: data.postId,
      nickname: data.nickname.substring(0, 20),
      content: data.content.substring(0, 500),
      ip: ip,
      likes: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    comments.push(comment);
    await kv.put('comments', JSON.stringify(comments));
    return comment;
  }
  
  static async getAll(kv) {
    const data = await kv.get('comments');
    return data ? JSON.parse(data) : [];
  }
  
  static async like(kv, id, ip) {
    const comments = await this.getAll(kv);
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    const likeKey = `like_${id}_${ip}`;
    const alreadyLiked = await kv.get(likeKey);
    if (alreadyLiked) {
      return { success: false, message: '已经点赞过了' };
    }
    
    comments[index].likes = (comments[index].likes || 0) + 1;
    await kv.put('comments', JSON.stringify(comments));
    await kv.put(likeKey, '1', { expirationTtl: 86400 * 365 });
    
    return { success: true, likes: comments[index].likes };
  }
  
  static async delete(kv, id) {
    const comments = await this.getAll(kv);
    const index = comments.findIndex(c => c.id === id);
    if (index !== -1) {
      comments[index].status = 'deleted';
      await kv.put('comments', JSON.stringify(comments));
    }
  }
}

// 用户模型
export class User {
  static async generateToken(env) {
    const timestamp = Date.now();
    const data = `${env.ADMIN_USERNAME}:${timestamp}:${env.ADMIN_PASSWORD}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(env.ADMIN_PASSWORD),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    const hash = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return `${timestamp}.${hash}`;
  }
  
  static async verifyToken(request, env) {
    const cookie = request.headers.get('Cookie');
    if (!cookie) return false;
    
    const match = cookie.match(/token=([^;]+)/);
    if (!match) return false;
    
    const token = match[1];
    const [timestamp, hash] = token.split('.');
    
    if (!timestamp || !hash) return false;
    
    // 检查 token 是否过期（24小时）
    if (Date.now() - parseInt(timestamp) > 86400000) return false;
    
    // 验证签名
    const data = `${env.ADMIN_USERNAME}:${timestamp}:${env.ADMIN_PASSWORD}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(env.ADMIN_PASSWORD),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    const expectedHash = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return hash === expectedHash;
  }
}

// 访问日志模型
export class VisitLog {
  static async getAll(kv, page = 1, limit = 100) {
    const data = await kv.get('visit_logs');
    const logs = data ? JSON.parse(data) : [];
    return logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice((page - 1) * limit, page * limit);
  }
  
  static async getCount(kv) {
    const data = await kv.get('visit_logs');
    const logs = data ? JSON.parse(data) : [];
    return logs.length;
  }
  
  static async create(kv, data) {
    const logs = await this.getAll(kv, 1, 10000);
    const log = {
      id: generateId(),
      path: data.path || '/',
      method: data.method || 'GET',
      ip: data.ip || 'unknown',
      userAgent: data.userAgent || '',
      referer: data.referer || '',
      country: data.country || '',
      city: data.city || '',
      isBot: data.isBot || false,
      botName: data.botName || '',
      timestamp: new Date().toISOString()
    };
    logs.unshift(log);
    
    const maxLogs = 5000;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // 保留近7天数据和最多5000条记录
    const filteredLogs = logs.filter(l => {
      const logDate = new Date(l.timestamp);
      return logDate >= sevenDaysAgo || logs.indexOf(l) < maxLogs;
    }).slice(0, maxLogs);
    
    await kv.put('visit_logs', JSON.stringify(filteredLogs));
    return log;
  }
  
  static async getStats(kv) {
    const data = await kv.get('visit_logs');
    const logs = data ? JSON.parse(data) : [];
    
    const now = new Date();
    const today = now.toDateString();
    
    // 每天零点归零，保留近7天数据
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // 过滤近7天数据
    const recentLogs = logs.filter(l => new Date(l.timestamp) >= sevenDaysAgo);
    
    // 按日期分组
    const dailyStats = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toDateString();
      dailyStats[dateStr] = {
        date: dateStr,
        dateShort: `${date.getMonth() + 1}/${date.getDate()}`,
        pv: 0,
        uv: new Set(),
        humans: 0,
        bots: 0
      };
    }
    
    const bots = [];
    const humans = [];
    const pathStats = {};
    const countryStats = {};
    const osStats = {};
    const searchSourceStats = {};
    const keywordStats = {};
    const refererStats = {};
    const botStats = {};
    
    const searchEngines = [
      { name: '百度', host: 'baidu.com', query: 'wd' },
      { name: '百度', host: 'baidu.com', query: 'word' },
      { name: '搜狗', host: 'sogou.com', query: 'query' },
      { name: '360', host: 'so.com', query: 'q' },
      { name: 'Google', host: 'google.com', query: 'q' },
      { name: 'Google', host: 'google.com.hk', query: 'q' },
      { name: '必应', host: 'bing.com', query: 'q' },
      { name: '神马', host: 'm.sm.cn', query: 'q' }
    ];
    
    // 解析User-Agent提取OS
    function parseOS(userAgent) {
      if (!userAgent) return '未知';
      if (userAgent.includes('Windows')) return 'Windows';
      if (userAgent.includes('Mac OS') || userAgent.includes('Macintosh')) return 'macOS';
      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
      if (userAgent.includes('Android')) return 'Android';
      if (userAgent.includes('Linux')) return 'Linux';
      if (userAgent.includes('Ubuntu')) return 'Ubuntu';
      if (userAgent.includes('Debian')) return 'Debian';
      if (userAgent.includes('Fedora')) return 'Fedora';
      if (userAgent.includes('Chrome OS')) return 'Chrome OS';
      return '其他';
    }
    
    logs.forEach(l => {
      const logDate = new Date(l.timestamp).toDateString();
      
      // 收集每日数据
      if (dailyStats[logDate]) {
        dailyStats[logDate].pv++;
        dailyStats[logDate].uv.add(l.ip);
        if (l.isBot) {
          dailyStats[logDate].bots++;
        } else {
          dailyStats[logDate].humans++;
        }
      }
      
      // 分类机器人和访客
      if (l.isBot) {
        bots.push(l);
        if (l.botName) {
          botStats[l.botName] = (botStats[l.botName] || 0) + 1;
        }
      } else {
        humans.push(l);
      }
      
      // 页面统计
      if (!l.isBot) {
        pathStats[l.path] = (pathStats[l.path] || 0) + 1;
      }
      
      // 地区统计
      if (l.country && !l.isBot) {
        countryStats[l.country] = (countryStats[l.country] || 0) + 1;
      }
      
      // OS统计
      if (!l.isBot) {
        const os = parseOS(l.userAgent);
        osStats[os] = (osStats[os] || 0) + 1;
      }
      
      // 来源统计
      if (l.referer && !l.isBot && !l.referer.includes('tianliaos.com')) {
        try {
          const refererUrl = new URL(l.referer);
          const host = refererUrl.hostname;
          
          let foundSearchEngine = false;
          for (const engine of searchEngines) {
            if (host.includes(engine.host)) {
              searchSourceStats[engine.name] = (searchSourceStats[engine.name] || 0) + 1;
              const keyword = refererUrl.searchParams.get(engine.query);
              if (keyword) {
                const key = `${engine.name}: ${decodeURIComponent(keyword)}`;
                keywordStats[key] = (keywordStats[key] || 0) + 1;
              }
              foundSearchEngine = true;
              break;
            }
          }
          
          if (!foundSearchEngine) {
            refererStats[host || '直接访问'] = (refererStats[host || '直接访问'] || 0) + 1;
          }
        } catch (e) {
          refererStats['直接访问'] = (refererStats['直接访问'] || 0) + 1;
        }
      } else if (!l.referer || l.referer.includes('tianliaos.com')) {
        if (!l.isBot) {
          refererStats['直接访问'] = (refererStats['直接访问'] || 0) + 1;
        }
      }
    });
    
    // 转换每日数据
    const dailyData = Object.values(dailyStats).reverse().map(d => ({
      ...d,
      uv: d.uv.size
    }));
    
    // 今日数据
    const todayData = dailyStats[today] || { pv: 0, uv: new Set(), humans: 0, bots: 0 };
    const todayUV = new Set(todayData.uv?.size ? todayData.uv : []);
    
    // 在线人数
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const onlineUsers = new Set(
      logs.filter(l => !l.isBot && new Date(l.timestamp) > fiveMinutesAgo).map(l => l.ip)
    ).size;
    
    return {
      total: logs.length,
      today: todayData.pv || 0,
      uv: dailyStats[today]?.uv?.size || 0,
      online: onlineUsers,
      bots: bots.length,
      humans: humans.length,
      dailyData: dailyData,
      pathStats: Object.entries(pathStats).sort((a, b) => b[1] - a[1]).slice(0, 10),
      countryStats: Object.entries(countryStats).sort((a, b) => b[1] - a[1]).slice(0, 10),
      osStats: Object.entries(osStats).sort((a, b) => b[1] - a[1]).slice(0, 10),
      searchSourceStats: Object.entries(searchSourceStats).sort((a, b) => b[1] - a[1]).slice(0, 10),
      keywordStats: Object.entries(keywordStats).sort((a, b) => b[1] - a[1]).slice(0, 10),
      refererStats: Object.entries(refererStats).sort((a, b) => b[1] - a[1]).slice(0, 10),
      botStats: Object.entries(botStats).sort((a, b) => b[1] - a[1]).slice(0, 10)
    };
  }
  
  static async clear(kv) {
    await kv.put('visit_logs', JSON.stringify([]));
  }
}
