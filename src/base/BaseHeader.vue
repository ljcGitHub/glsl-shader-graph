<template>
  <header class="header">
    <div class="header-left">
      <ButtonGroup :data="nodes"></ButtonGroup>
    </div>
    <div class="header-right">
      <ButtonGroup :data="setting"></ButtonGroup>
    </div>
  </header>
</template>

<script>
import * as Components from 'components/zIndex'

export default {
  name: 'BaseHeader',
  data() {
    return {
      nodes: [],
      setting: []
    }
  },
  created() {
    this.nodes = [{
      title: 'UV',
      list: [{
        text: 'TilingAndOffset',
        onClick: () => this.createNode(Components.TilingAndOffset.name)
      }]
    }]
    this.setting = [{
      title: '前进后退',
      list: [{
        text: '前进',
        onClick: () => this.$mutations.nextStep()
      }, {
        text: '后退',
        onClick: () => this.$mutations.prevStep()
      }]
    }]
  },
  methods: {
    createNode(name) {
      this.$mutations.commit('addNodes', { name })
    }
  }

}

</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  background-color: rgba(66, 66, 66, 0.8);
}

.header-left {
  padding: 0 10%;
  width: 100%;
}

.header-right {
  width: 100%;
  text-align: right;
}
</style>
