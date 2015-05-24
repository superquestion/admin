var controller = controller || {};

controller.post = function(context, container){
    function _bindEvent(){
        $("#post-form").on("submit", function(event){
            event.preventDefault();
            var url = $(this).serialize();
            //var promise = Api.getUserInfo();
            var params = Api.parseUrl2Obj(url);
            params.pic= "http://3p.pic.ttdtweb.com/api.songlist.ttpod.com/cover/5b_1432003208406/f97d2684/287256_346000538.jpg";
            var userInfo = Api.getUserInfo();
            var  post = userInfo.then(function(data){
                data = $.parseJSON(data);
                var id = data.id;
                params.advertiser_id = id;
                //params.access_token = data.token;
                var url = Api.getUrl({domain:'',path: '/' + id + '/merchant/ad'}, 'post/ajax/proxy');
                return Api.postData({url:url + '?access_token='+ data.token, data:params});
            })
            post.then(function(data){

            });
        })
        $("#file").on("change",function(event){
            var file = event.target.files[0];
            var fd = new FormData();
            fd.append('file', file);
            $.ajax({
                url: "http://58.215.179.109:7060/image/test/",
                type: "POST",
                data: fd,
                processData: false,
                contentType: false,
                success:function(data){
                    $("#pic").val(data);
                    $(".preview").html('<img src="'+data+'">');
                },
                error:function(){
                    alert('上传失败');
                }
            });
        })
    }
    function _render(context,container){
        Api.isLogin();
        var name = context.pathname.substr(1);
        var tpl = __inline(name);
        var render = template.compile(tpl);
        container.html(render({}));
         _bindEvent();
    }

    return {
        render: _render
    }
}
controller.list = function(context, container){
    function _render(context,container){
        Api.isLogin();
        var name = context.pathname.substr(1);
        var tpl = __inline(name);
        var userInfo = Api.getUserInfo();
        var list = userInfo.then(function(data){
            data = $.parseJSON(data);
            var id = data.id;
            var token = data.token;
            var data = {token: token};
            var url  = 'http://58.215.179.69:6060/' + id +'/merchant/ad/ads?access_token=' + token;
            return Api.jsonp({url: url});
        })
        list.then(function(data){
            var render = template.compile(tpl);
            container.html(render({data:data}));
        })
    }
    return {
        render: _render
    }
}