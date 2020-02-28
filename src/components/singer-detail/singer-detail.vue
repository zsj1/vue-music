<template>
  <music-list :bg-image="bgImage" :title="title" :songs="songs" :loadingFlag="loadingFlag"></music-list>
</template>
<script type='text/ecmascript-6'>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
import { getSongVkey } from 'api/song'
export default {
  data () {
    return {
      songs: [],
      loadingFlag: true
    }
  },
  created () {
    this._getDetail()
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([ // 相当于在组件中挂载在了一个singer属性
      'singer'
    ])
  },
  methods: {
    _getDetail () {
      this.loadingFlag = true
      if (!this.singer.id) { // 在歌手页刷新的话singer会丢失变为空对象，所以直接回退路由
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.name).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.song.list)
        }
      })
    },
    _normalizeSongs (list) {
      const ret = []
      list.forEach((item) => {
        getSongVkey(item.songmid).then((res) => {
          const purl = res.req_0.data.midurlinfo[0].purl
          if (item.songid && item.albummid && purl) {
            ret.push(createSong(item, purl))
          }
        })
      })
      if (ret.length === 0) {
        this.loadingFlag = false
      }
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
</style>
