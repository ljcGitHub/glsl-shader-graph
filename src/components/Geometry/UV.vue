<template>
  <Node
    title="UV"
    :inputs="inputs"
    :outputs="outputs"
    v-model="value"
    style="width: 140px"
  >
    <div style="width: 100%"></div>
  </Node>
</template>

<script>
export default {
  name: 'UV',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      inputs: [],
      outputs: [{
        text: 'Out',
        vec: 1,
        tip: '模型的UV坐标'
      }]
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';
</style>
