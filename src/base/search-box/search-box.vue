<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" :placeholder="placeholder" v-model="query"/>
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>
<script type='text/ecmascript-6'>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    // 不用watch的原因还没说
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery)
    })
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    }
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable'
.search-box
  display flex
  width 100%
  height 40px
  padding 0 6px
  align-items center
  box-sizing border-box
  border-radius 6px
  background $color-highlight-background
  .icon-search
    font-size 24px
    color #222
  .box
    flex 1
    margin 0 5px
    line-height 18px
    outline 0
    background $color-highlight-background
    font-size $font-size-medium
    color $color-text
  .icon-dismiss
    font-size $font-size-medium-x
    color #222
</style>
