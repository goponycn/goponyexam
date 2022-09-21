// 动态生成影院
function render(data) {
    let list = document.getElementById('cinemas-body');
    let msg = [...data];
    var url = decodeURI(window.location.href);
    var backToPreUrl = url.split("?");
    msg.forEach(value => {
        let model = document.createElement('div');
        model.setAttribute('class', 'cineam-model');
        model.innerHTML = `
        <div class="cineam-name">
        <p>
            <a href="#">
            ${value.name}
        </a>
        </p>
        <p>地址：${value.adress}</p>
            ${hint(value.func)}
        </div>
        <div class="cineam-money">
        <div class="price">
            <p><span>￥${value.money}</span>起</p>
            <p>${value.away}km</p>
        </div>
        <div class="buy-btn">
            <a href="cinemadatas.html?${value.name}?${backToPreUrl[1]}">
                选座购票
            </a>
        </div>
        </div>
        `;
        list.appendChild(model);
    })
}
// 生成电影服务小标签
function hint(data) {
    let p = '';
    data.forEach(value => {
        p += `
       <span class="hint">${value}</span>
       `
    })
    return p
}
// 获取电影信息
window.onload = () => {
    ajax({
        url: '/cinema/getcinemas',
        type: 'get',
        data: '',
        success: function(msg) {
            if (msg.isable) {
                render(msg.data)
            } else {
                alert('获取信息失败');
            }
        }
    })
}