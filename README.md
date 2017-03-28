# tiny
[![devDependency Status](https://david-dm.org/sparanoid/chinese-copywriting-guidelines/dev-status.svg)](#)
[![Built with Almace Scaffolding](https://d349cztnlupsuf.cloudfront.net/amsf-badge.svg)](#)

tiny 目前正在开发中, 针对PC项目,极小并且简洁的前端解决方案,包含构建工具,数据驱动UI框架,路由.

## 目录

-[路由](#路由)

### 路由

url变化时匹配
```javascript
route(function(a,b,c){// url变化时匹配 #/1/2/3
    console.log(a,b,c);//1 2 3
});
```

精确匹配
```javascript
route('/1/2', function() {// 精确匹配 #／1/2
});
```

通配符匹配
```javascript
route('/1/*', function(a) {// 通配符匹配 #／1/2
  console.log(a);// 2
});
```

..符号匹配
```javascript
route('/1/q..', function() {// 运用于查询 #/1/q?k=2&n=30
  console.log(this.query());
});
```

执行跳转
```javascript
route('#/2','标题');// 执行跳转 改变标题
```
