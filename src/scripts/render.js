void  function(global){
    function Render(){
    }
    _render = Render.prototype;
    var templates = {};
    _render.getTemplate = function(name){
        if(templates[name]){
            return templates[name];
        }
        var n = name.spilt(".");
        var url = 'template/' + n.join('/') + '.html';
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            success:function(data){
                templates[name] = data;
                return data;
            },
            error:function(err){
                throw err;
            }
        })
    };
    _render.template = function(name,data){
        var source = this.getTemplate(name);
        var render = template.compile(source);
        return render(data);
    }
    _render.renderById = function(id, data){
        return template.render(id, data);
    }
    window.render = new Render();
}(window);