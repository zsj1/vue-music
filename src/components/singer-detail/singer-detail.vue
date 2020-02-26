<template>
  <music-list :bg-image="bgImage" :title="title" :songs="songs"></music-list>
</template>
<script type='text/ecmascript-6'>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data () {
    return {
      songs: []
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
      if (!this.singer.id) { // 在歌手页刷新的话singer会丢失变为空对象，所以直接回退路由
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    _normalizeSongs (list) {
      const ret = []
      list.forEach((item) => {
        const { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'>
</style>
