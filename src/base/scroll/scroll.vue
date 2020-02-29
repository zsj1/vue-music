<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type='text/ecmascript-6'>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    pulldown: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 是否开启滚动监听
      if (this.listenScroll) {
        const _this = this
        this.scroll.on('scroll', pos => {
          _this.$emit('scroll', pos)
        })
      }
      // 是否开启上拉加载
      if (this.pullup) {
        const _this = this
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            _this.$emit('scrollToEnd')
          }
        })
      }
      // 是否开启下拉刷新
      if (this.pulldown) {
        const _this = this
        this.scroll.on('touchEnd', (pos) => {
          if (pos.y > 40) {
            _this.$emit('pulldown')
          }
        })
      }
      // 是否开启上拉动作监听
      if (this.beforeScroll) {
        const _this = this
        this.scroll.on('beforeScrollStart', () => {
          _this.$emit('beforeScroll')
        })
      }
    },
    // 代理如下方法
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      // 为了传入arguments，使用apply方法
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'></style>
