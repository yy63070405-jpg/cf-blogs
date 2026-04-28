export class Router {
  constructor(request, env) {
    this.request = request;
    this.env = env;
    this.routes = {
      GET: [],
      POST: [],
      PUT: [],
      DELETE: []
    };
  }
  
  get(path, handler) {
    this.routes.GET.push({ path, handler, pattern: this._createPattern(path) });
  }
  
  post(path, handler) {
    this.routes.POST.push({ path, handler, pattern: this._createPattern(path) });
  }
  
  put(path, handler) {
    this.routes.PUT.push({ path, handler, pattern: this._createPattern(path) });
  }
  
  delete(path, handler) {
    this.routes.DELETE.push({ path, handler, pattern: this._createPattern(path) });
  }
  
  _createPattern(path) {
    // 将 :param 转换为正则表达式
    const regexPath = path
      .replace(/:([^/]+)/g, '(?<$1>[^/]+)')
      .replace(/\*/g, '.*');
    return new RegExp(`^${regexPath}$`);
  }
  
  async handle() {
    const url = new URL(this.request.url);
    const pathname = url.pathname;
    const method = this.request.method;
    
    const routes = this.routes[method] || [];
    
    for (const route of routes) {
      const match = pathname.match(route.pattern);
      if (match) {
        const params = match.groups || {};
        try {
          return await route.handler(this.request, this.env, params);
        } catch (error) {
          console.error('Route handler error:', error);
          return new Response('Internal Server Error', { status: 500 });
        }
      }
    }
    
    return new Response('Not Found', { status: 404 });
  }
}
