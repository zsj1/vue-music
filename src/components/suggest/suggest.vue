<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    @scrollToEnd="searchMore"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </scroll>
</template>
<script type='text/ecmascript-6'>
import Scroll from 'base/scroll/scroll'
import { createSong } from 'common/js/song'
import { getSongVkey } from 'api/song'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      singerLen: 0
    }
  },
  methods: {
    search () {
      this.hasMore = true
      search(this.query, this.page, perpage, Number(this.showSinger)).then((res) => {
        if (res.code === ERR_OK) {
          this._getRes(res.data).then((res) => {
            this.result = res
          })
          this._checkMore(res.data)
        }
      })
    },
    // 上拉刷新搜索更多
    searchMore () {
      // this.singerLen === this.result.length 这里的意思是如果第一次搜索所有歌曲都是付费的，就设置不可获取更多了
      if (this.singerLen === this.result.length) {
        this.hasMore = false
      }
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, perpage, Number(this.showSinger)).then((res) => {
        if (res.code === ERR_OK) {
          this._getRes(res.data).then((res) => {
            this.result = this.result.concat(res)
          })
          this._checkMore(res.data)
        }
      })
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singerName
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    // 检查是否可以加载更多
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    _getRes (data) {
      return new Promise((resolve, reject) => {
        let ret = []
        this.singerLen = 0
        if (data.zhida && data.zhida.zhida_singer) {
          ret.push({ ...data.zhida.zhida_singer, ...{ type: TYPE_SINGER } })
          this.singerLen = 1
        }
        if (data.song.list && data.song.list.length > 0) {
          this._normalizeSongs(data.song.list).then((res) => {
            ret = ret.concat(res.filter(item => item))
            resolve(ret)
          })
        } else {
          resolve(ret)
        }
      })
    },
    _normalizeSongs (list) {
      return new Promise((resolve, reject) => {
        const results = Promise.all(list.map((item) => this._getSongVkey(item)))
        resolve(results)
        // const ret = []
        // list.forEach((item) => {
        //   getSongVkey(item.songmid).then((res) => {
        //     if (res.req_0.data.midurlinfo.length > 0) {
        //       const purl = res.req_0.data.midurlinfo[0].purl ? res.req_0.data.midurlinfo[0].purl : ''
        //       console.log(item)
        //       if (item.songid && item.albummid && purl) {
        //         ret.push(createSong(item, purl))
        //         resolve(ret)
        //       }
        //     }
        //   })
        // })
      })
    },
    _getSongVkey (item) {
      return getSongVkey(item.songmid).then((res) => {
        if (res.req_0.data.midurlinfo.length > 0) {
          const purl = res.req_0.data.midurlinfo[0].purl ? res.req_0.data.midurlinfo[0].purl : ''
          if (item.songid && item.albummid && purl) {
            return Promise.resolve(createSong(item, purl))
          }
        }
      })
    }
  },
  components: {
    Scroll
  },
  watch: {
    query () {
      this.search()
    }
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.suggest
  height 100%
  overflow hidden
  .suggest-list
    padding 0 30px
    .suggest-item
      display flex
      align-items center
      padding-bottom 20px
      .icon
        flex 0 0 30px
        width 30px
      .name
        flex 1
        overflow hidden
        font-size $font-size-medium
        color $color-text-d
        .text
          no-wrap()
</style>
