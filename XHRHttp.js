//创建XMLHTTPRequest实例，兼容低版本IE
function creatXHR() {
    if (typeof XMLHTTPRequest != "undefined") {
        return new XMLHTTPRequest();
    } else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
            let versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp"];
            let i,
                len;
            for (i=0,len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                } catch (ex) {
                    //跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR abject available");
    }
}

function readyStateChange () {
    if (xhr.readyState == 4) {
        if ((xhr.status >=200 && xhr.status < 300) || xhr.status == 304) {
            console.log("Request was unsucessful:" + xhr.status);
            console.log(xhr.responseText);
            // responseText作为响应主体被返回的文本
        } else {
            console.error(xhr.status, xhr.statusText); 
            // 状态码和说明
        }
    }else {
        //请求状态还没有成功，页面等待
        document .getElementById ("loading").innerHTML ="数据加载中";
    }
};

var xhr = creatXHR();

// 超时事件
xhr.ontimeout = function() {
    alert('timeout!')
}
// 进度事件
xhr.onprogress = function(event) {
    if(event.lengthComputable) {
      console.log(`Received: ${(event.position/event.totalSize).toFixed(4)*100}%`);
    }
}

/*
*  open()方法不会立即发送请求，处于待命状态，调用send()方法就会发出这个http请求，第三个参数代表是否异步发送请求
*  timeout 为设置超时时间
**/

// get
xhr.open('get', 'url', true);
xhr.onreadystatechange = readyStateChange;
xhr.timeout = 10000;
xhr.send(null);
//post
xhr.open('post', 'post.php', true);
xhr.onreadystatechange = readyStateChange;
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.timeout = 10000;
xhr.send(jsonData);