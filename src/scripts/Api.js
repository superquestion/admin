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
               error:function(err){
                    reject(err);
               }
           })
       })
   }
   _Api.getUrl = function(options){
       if( !options.path){
           throw 'request url is error';
       }
       if(options.domain !== baseUrl){
           return options.domain + 'ajax/proxy' +  options.path;
       }
      if(options.domain){
        return  options.domain + options.path;
      }else{
          return   options.path;
      }
   }
    global.Api = new Api();
}(window);