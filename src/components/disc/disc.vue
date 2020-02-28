<template>
  <music-list
    :title="title"
    :bgImage="bgImage"
    :loadingFlag="loadingFlag"
    :songs="songs"
  ></music-list>
</template>
<script type='text/ecmascript-6'>
import { mapGetters } from 'vuex'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
import { getSongVkey } from 'api/song'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'

export default {
  components: {
    MusicList
  },
  data () {
    return {
      songs: [],
      loadingFlag: true
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      this.loadingFlag = true
      if (!this.disc.tid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.tid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs (list) {
      const ret = []
      list.forEach((item) => {
        getSongVkey(item.mid).then((res) => {
          const purl = res.req_0.data.midurlinfo[0].purl
          if (item.id && item.album.mid && purl) {
            ret.push(createSong({
              songid: item.id,
              songmid: item.mid,
              singer: item.singer,
              songname: item.name,
              albumname: item.album.name,
              interval: item.interval,
              albummid: item.album.mid
            }, purl))
          }
        })
      })
      if (ret.length === 0) {
        this.loadingFlag = false
      }
      return ret
    }
  },
  computed: {
    title () {
      return this.disc.title
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
</style>
