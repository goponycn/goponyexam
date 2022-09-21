// 登录注册页面切换
function tosign() {
    let login = document.querySelector('.login');
    let sign = document.querySelector('.sign');
    login.classList.add('disnone')
    sign.classList.remove('disnone')
}

function tologin() {
    let login = document.querySelector('.login');
    let sign = document.querySelector('.sign');
    sign.classList.add('disnone')
    login.classList.remove('disnone')
}
// 登录判断
function login() {
    let username = document.getElementById('user').value;
    let userpaswd = document.getElementById('passwd').value;
    if (username != '') {
        ajax({
            url: '/users/login',
            type: 'post',
            data: {
                name: username,
                pwd: userpaswd
            },
            success: function(msg) {
                if (msg) {
                    location.href = `index.html?${username}&${userpaswd}`
                } else {
                    alert('密码或用户名错误')
                }
            }
        })
    } else {
        alert('请输入正确的信息')
    }

}
// 注册
function sign() {
    let username = document.getElementById('suser').value;
    let userpaswd = document.getElementById('spasswd').value;
    let userpaswdtwo = document.getElementById('spasswdtwo').value;
    if (username != '' && userpaswd == userpaswdtwo) {
        ajax({
            url: '/users/sign',
            type: 'post',
            data: {
                name: username,
                pwd: userpaswd
            },
            success: function(msg) {
                if (msg.isable) {
                    let users = getdata('users')
                    users.push(msg.data);
                    setdata('users', users);
                    alert('注册成功')
                } else {
                    alert('用户名已存在')
                }
            }
        })
    }
}