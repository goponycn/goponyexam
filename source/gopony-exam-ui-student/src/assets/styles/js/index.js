// 模拟登录拦截
var url = window.location.href;
var backToPreUrl = url.split("?");
if (backToPreUrl[1] == null) {} else {
    let loginbox = document.querySelector('.notlogin');
    let login = document.querySelector('.islogin')
    loginbox.classList.add('nologin');
    login.classList.remove('nologin')
}

// 轮播图

var imgArr = [
    { "path": "images/1.jpg" },
    { "path": "images/2.jpg" },
    { "path": "images/3.jpg" },
    { "path": "images/4.jpg" },
    { "path": "images/5.jpg" },

];
var size = [
    { "top": 100, "left": 500, "width": 600, "height": 300, "zIndex": 0, "opacity": 0 },
    { "top": 100, "left": 8, "width": 600, "height": 300, "zIndex": 0, "opacity": 70 },
    { "top": 100, "left": 1000, "width": 600, "height": 300, "zIndex": 0, "opacity": 70 },
    { "top": 0, "left": 105, "width": 1700, "height": 520, "zIndex": 4, "opacity": 100 },
    { "top": 100, "left": 1300, "width": 600, "height": 300, "zIndex": 0, "opacity": 70 },
];
var imgSum = imgArr.length;
var wrap = document.getElementById('wrap');
var cont = wrap.firstElementChild || wrap.firstChild;
var btnArr = wrap.getElementsByTagName('a');
var falg = true;
var speed = 4000;
wrap.onmouseover = function() {
    for (var i = 0; i < btnArr.length; i++) {
        btnArr[i].style.display = 'block';
    }
    clearInterval(wrap.timer);
}
wrap.onmouseout = function() {
    for (var i = 0; i < btnArr.length; i++) {
        btnArr[i].style.display = 'none';
    }
    wrap.timer = setInterval(function() {
        move(true);
    }, speed);
}
for (var i = 0; i < imgSum; i++) {
    var lis = document.createElement('li');
    lis.style.backgroundImage = 'url(' + imgArr[i].path + ')';
    cont.appendChild(lis);
}
var liArr = cont.children;
move();
wrap.timer = setInterval(function() {
    move(true);
}, speed);
btnArr[1].onclick = function() {
    if (falg) {
        move(true);
    }
}
btnArr[0].onclick = function() {
    if (falg) {
        move(false);
    }
}

function move(bool) {
    if (bool != undefined) {
        if (bool) {
            size.unshift(size.pop());
        } else {
            size.push(size.shift());
        }
    }
    for (var i = 0; i < liArr.length; i++) {
        animate(liArr[i], size[i], function() {
            falg = true;
        });
    }
}


function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj, null)[attr];
}

function animate(obj, json, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var bool = true;
        for (var k in json) {
            var leader;
            if (k == 'opacity') {
                if (getStyle(obj, k) == undefined) {
                    leader = 100;
                } else {
                    leader = parseInt(getStyle(obj, k) * 100);
                }
            } else {
                leader = parseInt(getStyle(obj, k)) || 0;
            }
            var step = (json[k] - leader) / 10;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            leader = leader + step;
            if (k == 'zIndex') {
                obj.style[k] = json[k];
            } else if (k == 'opacity') {
                obj.style[k] = leader / 100;
                obj.style.filter = 'alpha(opacity=' + leader + ')';
            } else {
                obj.style[k] = leader + 'px';
            }
            if (json[k] != leader) {
                bool = false;
            }
        }
        if (bool) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
    }, 10);
}

// 动态生成热映影片
function render(data) {
    let list = document.getElementById('hotmovies');
    let msg = [...data];
    msg.forEach(value => {
        let model = document.createElement('div');
        model.setAttribute('class', 'movies-model');
        model.innerHTML = `
        <a href="${encodeURI('moviedatas.html?'+value.name)}">
        <img src="${value.url}" alt="" srcset="">
    </a>
    <button data-id="${value.name}" class="btn">立即购票</button>
        `;
        list.appendChild(model);
    })
}


window.onload = () => {
        // 获取电影信息
        ajax({
            url: '/movies/gethotmovies',
            type: 'get',
            data: '',
            success: function(msg) {
                if (msg.isable) {
                    render(msg.data)
                } else {
                    alert('获取信息失败');
                }
            }
        });
        // 添加点击事件
        let div = document.getElementById('hotmovies');
        div.addEventListener('click', (e) => {
            let btn = e.target;
            if (btn.className == 'btn') {
                let t = lanjie();
                if (t) {
                    let id = btn.getAttribute('data-id');
                    switch (id) {
                        case '天气之子':
                            window.location.href = encodeURI(`moviecinema.html?天气之子`)
                            break;
                        case '五亿探长雷洛传1:雷老虎':
                            window.location.href = `moviecinema.html?五亿探长雷洛传1:雷老虎`
                            break;
                        case '罗马':
                            window.location.href = `moviecinema.html?罗马`
                            break;
                        case '正义的慈悲':
                            window.location.href = `moviecinema.html?正义的慈悲`
                            break;
                    }
                } else {
                    alert('请登录后使用');
                    window.location.href = 'login.html'
                }
            }
        })
    }
    // 判断是否登录
function lanjie() {
    var url = window.location.href;
    var backToPreUrl = url.split("?");
    if (backToPreUrl[1] == null) {
        return false
    } else {
        return true;
    }
}