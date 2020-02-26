<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Chicken Music</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'm-header'
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.m-header
  text-align center
  height 44px
  color $color-theme
  font-size 0
  .icon
    display inline-block
    vertical-align top
    margin 6px 9px 0 0
    width 30px
    height 32px
    bg-image('logo')
    background-size 30px 32px
  .text
    display inline-block
    line-height 44px
    font-size $font-size-large
</style>
