/**
 * Created by CC on 2017/3/28.
 */
(function(window, document){
    var ua = navigator.userAgent.toLowerCase();

    var C = function(selector) {
        return new C.prototype.init(selector);
    };

    /************************* 定义静态方法:start ************************/
    C.tools = C.utils = {
        ua      : navigator.userAgent.toLowerCase(),
        browser : {
            trident : /trident/.test(ua),//IE内核
            mobile  : !!ua.match(/applewebkit.*mobile.*/) || !!ua.match(/applewebkit/),
            android : /android/.test(ua) || /linux/.test(ua),
            ios     : !!ua.match(/\(i[^;]+;( u;)? cpu.+mac os x/)
        },

        /************************* 函数区:start ************************/
        //判断字符串是否为空
        empty : function(data) {
            if (typeof(data) == "undefined") return true;
            if (!data) return true;
            if ((typeof(data) == "string") && data.replace(/(^s*)|(s*$)/g, "").length == 0) return true;
            return false;
        },
        //  计算时间差
        dateTimeDiff : function(inputDate, beCompareDate) {
            var inputDate=inputDate;  //开始时间
            var nowDate=beCompareDate || new Date().getTime(); //结束时间
            var date3=nowDate-inputDate;          //时间差的毫秒数
            //计算出相差天数
            var days=Math.floor(date3/(24*3600*1000));
            //计算出小时数
            var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
            var hours=Math.floor(leave1/(3600*1000));
            //计算相差分钟数
            var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
            var minutes=Math.floor(leave2/(60*1000));
            //计算相差秒数
            var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
            var seconds=Math.round(leave3/1000);
            var timeDiff = [days, hours, minutes, seconds];
            console.log(days+'天'+hours+'小时'+minutes+'分'+seconds+'秒');
            return timeDiff;
        },
        //显示当前日期
        //显示年月日 yyyy-MM-dd
        //显示年月日小时分钟 yyyy-MM-dd HH:mm
        now   : function(format) {
            format = format || 'yyyy-MM-dd hh:mm';
            var newDate = new Date();
            return newDate.format(format);
        },
        // 上几个月
        nowBack: function(months){
            var date = new Date();
            date.setMonth(date.getMonth() - months);
            return date.format('yyyy-MM-dd');
        },
        /************************* 函数区:  end ************************/
    };
    /************************* 定义静态方法:  end ************************/

    C.each = function(obj, callback) {
        var len = obj.length,
            i = 0;

        if (obj.constructor === window.$$ || obj.constructor === window.$C) {
            for (; i < len; i++) {
                var val = callback.call(obj[i],i,obj[i]);
                if(val === false) break;
            }
        } else if (Array.isArray(obj)) {
            for (; i < len; i++) {
                var val = callback.call(obj[i],i,obj[i]);
                if(val === false) break;
            }
        } else {
            for( i in obj ) {
                if ( i === 'length' || i=== 'item' ) return;
                var val = callback.call(obj[i],i,obj[i]);
                if ( val === false ) break;
            }
        }
    };

    C.ready = window.ready = function(fn) {
        if(document.addEventListener){//兼容非IE
            document.addEventListener("DOMContentLoaded",function(){
                //注销事件，避免反复触发
                document.removeEventListener("DOMContentLoaded",arguments.callee,false);
                fn();//调用参数函数
            },false);
        }else if(document.attachEvent){//兼容IE
            IEContentLoaded (window, fn);
        }

        function IEContentLoaded (w, fn) {
            var d = w.document, done = false,
            // only fire once
                init = function () {
                    if (!done) {
                        done = true;
                        fn();
                    }
                };
            // polling for no errors
            (function () {
                try {
                    // throws errors until after ondocumentready
                    d.documentElement.doScroll('left');
                } catch (e) {
                    setTimeout(arguments.callee, 50);
                    return;
                }
                // no errors, fire

                init();
            })();
            // trying to always fire before onload
            d.onreadystatechange = function() {
                if (d.readyState == 'complete') {
                    d.onreadystatechange = null;
                    init();
                }
            };
        }
    };

    C.prototype =  {
        constructor : C,
        //dom选择的一些判断
        init : function(selector) {
            if(!selector) { return this; }

            if (typeof selector == 'object') {
                var selector = [selector];
                for (var i = 0; i < selector.length; i++) {
                    this[i] = selector[i];
                }
                this.length = selector.length;
                return this;
            } else if (typeof selector == 'function') {
                this.ready(selector);
                return;
            } else {
                var selector = selector.trim(), result;
                if (selector.charAt(0) == '#' && !selector.match('\\s')) {
                    selector = selector.substring(1);
                    result = document.getElementById(selector);
                    return result;
                } else {
                    result = document.querySelectorAll(selector);
                    // result.selector = selector;
                    return result;
                    // for (var i = 0; i < result.length; i++) {
                    //   this[i] = result[i];
                    // }
                    // this.selector = selector;
                    // this.length = result.length;
                    // return this;
                }
                // var result = Sizzle(selector);
                // if (result.length == 1) result = result[0];
                // return result;
            }
        },
        ready: function(fn) {
            document.addEventListener('DOMContentLoaded',function() {
                fn && fn();
            },false);
            document.removeEventListener('DOMContentLoaded',fn,true);
        },
        attr : function(el, name, value){
            if(!this.isElement(el)){
                C.eleNoInfo('attr');
                return;
            }
            if(arguments.length == 2){
                return el.getAttribute(name);
            }else if(arguments.length == 3){
                el.setAttribute(name, value);
                return el;
            }
        },
        dom : function(el, selector){
            if(arguments.length === 1 && typeof arguments[0] == 'string'){
                if(document.querySelector){
                    return document.querySelector(arguments[0]);
                }
            }else if(arguments.length === 2){
                if(el.querySelector){
                    return el.querySelector(selector);
                }
            }
        },
        prepend : function(el, html){
            if(!this.isElement(el)){
                C.eleNoInfo('prepend');
                return;
            }
            el.insertAdjacentHTML('afterbegin', html);
            return el;
        },
        append : function(el, html){
            if(!this.isElement(el)){
                C.eleNoInfo('append');
                return;
            }
            el.insertAdjacentHTML('beforeend', html);
            return el;
        },
        before : function(el, html){
            if(!this.isElement(el)){
                C.eleNoInfo('before');
                return;
            }
            el.insertAdjacentHTML('beforebegin', html);
            return el;
        },
        after : function(el, html){
            if(!this.isElement(el)){
                C.eleNoInfo('after');
                return;
            }
            el.insertAdjacentHTML('afterend', html);
            return el;
        },
        html : function(el, html){
            if(!this.isElement(el)){
                C.eleNoInfo('html');
                return;
            }
            if(arguments.length === 1){
                return el.innerHTML;
            }else if(arguments.length === 2){
                el.innerHTML = html;
                return el;
            }
        },
        text : function(el, txt){
            if(!this.isElement(el)){
                C.eleNoInfo('text');
                return;
            }
            if(arguments.length === 1){
                return el.textContent;
            }else if(arguments.length === 2){
                el.textContent = txt;
                return el;
            }
        },
        val : function(el, val){
            if(!this.isElement(el)){
                C.eleNoInfo('val');
                return;
            }
            if(arguments.length === 1){
                switch(el.tagName){
                    case 'SELECT':
                        var value = el.options[el.selectedIndex].value;
                        return value;
                        break;
                    case 'INPUT':
                        return el.value;
                        break;
                    case 'TEXTAREA':
                        return el.value;
                        break;
                }
            }
            if(arguments.length === 2){
                switch(el.tagName){
                    case 'SELECT':
                        el.options[el.selectedIndex].value = val;
                        return el;
                        break;
                    case 'INPUT':
                        el.value = val;
                        return el;
                        break;
                    case 'TEXTAREA':
                        el.value = val;
                        return el;
                        break;
                }
            }
        },
        css : function(el, css){
            if(!this.isElement(el)){
                C.eleNoInfo('css');
                return;
            }
            if(typeof css == 'string' && css.indexOf(':') > 0){
                el.style && (el.style.cssText += ';' + css);
            }
        },
        cssVal : function(el, prop){
            if(!this.isElement(el)){
                C.eleNoInfo('cssVal');
                return;
            }
            if(arguments.length === 2){
                var computedStyle = window.getComputedStyle(el, null);
                return computedStyle.getPropertyValue(prop);
            }
        },
        post : function(/*url,data,fnSuc,dataType*/){
            var argsToJson = parseArg.apply(null, arguments);
            var json = {};
            var fnSuc = argsToJson.fnSuc;
            argsToJson.url && (json.url = argsToJson.url);
            argsToJson.data && (json.data = argsToJson.data);
            if(argsToJson.dataType){
                var type = argsToJson.dataType.toLowerCase();
                if (type == 'text'||type == 'json') {
                    json.dataType = type;
                }
            }else{
                json.dataType = 'json';
            }
            json.method = 'post';
            api.ajax(json,
                function(ret,err){
                    if (ret) {
                        fnSuc && fnSuc(ret);
                    }
                }
            );
        },
        get : function(/*url,fnSuc,dataType*/){
            var argsToJson = parseArg.apply(null, arguments);
            var json = {};
            var fnSuc = argsToJson.fnSuc;
            argsToJson.url && (json.url = argsToJson.url);
            //argsToJson.data && (json.data = argsToJson.data);
            if(argsToJson.dataType){
                var type = argsToJson.dataType.toLowerCase();
                if (type == 'text'||type == 'json') {
                    json.dataType = type;
                }
            }else{
                json.dataType = 'text';
            }
            json.method = 'get';
            api.ajax(json,
                function(ret,err){
                    if (ret) {
                        fnSuc && fnSuc(ret);
                    }
                }
            );
        },
        remove : function(el){
            if(el && el.parentNode){
                el.parentNode.removeChild(el);
            }
        },
        removeAttr : function(el, name){
            if(!this.isElement(el)){
                C.eleNoInfo('removeAttr');
                return;
            }
            if(arguments.length === 2){
                el.removeAttribute(name);
            }
        },
        hasCls : function(el, cls){
            if(!this.isElement(el)){
                C.eleNoInfo('hasCls');
                return;
            }
            if(el.className.indexOf(cls) > -1){
                return true;
            }else{
                return false;
            }
        },
        addCls : function(el, cls){
            if(!this.isElement(el)){
                C.eleNoInfo('addCls');
                return;
            }
            if('classList' in el){
                el.classList.add(cls);
            }else{
                var preCls = el.className;
                var newCls = preCls +' '+ cls;
                el.className = newCls;
            }
            return el;
        },
        removeCls : function(el, cls){
            if(!this.isElement(el)){
                C.eleNoInfo('removeCls');
                return;
            }
            if('classList' in el){
                el.classList.remove(cls);
            }else{
                var preCls = el.className;
                var newCls = preCls.replace(cls, '');
                el.className = newCls;
            }
            return el;
        },
        toggleCls : function(el, cls){
            if(!this.isElement(el)){
                C.eleNoInfo('toggleCls');
                return;
            }
            if('classList' in el){
                el.classList.toggle(cls);
            }else{
                if(C.hasCls(el, cls)){
                    C.removeCls(el, cls);
                }else{
                    C.addCls(el, cls);
                }
            }
            return el;
        },
        isElement : function(obj){
            return !!(obj && obj.nodeType == 1);
        },
        addEvt : function(el, name, fn, useCapture){
            if(!this.isElement(el)){
                C.eleNoInfo('addEvt');
                return;
            }
            useCapture = useCapture || false;
            if(el.addEventListener) {
                el.addEventListener(name, fn, useCapture);
            }
        },
        rmEvt : function(el, name, fn, useCapture){
            if(!this.isElement(el)){
                C.eleNoInfo('rmEvt');
                return;
            }
            useCapture = useCapture || false;
            if (el.removeEventListener) {
                el.removeEventListener(name, fn, useCapture);
            }
        },
        one : function(el, name, fn, useCapture){
            if(!this.isElement(el)){
                C.eleNoInfo('one');
                return;
            }
            useCapture = useCapture || false;
            var that = this;
            var cb = function(){
                fn && fn();
                that.rmEvt(el, name, cb, useCapture);
            };
            that.addEvt(el, name, cb, useCapture);
        },
        domAll : function(el, selector){
            if(arguments.length === 1 && typeof arguments[0] == 'string'){
                if(document.querySelectorAll){
                    return document.querySelectorAll(arguments[0]);
                }
            }else if(arguments.length === 2){
                if(el.querySelectorAll){
                    return el.querySelectorAll(selector);
                }
            }
        },
        first : function(el, selector){
            if(arguments.length === 1){
                if(!this.isElement(el)){
                    C.eleNoInfo('first');
                    return;
                }
                return el.children[0];
            }
            if(arguments.length === 2){
                return this.dom(el, selector+':first-child');
            }
        },
        last : function(el, selector){
            if(arguments.length === 1){
                if(!this.isElement(el)){
                    C.eleNoInfo('last');
                    return;
                }
                var children = el.children;
                return children[children.length - 1];
            }
            if(arguments.length === 2){
                return this.dom(el, selector+':last-child');
            }
        },
        eq : function(el, index){
            return this.dom(el, ':nth-child('+ index +')');
        },
        not : function(el, selector){
            return this.domAll(el, ':not('+ selector +')');
        },
        prev : function(el){
            if(!this.isElement(el)){
                C.eleNoInfo('prev');
                return;
            }
            var node = el.previousSibling;
            if(node.nodeType && node.nodeType === 3){
                node = node.previousSibling;
                return node;
            }
        },
        next : function(el){
            if(!this.isElement(el)){
                C.eleNoInfo('next');
                return;
            }
            var node = el.nextSibling;
            if(node.nodeType && node.nodeType === 3){
                node = node.nextSibling;
                return node;
            }
        },
        closest : function(el, selector){
            if(!this.isElement(el)){
                C.eleNoInfo('closest');
                return;
            }
            var doms, targetDom;
            var isSame = function(doms, el){
                var i = 0, len = doms.length;
                for(i; i<len; i++){
                    if(doms[i].isEqualNode(el)){
                        return doms[i];
                    }
                }
                return false;
            };
            var traversal = function(el, selector){
                doms = C.domAll(el.parentNode, selector);
                targetDom = isSame(doms, el);
                while(!targetDom){
                    el = el.parentNode;
                    if(el != null && el.nodeType == el.DOCUMENT_NODE){
                        return false;
                    }
                    traversal(el, selector);
                }

                return targetDom;
            };

            return traversal(el, selector);
        },
        offset : function(el){
            if(!this.isElement(el)){
                C.eleNoInfo('offset');
                return;
            }
            var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

            var rect = el.getBoundingClientRect();
            return {
                l: rect.left + sl,
                t: rect.top + st,
                w: el.offsetWidth,
                h: el.offsetHeight
            };
        }
    };

    var parseArg = function (url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    };

    C.prototype.init.prototype = C.prototype;

    C.eleNoInfo = function(fnName){
        console.warn('$C.' + fnName + ' Function 需要el参数, el参数必须是DOM Element');
    };

    window.$$ = window.$C = C;
    window.$_ = window.$$_ = C.utils;
})(window, document);