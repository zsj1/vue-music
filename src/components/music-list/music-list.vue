<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length && playShow" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 下面是一个蒙层 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 向上顶的遮层 -->
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :data="songs"
      :probeType="probeType"
      :listenScroll="listenScroll"
      @scroll="scroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          :rank="rank"
          @select="selectItem"
        ></song-list>
      </div>
      <div v-show="!songs.length && loadingFlag" class="loading-container">
        <loading></loading>
      </div>
      <div v-show="!loadingFlag" class="tips-container">该歌手目前没有免费歌曲哦。</div>
    </scroll>
  </div>
</template>
<script type='text/ecmascript-6'>
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'
import { playListMixin } from 'common/js/mixin'

const RESERVED_HEIGHT = 40 // 顶部预留空间
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdropFilter')

export default {
  mixins: [playListMixin],
  props: {
    songs: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    loadingFlag: {
      type: Boolean,
      default: true
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0,
      playShow: true
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  watch: {
    // 滚动的时候监听的scrollY
    scrollY (newY) {
      const translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1 // 当用户向下拉歌单时候背景图片放大比例
      let blur = 0 // 背景图片高斯模糊效果
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      const percent = Math.abs(newY / this.imageHeight) // scale计算方法
      if (newY > 0) { // 下拉歌单时候背景图片放大比例
        scale = 1 + percent
        zIndex = 10
      } else { // 上滑高斯模糊效果
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)` // 只有ios手机才有高斯模糊
      if (newY < this.minTranslateY) {
        // 当歌单滚动到顶部的时候修改背景图片样式
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.playShow = false
      } else {
        // 滚动未达到阈值高度时则恢复背景图片样式
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.playShow = true
      }
      this.$refs.bgImage.style.zIndex = zIndex
      // 设置背景图片缩放
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.music-list
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color $color-text
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 70%
    transform-origin top
    background-size cover
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.4)
  .play-wrapper
    position absolute
    bottom 20px
    z-index 50
    width 100%
    .play
      box-sizing border-box
      width 135px
      padding 7px 0
      margin 0 auto
      text-align center
      border 1px solid $color-theme
      color $color-theme
      border-radius 100px
      font-size 0
      .icon-play
        display inline-block
        vertical-align middle
        margin-right 6px
        font-size $font-size-medium-x
      .text
        display inline-block
        vertical-align middle
        font-size $font-size-small
  .bg-layer
    position relative
    height 100%
    background $color-background
  .list
    position fixed
    top 0
    bottom 0
    width 100%
    background $color-background
    .song-list-wrapper
      padding 20px 30px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%) // 实现垂直居中
    .tips-container
      text-align center
      font-size $font-size-medium-x
      color $color-text-d
</style>
