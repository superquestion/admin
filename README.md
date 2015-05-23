# admin

#nginx 配置
```
server {
        listen       80;
        server_name  abc.admin.net;
        root  /Users/baixing/admin/src;
        #access_log  logs/host.access.log  main;

        location / {
            index  index.html index.htm index.php;
        }
        location /ajax/proxy/ {
            proxy_pass  http://58.215.179.69:6060/;
            break;
        }
}
### nginx -s reload
### nginx -s stop
```


