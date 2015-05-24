var site = site || {};
site.views = [
    {name: "list"},
    {name: "post"}
];
site.status = {
    list: false,
    post: false
}

var lastView;
site.load = function(context, preload){
    var name = context.pathname.substr(1);
    //var pages = $(".site-view");
    var container = document.getElementById('site-views');
    var pages = container.querySelectorAll('[data-page]');
    each(pages, function(dom){
        var p = dom.getAttribute('data-page');
        if(p !== lastView){
            dom.innerHTML = '';
        }
        var clazz = ' ' + dom.className;
        dom.className = clazz.replace(/\s+current\b/, '').trim();
    });
    lastView = name;
    if(name === lastView){
        var  dom = $('.site-view[data-page="' + name + '"]');
        if(dom){
            if(!dom.innerHTML){
                //render
                controller[name] &&  controller[name]().render(context, dom);
            }
            dom.addClass("current");
        }

    }
    $('.nav li').removeClass('active');
    $('.nav li[data-page="'+ name +'"]').addClass('active');

}

site.title = function(title){
    document.title = title;
}
site.render = function(dom){
    var tpl = __inline("view");
    var render = template.compile(tpl);
    dom.innerHTML = render({
        views: site.views
    });
    //controller["footer"]().render($("#site-footer"));
};