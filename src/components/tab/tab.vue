<template>
  <div class="tab">
    <router-link
      tag="div"
      class="tab-item"
      v-for="(item, index) in tabData"
      :key="index"
      :to="item.to"
    >
      <span class="tab-link">{{ item.name }}</span>
    </router-link>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'tab',
  data () {
    return {
      tabData: [
        {
          name: '推荐',
          to: 'recommend'
        },
        {
          name: '歌手',
          to: '/singer'
        },
        {
          name: '排行',
          to: 'rank'
        },
        {
          name: '搜索',
          to: 'search'
        }
      ]
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.tab
  display flex
  height 44px
  line-height 44px
  font-size $font-size-medium
  .tab-item
    flex 1
    text-align center
    .tab-link
      padding-bottom 5px
      color $color-text-l
    &.router-link-active
      .tab-link
        color $color-theme
        border-bottom 2px solid $color-theme
</style>
