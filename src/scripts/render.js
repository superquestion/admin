//void  function(global){
//    function Render(){
//    }
//    _render = Render.prototype;
//    var templates = {};
//    _render.getTemplate = function(name){
//        if(templates[name]){
//            return templates[name];
//        }
//        var n = name.spilt(".");
//        var url = 'template/' + n.join('/') + '.html';
//        $.ajax({
//            type: 'GET',
//            url: url,
//            async: false,
//            success:function(data){
//                templates[name] = data;
//                return data;
//            },
//            error:function(err){
//                throw err;
//            }
//        })
//    };
//    _render.template = function(name,data){
//        var source = this.getTemplate(name);
//        var render = template.compile(source);
//        return render(data);
//    }
//    _render.renderById = function(id, data){
//        return template.render(id, data);
//    }
//    window.render = new Render();
//}(window);

var templates = {};
function __inline(name){
       var tpl = '';
       if(templates[name]){
           return templates[name];
       }
       var url = 'template/' +name + '.html';
       $.ajax({
           type: 'GET',
            url: url,
            async: false,
            success:function(data){
                tpl = data;
            },
            error:function(err){
                throw err;
            }
        })
    return tpl;
}


/**
 * 对日期进行格式化，
 * @param date 要格式化的日期
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有：
 *     y:年,
 *     M:年中的月份(1-12),
 *     d:月份中的天(1-31),
 *     h:小时(0-23),
 *     m:分(0-59),
 *     s:秒(0-59),
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang
 * @see	http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
 */
template.helper('dateFormat', function (date, format) {
    //console.log(date)
    date = new Date(date);
   // console.log(new Date(date).getMonth())
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
            if(all.length > 1){
                v = '0' + v;
                v = v.substr(v.length-2);
            }
            return v;
        }
        else if(t === 'y'){
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    //console.log(format)
    return format;
});
template.helper('list', function (index) {
    var map = {
         1: "电子",
         2:"航空" ,
         3 :"食品",
         4: "服务",
         5: "金融",
         6: "互联网",
         7: "通信",
         8 :"化妆品"
    }
    //console.log(map[index])
   return map[index];
});

