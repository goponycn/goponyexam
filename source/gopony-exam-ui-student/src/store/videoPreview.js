const state = () => ({
  videoPreviewVisible: false,  //  视频查看组件显隐状态
  videoPreviewList: [], //  视频列表
  defaultActiveIndex: 0, //  默认当前打开的视频的索引
  openSteamMedia: '0' // 流媒体开关 1开0关
})


const mutations = {
    /**
     * 存储视频预览组件所需要的数据
     * @param {object} state Vuex 的 state 对象
     * @param {object} data 视频数据
     */
    setVideoPreviewData(state, data) {
      state.openSteamMedia = data.openSteamMedia
      if(data.videoPreviewVisible) {
        state.videoPreviewVisible = data.videoPreviewVisible
        state.videoPreviewList = data.videoPreviewList
        state.defaultActiveIndex = data.activeIndex
      } else {
        state.videoPreviewVisible = data.false
        state.videoPreviewList = []
        state.defaultActiveIndex = 0
      }
    }
}

const actions = {
}

export  default {
  state,
  mutations,
  actions
}
