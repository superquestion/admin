function type(obj){
    var type;
    if (obj == null) {
        type = String(obj);
    } else {
        type =  Object.prototype.toString.call(obj).toLowerCase();
        type = type.substring(8, type.length - 1);
    }
    return type;
}
function each(obj, iterator, context){
    var hasOwn = Object.prototype.hasOwnProperty;
    var i, l, t;
    if (typeof obj !== 'object') return;

    t = type(obj);
    context = context || obj;
    if (t === 'array' || t === 'arguments' || t === 'nodelist') {
        for (i=0, l=obj.length; i<l; i++) {
            if (iterator.call(context, obj[i], i, obj) === false) return;
        }
    } else {
        for (i in obj) {
            if (hasOwn.call(obj, i)) {
                if (iterator.call(context, obj[i], i, obj) === false) return;
            }
        }
    }
}
function isPlainObject(obj) {
    var hasOwn = Object.prototype.hasOwnProperty;
    var key;
    if (!obj || type(obj) !== 'object' ||
        obj.nodeType || 'setInterval' in obj) {
        return false;
    }

    if (obj.constructor &&
        !hasOwn.call(obj, 'constructor') &&
        !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
        return false;
    }

    for (key in obj) {}
    return key === undefined || hasOwn.call(obj, key);
}

function extend(){
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && type(target) !== 'function') {
        target = {};
    }

    // extend caller itself if only one argument is passed
    if (length === i) {
        target = this;
        --i;
    }

    for (; i<length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = type(copy) === 'array'))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && type(src) === 'array' ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
}

var noHashChangeEvent = !('onhashchange' in window),
    slice = Array.prototype.slice,
    decode = window.decodeURIComponent;

/**
 @example
 normalize('path/to/page#hash'); // -> /path/to/page
 */
function normalize(path) {
    path = path.replace(/^#!?/, '').replace(/#.*/, '');
    path = (path.length > 0 && path[0] !== '/') ? '/' + path : path;
    return path;
}

/**
 Parse search string to params object
 @param {String} search
 @returns {Object} params
 */
function parseSearch(search) {
    // var query = search[0] === '?' ? search.slice(1) : search,
    var query = search.indexOf('?') === 0 ? search.slice(1) : search,
    // Fragment shouldn't contain `&`, use `!!` instead
    // http://tools.ietf.org/html/rfc3986
    // @example #!/wallpaper?super=beauty!!sub=nude
        pairs = query.length > 0 ? query.split('!!') : [],
        params = {};

    each(pairs, function (pair) {
        pair = pair.replace(/\+/g, '%20');

        var i = pair.indexOf('='),
            key = ~i ? pair.slice(0, i) : pair,
            value = ~i ? pair.slice(i + 1) : '';

        try {
            key = decode(key);
            value = decode(value);
        } catch (e) {}

        params[key] = value;
    });

    return params;
}

/**
 Parse params object to search string
 @param {Object} params
 @returns {String} search
 */
function parseParam(data) {
    var stack = [],
        query;
    each(data, function (value, key) {
        stack.push(key + '=' + value);
    });
    query = stack.join('!!').replace(/\s/g, '+');
    return query;
}

// path 支持字符串和数组两种形式
// 数组的规则为 ['/a/b', 'c', {d: 1, e: 2}] => '#!/a/b/c?d=1!!e=2'
function Context(path, state) {
    //path = decodeURI(path);
    var hashbang = location.hash.length === 0 || /^#!/.test(location.hash),
        item,
        queries = {},
        i;

    if (type(path) === 'array' && path.length >= 0) {
        this.path = '';
        while (path.length) {
            item = path.shift();
            if (type(item) === 'string') {
                this.path += normalize(item);
            }
            else {
                queries = extend(queries, item);
            }
        }
        this.path += (this.path.indexOf('?') < 0 ? '?' : '&') + parseParam(queries);
    }
    else {
        this.path = normalize(path);
    }

    path = this.path;

    this.state = state || {};
    this.target = path ? '#' + (hashbang ? '!' : '') + path : path;

    i = path.indexOf('?');
    this.pathname = ~i ? path.slice(0, i) : path;
    this.search = ~i ? path.slice(i) : '';
    this.queries = parseSearch(this.search);
    this.params = {};
    this.dispatch = true;
}

/**
 @example
 router('*', handler);
 router('/user/:id', load, user);
 router('/user/' + user.id, {some: 'thing'});
 router('/user/' + user.id);
 router(options);
 */
function router(path, state) {
    if (type(state) === 'function') {
        router.bind.apply(router, arguments);
    } else if (type(path) === 'string') {
        router.route(path, state);
    } else {
        router.start(path);
    }
}

router.running = false;    // router 工作状态
router.next = null;        // 当前正在进行的 dispatch 任务指针
router.context = null;     // 当前的上下文对象缓存
router.contexts = [];      // context 堆栈
router.handlers = [];      // 全部 middleware

function onhashchange() {
    var ctx = router.contexts.pop();
    if (!ctx) {
        ctx = new Context(location.hash);
    }
    router.context = ctx;

    if (ctx.dispatch === false) {
        return;
    }
    router.dispatch(ctx);
}

router.start = function () {
    if (this.running) {
        return;
    }
    this.running = true;
    if ('addEventListener' in window) {
        window.addEventListener('hashchange', onhashchange, false);
    }
    else if (!noHashChangeEvent) {
        window.onhashchange = onhashchange;
    }
    onhashchange();
};

router.stop = function () {
    this.running = false;
    if ('removeEventListener' in window) {
        window.removeEventListener('hashchange', onhashchange, false);
    }
    else if (!noHashChangeEvent) {
        window.onhashchange = null;
    }
};

router.bind = function (pattern /*, handler1, handler2, ... */) {
    var handlers = slice.call(arguments, 1);
    each(handlers, function (handler) {
        this.handlers.push(this.middleware(pattern, handler));
    }, this);
};

router.unbind = function (pattern /*, handler1, handler2, ... */) {
    var handlers = slice.call(arguments, 1);
    each(handlers, function (handler) {
        var middlewares = this.handlers,
            next = this.next,
            i = 0,
            l = middlewares.length;
        for (; i < l; i++) {
            // 使用 pattern 和 handler 可以唯一确定一个 middleware
            if (middlewares[i]._pattern === pattern &&
                middlewares[i]._handler === handler) {
                middlewares.splice(i, 1);
                // 调整删除 handler 后 router.dispatch 中的指针位置
                if (next && next.index - 1 <= i) {
                    next.index = next.index - 1;
                }
                i = i - 1;
                l = l - 1;
            }
        }
    }, this);
};

router.reset = function () {
    this.next = null;
    this.contexts.length = 0;
    this.handlers.length = 0;
};

router.route = function (path, state, dispatch) {
    if (type(state) === 'boolean') {
        dispatch = state;
        state = null;
    }
    var ctx = new Context(path, state);
    ctx.dispatch = dispatch;
    if (router.context.target !== ctx.target) {
        this.contexts.push(ctx);
        location.href = ctx.target;
        // IE7及以下没有hashchange事件，手动触发
        if (noHashChangeEvent && this.running) {
            onhashchange();
        }
    }
    return ctx;
};

router.replace = function (path, state, dispatch) {
    if (type(state) === 'boolean') {
        dispatch = state;
        state = null;
    }
    var ctx = new Context(path, state);
    ctx.dispatch = dispatch;
    if (router.context.target !== ctx.target) {
        this.contexts.push(ctx);
        location.replace(ctx.target);
        // IE7及以下没有hashchange事件，手动触发
        if (noHashChangeEvent && this.running) {
            onhashchange();
        }
    }
    return ctx;
};

router.middleware = function (pattern, handler) {
    var that = this;
    function middleware(ctx, next) {
        if (that.match(pattern, ctx.pathname, ctx.params)) {
            handler(ctx, next);
        } else {
            next();
        }
    }
    // for unbind
    middleware._pattern = pattern;
    middleware._handler = handler;
    return middleware;
};

router.back = function () {
    // todo IE兼容性
    history.back();
    if (noHashChangeEvent){
        this.route(location.hash);
    }
};

router.match = function (pattern, pathname, params) {
    var keys = [];
    pattern = pattern.replace(/:(\w+)/g, function (_, key) {
        keys.push(key);
        return '([^\/]+)';
    }).replace(/\*/g, '(.*)') || '';
    pattern = '^' + pattern + '$';

    var match = pathname.match(new RegExp(pattern));
    if (!match) {
        return false;
    }

    each(keys, function (key, i) {
        params[key] = match[i + 1];
    });
    return true;
};

router.dispatch = function (ctx) {
    var handlers = this.handlers;

    // dispatch 指针
    function next() {
        var middleware = handlers[next.index++];
        if (middleware) {
            middleware(ctx, next);
        }
    }

    // 检查正在 dispatch 的任务
    // 若上一次 dispatch 未完成，则强制停止
    if (this.next) {
        this.next.index = handlers.length;
    }

    // 保存当前的 dispatch 指针
    this.next = next;
    next.index = 0;
    next();
};

router._normalize = normalize;
router._parseSearch = parseSearch;
router._Context = Context;