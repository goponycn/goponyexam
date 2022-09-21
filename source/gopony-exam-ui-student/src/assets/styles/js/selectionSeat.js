// 生成座位列表,并随机生成几个已经被购买的座位
let seats = document.getElementById('seats-main');
let seatlist = document.createElement('div');
for (let i = 1; i < 10; i++) {
    for (let t = 1; t < 9; t++) {
        let n = Math.random();
        if (n < 0.1) {
            seatlist.innerHTML += `
    <div class="seat disableseat" data-num="${i}-${t}"></div>
`
        } else {
            seatlist.innerHTML += `
    <div class="seat" data-num="${i}-${t}"></div>
`
        }
    }
}
seats.appendChild(seatlist);
let pricenum = 0;
// 添加点击事件
seats.addEventListener('click', (e) => {
        let btn = e.target;
        let arr = [btn.className];
        if (arr[0] == 'seat') {
            btn.classList.add('ableseat');
            let id = btn.getAttribute('data-num').split("-");
            addbox(id);
            pricenum++;
            count();
        } else {
            if (arr.indexOf('ableseat')) {
                let id = btn.getAttribute('data-num');
                subbox(id);
                btn.classList.remove('ableseat');
                pricenum--;
                count();
            }
        }
    })
    // 侧边栏增加购买的座位号
function addbox(id) {
    let box = document.getElementById('seatmini');
    let div = document.createElement('div');
    // 侧边栏提示信息隐藏
    let p = document.getElementById('tips');
    p.setAttribute('class', 'none');
    div.setAttribute('class', 'seat-num');
    div.setAttribute('id', `${id.join('-')}`);
    div.innerHTML = `
    第${id[0]}行第${id[1]}号座
    `;
    box.appendChild(div)
}
// 取消座位后去除侧边栏座位号
function subbox(id) {
    let box = document.getElementById('seatmini');
    let div = document.getElementById(`${id}`);
    box.removeChild(div);

}
// 计算总价
function count() {
    let div = document.getElementById('pricemonry');
    div.innerText = pricenum * 66;
    let num = div.innerText - 0;
    if (num != 0) {
        let btn = document.getElementById('givemoney');
        btn.classList.add('isable')
    } else {
        let btn = document.getElementById('givemoney');
        btn.classList.remove('isable');
        let p = document.getElementById('tips');
        p.classList.remove('none')
    }
}

// 渲染侧边栏电影,电影院信息
var url = decodeURI(window.location.href);
var backToPreUrl = url.split("?");
getcinema()
getmovies()



function getcinema() {
    ajax({
        url: '/cinema/getcinema',
        type: 'get',
        data: backToPreUrl[1],
        success: function(msg) {
            if (msg.isable) {
                let [arr] = [...msg.data];
                document.getElementById('cinemaname').innerText = arr.name;
            } else {
                alert('获取信息失败');
            }
        }
    })
}

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
            } else {
                alert('获取信息失败');
            }
        }
    })
}