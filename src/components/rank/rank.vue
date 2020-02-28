<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="scroll">
      <ul>
        <li
          class="item"
          v-for="(item, index) in topList"
          :key="index"
          @click="selectTop(item)"
        >
          <div class="icon">
            <img v-lazy="item.picUrl" width="100" height="100" />
          </div>
          <ul class="songlist">
            <li
              class="song"
              v-for="(song, index) in item.songList"
              :key="index"
            >
              <span>{{index + 1}}.</span>
              <span v-html="song.songname"></span>
              <span>-</span>
              <span v-html="song.singername"></span>
            </li>
          </ul>
        </li>
      </ul>
      <div v-show="!topList.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script type='text/ecmascript-6'>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { playListMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    handlePlayList (playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectTop (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTop(item)
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTop: 'SET_TOP'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 20px
      height 100px
      .icon
        flex 0 0 100px
        width 100px
        height 100px
      .songlist
        flex 1
        display flex
        padding 0 20px
        flex-direction column
        justify-content center
        height 100px
        overflow hidden
        background $color-highlight-background
        font-size $font-size-small
        color $color-text-d
        .song
          line-height 26px
          no-wrap()
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%) // 实现垂直居中
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
