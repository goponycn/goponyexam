<template>
  <div class="video-preview-wrapper">
        <div class="video-wrapper">
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            @canplay="canplay($event)"
            @play="play($event)"
            @pause="pause($event)"
            :playsinline="true"
            :options="playerOptions"
            @ready="playerReadied"
            v-if="videoPreviewVisible&&openSteamMedia==='1'">
          </video-player>

          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            @canplay="canplay($event)"
            @play="play($event)"
            @pause="pause($event)"
            :playsinline="true"
            :options="playerOptions"
            @ready="playerReadied"
            v-if="videoPreviewVisible&&openSteamMedia==='0'">
          </video-player>

          <!--<div align="center" v-if=" videoPreviewList.length < 1" >
            <span style="color: red">没有转化好的视频文件，请联系管理员！</span>
          </div>-->
          <div class="clarity-btn" v-if="videoPreviewVisible && videoPreviewList.length>1" ref="clarityRef">
            清晰度
            <ul class="clarity-list">
              <li
                class="clarity-item"
                v-for="(item, index) in videoPreviewList"
                :key="index"
                :class="activeIndex === index ? 'active' : 'normal'"
                @click="handleChangeClarity(index)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
  </div>
</template>

<script>
  /**
   * vue-video-player 官方文档 https://github.com/surmon-china/vue-video-player
   * 此插件依赖于 video.js 官方文档 https://docs.videojs.com/
   */
  import {videoPlayer} from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  import 'videojs-contrib-hls';
  import { getPlayLogs, insertOrUpdatePlayLogs } from "@/api/media/playLogs";

  export default {
    name: 'VideoPreview',
    components: {
      videoPlayer
    },
    props: {
      autoplay: {
        type: Boolean,
        default: true
      },
      videoId: {
        type: [ Number,String],
        default: ''
      }
    },
    data() {
      return {
        currentDuration: 0,// 当前播放位置
        timerId: null,
        player: null,
        duration: 0,
        activeIndex: 0, //  当前打开的视频索引  清晰度对应的文件索引和清晰度列表索引
      }
    },
    computed: {
      openSteamMedia() {
        return this.$store.state.videoPreview.openSteamMedia
      },
      // 视频查看组件是否显示
      videoPreviewVisible() {
        return this.$store.state.videoPreview.videoPreviewVisible
      },
      // 视频列表
      videoPreviewList() {
        return this.$store.state.videoPreview.videoPreviewList
      },
      // 默认显示的视频索引 从 0 开始
      defaultActiveIndex() {
        return this.$store.state.videoPreview.defaultActiveIndex
      },
      // 当前显示的文件信息
      activeFileObj() {
        return this.videoPreviewList.length ? this.videoPreviewList[this.activeIndex] : {}
      },
      // 播放器配置项
      playerOptions() {
        return {
          playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
          autoplay: true, //  如果true,浏览器准备好时开始播放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
            {
              type: this.videoPreviewList[this.activeIndex].type,
              src: this.videoPreviewList[this.activeIndex].src // url地址
            }
          ],
          // poster: this.poster, // 预览图
          flash: { hls: { withCredentials: false }},
          html5: { hls: { withCredentials: false }},
          notSupportedMessage: '此视频暂无法播放，请稍侯再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true // 全屏按钮
          }
        }
      }
    },
    watch: {
      // 监听视频预览组件状态
      videoPreviewVisible(newValue) {
        if (newValue) {
          this.activeIndex = this.defaultActiveIndex
        }
      }
    },
    mounted() {
      const queryPlayParam = { videoId: this.videoId }
      getPlayLogs(queryPlayParam).then(response => {
        const playLogs = response.data;
        this.currentDuration = playLogs.playPosition;
      });
      this.interval();
    },
    methods: {
      //定时器
      interval() {
        this.timerId = setInterval(() => {
          this.insertPlayLog();
        }, 60000)
      },
      insertPlayLog() {
        const insertPlayParam = { videoId: this.videoId, playDuration: this.duration, playPosition:  this.player.cache_.currentTime }
        insertOrUpdatePlayLogs(insertPlayParam).then(response => {
        })
      },
      //点击视频播放
      play(player){
        clearInterval(this.timerId);
        this.interval();
        this.insertPlayLog();
      },
      //点击暂停时触发
      pause(){
        clearInterval(this.timerId);
      },
      //默认加载之后，就会执行该函数
      canplay(player){
        this.duration = player.duration();
        this.player = player;
      },
      handleChangeClarity(index) {
        this.activeIndex = index //进行切换视频源的操作...
        const source = this.videoPreviewList[index]
        this.playerOptions.sources[0] = source
      },
      playerReadied(player) {
        if (this.openSteamMedia === '1') {
          var hls = player.tech({IWillNotUseThisInPlugins: true}).hls
          player.tech_.hls.xhr.beforeRequest = function (options) {
            return options
          }
        }
        player.currentTime(this.currentDuration)
      }
    }
  }
</script>

<style lang="stylus" scoped>

        .clarity-btn {
          order 4
          position relative
          width 4em
          height 3.0em
          line-height 3.0em
          text-align center
          cursor pointer

          &:hover {
            .clarity-list {
              display block
            }
          }

          .clarity-list {
            position absolute
            bottom 3.0em
            width 4em
            color #fff
            font-size 14px
            text-align: center;
            display none
            right 0
            bottom 3.0em
            cursor pointer

            .clarity-item {
              background: rgba(43, 51, 63, 0.7);
              width 4em
              height 3.0em
              line-height 3.0em
              text-align center

              &:hover {
                background: rgba(115, 133, 159, 0.5);
              }
            }

            .clarity-item.active {
              background #fff
              color #000
            }
          }
        }
</style>

