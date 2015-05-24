void  function(global){
   var baseUrl = window.location.origin;
   function Api(){}
   _Api = Api.prototype;
   _Api.getResult = function(options){
       options.type = "GET";
       return this.ajax(options);
   }
   _Api.postData = function(options){
       options.type = "POST";
       return this.ajax(options);
   }
   _Api.jsonp = function(options){
       return new Promise(function(resolve, reject){
           $.ajax({
               url: options.url,
               type: options.type,
               data: options.data || null,
               dataType: "jsonp",
               success:function(data){
                   resolve(data);
               },
               error:function(xhr, status, err){
                   reject([xhr, status, err]);
               }
           })
       })

   }
   _Api.ajax = function(options){
       var _this = this;
       return new Promise(function(resolve, reject){
           $.ajax({
               url: options.url,
               type: options.type,
               data: options.data || null,
               success:function(data){
                   resolve(data);
               },
               error:function(xhr, status, err){
                    reject([xhr, status, err]);
               }
           })
       })
   }
   _Api.getUrl = function(options ,proxyUrl){
       var proxyUrl = proxyUrl || 'ajax/proxy';
       if( !options.path){
           throw 'request url is error';
       }
       if(options.domain !== baseUrl){
           return options.domain + proxyUrl +  options.path;
       }
      if(options.domain){
        return  options.domain + options.path;
      }else{
          return   options.path;
      }
   }
    // var isLogin = false;
    _Api.checkLogin = function(){
        //if(isLogin){
        //    return false;
        //}
        //isLogin = true;
        var _this = this;
            var url = _this.getUrl({
                domain: '',
                path: '/session/local'
            })
            _this.postData({url:url,data:null}).then(function(data){
                window.location='main.html';
            },function(){
                //window.location= "index.html";
            })

    }
    _Api.isLogin = function(){
        var _this = this;
        var url = _this.getUrl({
            domain: '',
            path: '/session/local'
        })
        _this.postData({url:url,data:null}).then(function(data){
            //window.location='main.html';
        },function(){
            window.location= "index.html";
        })

    }
    _Api.getUserInfo = function(){
        var _this = this;
        var url = _this.getUrl({
            domain: '',
            path: '/session/local'
        })
        return _this.postData({url:url})
    }
    _Api.parseUrl2Obj = function (url) {
        var arr = url.split("&");
        var obj = {};
        for(var i = 0,len =arr.length; i< len; i++){
            var temp = arr[i].split("=");
            for(var j= 0, x = temp.length; j < x; j++){
                obj[temp[0]]= temp[1];
            }
        }
        return obj;
    }

    global.Api = new Api();
}(window);