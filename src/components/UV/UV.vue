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
        vec: 4,
        tip: '输出值'
      }]
    }
  },
  methods: {
    getExpression() {
      return `
        vec4 ${this.value.uid}_output_4_i0 = vec4(vUv, 0.0, 0.0);
      `
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';
</style>
