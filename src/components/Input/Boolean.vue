<template>
  <Node
    title="Boolean"
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
  name: 'Boolean',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      inputs: [],
      outputs: [{
        text: 'true',
        vec: 1,
        tip: ''
      }, {
        text: 'false',
        vec: 1,
        tip: ''
      }]
    }
  },
  methods: {
    getExpression() {
      const uid = this.value.uid
      return `
        float ${uid}_output_1_i0 = 1.0;
        float ${uid}_output_1_i1 = 0.0;
      `
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';
</style>
