<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="distList">
      <div>
        <div v-if="sliderData.length" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in sliderData" :key="index">
              <a :href="item.linkUrl">
                <img
                  class="needsclick"
                  @load="loadImage()"
                  :src="item.picUrl"
                />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in distList" :key="index" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="!distList.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
export default {
  name: 'recommend',
  data () {
    return {
      sliderData: [],
      distList: []
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.sliderData = res.data.slider
        }
      })
    },
    _getDiscList () {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.distList = res.data.list
        }
      })
    },
    loadImage () {
      // 为了确保轮播图的任意一张图片加载完成，撑开高度
      // 其实最新的better-scroll已经不需要这样做了，好像会默认观察dom渲染完成后自动刷新
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend-content
    height 100%
    overflow hidden
    div
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
        .slider-item
          float left
          box-sizing border-box
          overflow hidden
          text-align center
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        ul
          .item
            display flex
            box-sizing border-box
            align-items center
            padding 0 20px 20px 20px
            .icon
              flex 0 0 60px
              width 60px
              padding-right 20px
            .text
              flex 1
              display flex
              line-height 20px
              flex-direction column
              justify-content center
              overflow hidden
              font-size $font-size-medium
              .name
                margin-bottom 10px
                color $color-text
              .desc
                color $color-text-d
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%) // 实现垂直居中
</style>
