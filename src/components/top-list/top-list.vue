<template>
  <music-list
    :title="title"
    :loadingFlag="loadingFlag"
    :bgImage="bgImage"
    :songs="songs"
    :rank="rank"
  ></music-list>
</template>
<script type='text/ecmascript-6'>
import { createSong } from 'common/js/song'
import { getMusicList } from 'api/rank'
import { getSongVkey } from 'api/song'
import { ERR_OK } from 'api/config'
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      songs: [],
      loadingFlag: true,
      rank: true
    }
  },
  created () {
    this._getMusicList()
  },
  methods: {
    _getMusicList () {
      this.loadingFlag = true
      if (!this.top.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.top.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      const ret = []
      list.forEach((item) => {
        const data = item.data
        if (data.songid && data.albummid) {
          getSongVkey(data.strMediaMid).then((res) => {
            if (res.req_0.data.midurlinfo.length > 0) {
              const purl = res.req_0.data.midurlinfo[0].purl ? res.req_0.data.midurlinfo[0].purl : ''
              if (purl) {
                ret.push(createSong(data, purl))
              }
            }
          })
        }
      })
      if (ret.length === 0) {
        this.loadingFlag = false
      }
      return ret
    }
  },
  computed: {
    title () {
      return this.top.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'top'
    ])
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
</style>
