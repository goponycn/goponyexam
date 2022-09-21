// ajax交互
function ajax(options) {
    const { type = "get", url, data, success } = options;
    const xhr = new XMLHttpRequest();
    xhr.open(type, url);
    xhr.send(data);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // 判断服务器返回的数据是否有值
            if (xhr.responseText) {
                // 如果有值，就将该字符串通过 JSON.parse 方法进行转换
                const msg = JSON.parse(xhr.responseText);
                success(msg);
            } else {
                success(xhr.responseText);
            }
        }
    }
}

// 得到本地存储
function getdata(name) {
    if (JSON.parse(localStorage.getItem(name)) == null) {
        var user = []
    } else {
        var user = [...JSON.parse(localStorage.getItem(name))]
    }
    return user;
}
// 本地储存
function setdata(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}