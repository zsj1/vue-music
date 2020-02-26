<template>
  <div class="singer">
    <list-view
      :data="this.singers"
      @select="selectSinger"
    ></list-view>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/list-view/list-view'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10
export default {
  name: 'singer',
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSingers(res.data.list)
        }
      })
    },
    _normalizeSingers (list) {
      const singerMap = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((singer, index) => {
        // 热门
        if (index < HOT_SINGER_LEN) {
          singerMap.hot.items.push(
            new Singer({
              id: singer.Fsinger_mid,
              name: singer.Fsinger_name
            })
          )
        }
        if (!Object.keys(singerMap).includes(singer.Findex)) {
          singerMap[singer.Findex] = {
            title: singer.Findex,
            items: []
          }
        }
        singerMap[singer.Findex].items.push(
          new Singer({
            id: singer.Fsinger_mid,
            name: singer.Fsinger_name
          })
        )
      })
      // 处理map变为有序列表
      const hot = []
      const ret = []
      for (const key in singerMap) {
        const val = singerMap[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return [...hot, ...ret]
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.singer
  position fixed
  width 100%
  top 88px
  bottom 0
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
