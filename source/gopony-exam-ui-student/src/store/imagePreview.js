export default {
  state: {
    imagePreviewVisible: false,  //  图片查看组件显隐状态
    imagePreviewList: [], //  图片列表
    defaultActiveIndex: 0 //  默认当前打开的图片的索引
  },
  mutations: {
    /**
     * 存储图片预览组件所需要的数据
     * @param {object} state Vuex 的 state 对象
     * @param {object} data 图片数据
     */
    setimagePreviewData(state, data) {
      if(data.imagePreviewVisible) {
        state.imagePreviewVisible = data.imagePreviewVisible
        state.imagePreviewList = data.imagePreviewList
        state.defaultActiveIndex = data.activeIndex
      } else {
        state.imagePreviewVisible = data.false
        state.imagePreviewList = []
        state.defaultActiveIndex = 0
      }
    }
  },
  actions: {
  }
}
