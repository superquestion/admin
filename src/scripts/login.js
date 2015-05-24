$(function(){
    $('#login-form').on('submit',function(event){
        event.preventDefault();
        var url = Api.getUrl({
            domain: '',
            path: '/session/local'
        })
        var name = $('#name').val();
        var password = $("#password").val();
        var data = {
            username: name,
            password: password
        }
        Api.postData({url:url,data:data}).then(function(data){
            window.location='main.html'
        },function(args){
            if(args[0].status == 401){
                $("#login-error").html("用户名或者密码错误");
            }
        });
    })
    Api.checkLogin();
})
