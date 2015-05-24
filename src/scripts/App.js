
var  App = App || {};
App.run = function(){
    site.render(document.getElementById('main'));
    router('/list', function(ctx){
        site.load(ctx);
    })
    router("/post", function(ctx){
        site.load(ctx);
    })
    router('', function(){
        router.replace('/list');
    });
    router();
}
App.run();


