var url = decodeURI(window.location.href);
var backToPreUrl = url.split("?");
getcinema()
getmovies()
    // 得到电影院数据并渲染到页面
function getcinema() {
    ajax({
        url: '/cinema/getcinema',
        type: 'get',
        data: backToPreUrl[1],
        success: function(msg) {
            if (msg.isable) {
                let [arr] = [...msg.data];
                document.getElementById('cinemaimg').src = arr.url;
                document.getElementById('cinemaname').innerText = arr.name;
                document.getElementById('adress').innerText = arr.adress;
                document.getElementById('phonenum').innerText = arr.phonenum;
            } else {
                alert('获取信息失败');
            }
        }
    })
}
// 得到电影数据并渲染到页面
function getmovies() {
    ajax({
        url: '/moviescinema/getmoviescinema',
        type: 'get',
        data: backToPreUrl[2],
        success: function(msg) {
            if (msg.isable) {
                let [arr] = [...msg.data];
                document.getElementById('movieimg').src = arr.url;
                document.getElementById('moviename').innerText = arr.name;
                document.getElementById('moviekind').innerText = arr.kind;
                document.getElementById('movienum').innerText = arr.num;
                document.getElementById('moviestar').innerText = arr.start;
            } else {
                alert('获取信息失败');
            }
        }
    })
}
// 购票页面跳转并传递电影信息,电影院信息
function jump() {
    location.href = `selectionSeat.html?${backToPreUrl[1]}?${backToPreUrl[2]}`
}