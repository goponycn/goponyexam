import Vue from 'vue'
import Vuex from 'vuex'
import root from './root'
import videoPreview from './videoPreview'
import imagePreview from './imagePreview'
import getters from './getters'
import user from './user'
Vue.use(Vuex)

/**
 * 全局唯一 Store 实例
 */
export const store = new Vuex.Store({
  devtools: process.env.VUE_APP_ENV === 'dev' || process.env.VUE_APP_ENV === 'stage',
  strict: process.env.VUE_APP_ENV === 'dev',
  ...root,

  /* module 应该启用命名空间，即 namespaced: true */
  modules: {
    videoPreview,
    imagePreview,
    user
  },
  getters
})

export default store
