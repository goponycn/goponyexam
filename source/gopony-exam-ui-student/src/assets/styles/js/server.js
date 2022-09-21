// 影院数据
let cinemas = [{
            name: '太平洋影城（北欧知识城店）',
            adress: '新都区斑竹园镇中利路169号北欧商业广场4号楼4楼',
            money: 59.9,
            away: 6,
            func: ['改签', '折扣卡'],
            url: 'https://p1.meituan.net/deal/201208/22/1_0822151022.jpg@292w_292h_1e_1c',
            phonenum: '082-55551455'
        },
        {
            name: '承光国际影城',
            adress: '新都区斑竹园镇中利路169号北欧商业广场4号楼4楼',
            money: 43,
            away: 12,
            func: ['退', '改签', '折扣卡'],
            url: 'https://p0.meituan.net/mogu/6b672611a200c5c5a4a24120c6f0dc77832306.png@292w_292h_1e_1c',
            phonenum: '028 - 65524525'
        },
        {
            name: '联娱国际影城（兰天店）',
            adress: '金堂县赵镇新建路133号兰天城市广场5号楼四楼',
            money: 56,
            away: 26,
            func: ['退', '改签', '折扣卡'],
            url: 'https://p1.meituan.net/deal/201208/22/1_0822151022.jpg@292w_292h_1e_1c',
            phonenum: '-028-5449155'
        },
        {
            name: '万达影城（双流万达广场店）',
            adress: '双流区星空路二段万达广场四楼',
            money: 66,
            away: 5,
            func: ['退', '改签', '折扣卡', '杜比全景音厅', 'Dolby Cinema厅', '儿童厅'],
            url: 'https://p1.meituan.net/deal/201208/22/1_0822151022.jpg@292w_292h_1e_1c',
            phonenum: '028-484966165'
        },
        {
            name: '天智创客影城（川外店）',
            adress: '都江堰市大观镇高尔夫大街367号四川外国语大学成都学院33栋百汇园4楼',
            money: 45,
            away: 36,
            func: ['退', '改签', '折扣卡'],
            url: 'https://p1.meituan.net/deal/201208/22/1_0822151022.jpg@292w_292h_1e_1c',
            phonenum: '028-494984984684'
        },
        {
            name: '太平洋影城（羊安店）',
            adress: '邛崃市永康大道33号',
            money: 50,
            away: 125,
            func: ['退', '改签', '折扣卡'],
            url: 'https://p0.meituan.net/deal/49be8ab891f27af351f50ebbeb56909e214831.jpg@292w_292h_1e_1c',
            phonenum: '028-746855689'

        },
        {
            name: '太平洋影城（新津店）',
            adress: '新津县迎宾大道74号（原艺术中心）',
            money: 23,
            away: 70,
            func: ['改签', '折扣卡'],
            url: 'https://p1.meituan.net/deal/__38052895__2954803.jpg@292w_292h_1e_1c',
            phonenum: '028-9656855'

        }
    ]
    // 电影数据
let movies = [{
            name: '天气之子',
            url: 'https://p0.meituan.net/movie/ecca4f0b95340b2c57006a1bace4c3f91386100.jpg@160w_220h_1e_1c',
            num: 9.2,
            mix: 'mix2d'
        }, {
            name: '误杀',
            url: 'https://p1.meituan.net/movie/967b253953bc7e660cfadbf9d78f67b62852693.jpg@160w_220h_1e_1c',
            num: 9.4,
            mix: 'mix2d'
        }, {
            name: '哪吒:魔童降世',
            url: 'https://p0.meituan.net/movie/005955214d5b3e50c910d7a511b0cb571445301.jpg@160w_220h_1e_1c',
            num: 9.6,
            mix: 'mix3d'
        },
        {
            name: '我和我的祖国',
            url: 'https://p0.meituan.net/moviemachine/b2c5c74d33e45745fd3462e44b3698e18336620.jpg@160w_220h_1e_1c',
            num: 9.7,
            mix: 'mix2d'
        }
    ]
    // 首页正在热映电影数据
let hotmovies = [{
            name: '天气之子',
            url: 'images/hotmovie1.png'
        },
        {
            name: '五亿探长雷洛传1:雷老虎',
            url: 'images/hotmovie2.png'
        },
        {
            name: '罗马',
            url: 'images/hotmovie3.png'
        },
        {
            name: '正义的慈悲',
            url: 'images/hotmovie4.png'
        }
    ]
    // 选座时电影数据
let checkedcinema = [{
            name: '五亿探长雷洛传1:雷老虎',
            englishname: 'Lee Rock',
            url: ' https://p1.meituan.net/movie/fab7297ef2ffb4c0548cf2639035e37c87185.jpg@464w_644h_1e_1c',
            kind: '剧情,动作,爱情,犯罪',
            adress: '中国香港/127分钟',
            time: '1991-09-19上线',
            num: 9.7,
            star: '刘德华'
        }, {
            name: '天气之子',
            englishname: '天気の子',
            url: 'images/movie1.jpg',
            kind: '动画 纯爱',
            adress: '日本 / 113分钟',
            time: '2019-11-01中国大陆上映',
            num: 9.8,
            start: '森岛帆高'
        }, {
            name: '罗马',
            englishname: 'Roma',
            url: 'https://p0.meituan.net/movie/3a99e82eb46c2f5da78b4c64d805f9b12425410.jpg@464w_644h_1e_1c',
            kind: '剧情 家庭',
            adress: '墨西哥 / 135分钟',
            time: '2019-05-10中国大陆上映',
            num: 8.2,
            start: '不知道'
        }, {
            name: '正义的慈悲',
            englishname: 'Just Mercy',
            url: 'https://p0.meituan.net/movie/3d9d9167e2091424bf8afd85d5dc2431292738.jpg@464w_644h_1e_1c',
            kind: '剧情',
            adress: '美国 / 136分钟',
            time: '2019-10-03美国上映',
            num: 7.9,
            start: '真的不知道'
        }

    ]
    // 注册验证
Mock.mock(/\/users\/sign/, 'post', function(options) {
    let user = getdata('users');
    if (user.length == 0) {
        let arr = {
            name: options.body.name,
            pwd: options.body.pwd
        }
        return msg = {
            data: arr,
            isable: true,
        }
    } else {
        let data = user.filter((value) => value.name == options.body.name)
        if (data.length == 0) {
            let arr = {
                name: options.body.name,
                pwd: options.body.pwd
            }
            return msg = {
                data: arr,
                isable: true
            }
        } else {
            return msg = {
                data: null,
                isable: false
            }
        }
    }
});

// 登录验证
Mock.mock(/\/users\/login/, 'post', function(options) {
    let user = getdata('users');
    console.log(user)
    let data = user.filter((value) => (value.name == options.body.name && value.pwd == options.body.pwd));
    console.log(data)
    if (data.length != 0) {
        return msg = true
    } else {
        return msg = false
    }
});
// 获取电影院列表
Mock.mock(/\/cinema\/getcinemas/, 'get', function(options) {
    return msg = {
        data: cinemas,
        isable: true
    }
});
// 获取电影列表
Mock.mock(/\/movies\/getmovies/, 'get', function(options) {
    return msg = {
        data: movies,
        isable: true
    }
});
// 获取热映电影
Mock.mock(/\/movies\/gethotmovies/, 'get', function(options) {
    return msg = {
        data: hotmovies,
        isable: true
    }
});
// 获取选座电影信息
Mock.mock(/\/moviescinema\/getmoviescinema/, 'get', function(options) {
    let data = options.body;
    let arr = checkedcinema.filter((value => value.name == data))
    return msg = {
        data: arr,
        isable: true
    }
});
// 获取指定电影院信息
Mock.mock(/\/cinema\/getcinema/, 'get', function(options) {
    let data = options.body;
    let arr = cinemas.filter((value => value.name == data))
    return msg = {
        data: arr,
        isable: true
    }
});