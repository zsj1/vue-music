<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" :key="index" class="item">
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type='text/ecmascript-6'>
export default {
  props: {
    songs: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer}·${song.album}`
    },
    selectItem (item, index) { // 基础组件不处理业务逻辑，向父组件进行派发即可
      this.$emit('select', item, index)
    }
  }
}
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    .content
      flex 1
      line-height 20px
      overflow hidden
      .name
        no-wrap()
        color $color-text
      .desc
        margin-top 4px
        no-wrap()
        color $color-text-d
</style>
