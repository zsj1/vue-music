import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () {
    this.handlePlayList(this.playList)
  },
  activated () {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList (newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('component must implement handlePlayList method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    },
    ...mapGetters([
      'playList',
      'currentSong',
      'sequenceList',
      'mode'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = shuffle(this.sequenceList)
      }
      // 保证切换模式的时候歌曲不变
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    _resetCurrentIndex (list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    // 手机端优化，在上滑的时候关闭键盘
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory({ query: this.query })
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query.trim()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
