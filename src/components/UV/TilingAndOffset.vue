<template>
  <Node
    title="Tiling And Offset"
    :inputs="inputs"
    :outputs="outputs"
    v-model="value"
  >
    <div style="width:100%;height:120px;background-color:#898989;">

    </div>
  </Node>
</template>

<script>
export default {
  name: 'TilingAndOffset',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      inputs: [{
        text: 'UV',
        vec: 2,
        tip: 'UV值'
      }, {
        text: 'Tiling',
        vec: 2,
        tip: 'UV的缩放比例'
      }, {
        text: 'Offset',
        vec: 2,
        tip: 'UV的偏移值'
      }],
      outputs: [{
        text: 'Out',
        vec: 2,
        tip: '输出值'
      }]
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';

</style>
