var route=(function(win){
    'use strict';
    var current=getPath(),
        hash=win.location.hash;
    var observable=function(el){
        el=el||{};
        var callbacks={},
            slice=Array.prototype.slice;
        Object.defineProperties(el,{
            on:{
                value:function(event,fn){
                    if(typeof fn=='function'){
                        (callbacks[event]=callbacks[event]||[]).push(fn);
                    }
                    return el;
                },
                enumerable:false,
                writable:false,
                configurable:false
            },
            off:{
                value:function(event,fn){
                    if(event == '*' && !fn){
                        callbacks={};
                    }else{
                        if(fn){
                            var arr=callbacks[event];
                            for(var i=0,cb;cb=arr && arr[i];++i){
                                if(cb==fn){
                                    arr.splice(i--,1);
                                }
                            }
                        }else{
                            delete callbacks[event];
                        }
                    }
                    return el;
                },
                enumerable:false,
                writable:false,
                configurable:false
            },
            one:{
                value:function(event,fn){
                    function on(){
                        el.off(event,on);
                        fn.apply(el,arguments);
                    }
                    return el.on(event,on);
                },
                enumerable:false,
                writable:false,
                configurable:false
            },
            trigger:{
                value:function(event){
                    var arguments$1=arguments;
                    var arglen=arguments.length-1,
                        args=new Array(arglen),
                        fns,
                        fn,
                        i;
                    for(i=0;i<arglen;i++){
                        args[i]=arguments$1[i+1];
                    }
                    fns=slice.call(callbacks[event] || [],0);
                    for(i=0;fn=fns[i];++i){
                        fn.apply(el,args);
                    }
                    if(callbacks['*'] && event != '*'){
                        el.trigger.apply(el,['*',event].concat(args));
                    }
                    return el;
                },
                enumerable:false,
                writable:false,
                configurable:false
            }
        });
        return el;
    };
    var observableObj=observable();
    var bindEvent=(function(win){
        if(win.addEventListener){
            return function(obj,eventName,hander){
                obj.addEventListener(eventName,hander, false);
            }
        }else if(win.attachEvent) {
            return function(obj,eventName,hander){
                obj.attachEvent('on' + eventName, hander);
            }
        }else{
            return function(obj,eventName,hander){
                obj['on' + eventName]=hander;
            }
        }
    }(win));
    var isType=(function(){
        var classType={};
        ('Boolean/Number/String/Function/Array/Date/RegExp/Object/Error').split('/').forEach(function(e,i){
            classType['[object '+e+']']=e.toLowerCase();
        });
        return function(obj){
            return (typeof obj=='object'||typeof obj=='function')?(classType[classType.toString.call(obj)]||'object'):(typeof obj);
        };
    }());
    function normalize(path){
        return path.replace(/^\/|\/$/, '');
    }
    function getPath(hash) {
        var path=((hash||(win.location.hash)).split('#')[1]) || '';
        return path;
    }
    function routers(){
        this.$=[];
        observable(this);
        observableObj.on('stop', this.s.bind(this));
        observableObj.on('emit', this.e.bind(this));
    }
    function secondParser(path,filter){
        var f=filter.replace(/\?/g,'\\?').replace(/\*/g,'([^/?#]+?)').replace(/\.\./,'.*');
        var re=new RegExp(("^" + f + "$"));
        var args=path.match(re);
        if(args){return args.slice(1);}
    }
    function parser(path) {
        return path.split(/[/?#]/);
    }
    var prot=routers.prototype;
    prot.m=function(first,second){
        if((isType(first)=='string') && (!second || (isType(second)=='string'))){
            go(first,second);
        }else if(second){
            this.r(first,second);
            emit(true);
        }else{
            this.r('@',first);
            emit(true);
        }
    };
    prot.s=function() {
        this.off('*');
        this.$=[];
    };
    prot.e = function(path) {
        this.$.concat('@').some(function(filter) {
            var args = (filter === '@' ? parser : secondParser)(normalize(path), normalize(filter));
            if (typeof args != 'undefined') {
                this['trigger'].apply(null, [filter].concat(args));
            }
        },this);
    };
    prot.r = function(filter, action) {
        if (filter !== '@') {
            filter = '/' + normalize(filter);
            this.$.push(filter);
        }
        this.on(filter, action);
    };
    prot.query=function(){
        var q={},
            href=win.location.href || current;
        href.replace(/[?&](.+?)=([^&]*)/g,function(_,k,v){
            q[k]=v;
        });
        return q;
    };

    var mainRouter=new routers();
    var route=mainRouter.m.bind(mainRouter);
    function go(path,title){
        title=title||win.document.title;
        win.document.title=title;
        win.location.hash=path;
        return true;
    }
    function emit(force){
        var path=getPath();
        if(force||path!==current){
            observableObj['trigger']('emit',path);
            current=path;
        }
    }
    function deDelay(fn,delay){
        var t;
        return function(){
            clearTimeout(t);
            t=setTimeout(fn,delay);
        }
    }
    bindEvent(window,'hashchange',(deDelay(emit,1)));
    return route;
}(window));