<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器不是个路由组件，而是全局中都可以调出的 -->
    <player></player>
  </div>
</template>
<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
