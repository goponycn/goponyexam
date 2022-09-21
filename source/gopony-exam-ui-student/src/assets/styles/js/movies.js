// 动态生成影院
function render(data) {
    let list = document.getElementById('movies-body');
    let msg = [...data];
    msg.forEach(value => {
        let model = document.createElement('li');
        model.setAttribute('class', 'othermovie-model');
        model.innerHTML = `
        <a href="#">
        <img alt="天气之子海报封面" src="${value.url}">
        <p>${value.name}</p>
        </a>
        <i>${value.num}</i>
        <i class="${value.mix}"></i>
        `;
        list.appendChild(model);
    })
}
// 获取电影院信息
window.onload = () => {
    ajax({
        url: '/movies/getmovies',
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