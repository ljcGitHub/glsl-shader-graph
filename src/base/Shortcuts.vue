<template>
  <div>
    <div class="right-click-menu" v-if="rightMenuShow">
      <div class="right-click-title">右键菜单</div>
      <div class="right-click-item" v-for="(menu, $index) in rightMenu" :key="$index">
        <span>{{menu.text}}</span>
        <span>{{menu.shortcuts}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import { addEvent, removeEvent } from 'common/utils/dom'
export default {
  name: 'Shortcuts',
  data() {
    return {
      rightMenu: [],
      rightMenuShow: false
    }
  },
  created() {
    this.rightMenu = [{
      text: '复制',
      shortcuts: 'C'
    }, {
      text: '粘贴',
      shortcuts: 'V'
    }, {
      text: '删除',
      shortcuts: 'X'
    }]
  },
  methods: {}
}

</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.right-click-menu {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 240px;
  background-color: rgba(31, 31, 31, 0.8);
  border: 1px solid #3d3d3d;
  border-radius: 8px;
  z-index: 100;
  overflow: hidden;

  .right-click-title {
    padding: 12px 12px;
    width: 100%;
    line-height: 1;
    color: #fff;
    font-size: 14px;
    border-bottom: 1px solid #3d3d3d;
  }

  .right-click-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 8px 24px;
    width: 100%;
    line-height: 1;
    color: #fff;
    font-size: 12px;

    &:hover {
      cursor: pointer;
      background-color: #547ab5;
    }
  }
}
</style>
