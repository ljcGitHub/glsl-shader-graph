<template>
  <Node
    title="Time"
    :inputs="inputs"
    :outputs="outputs"
    v-model="value"
    style="width: 155px"
  >
    <div style="width:100%;"></div>
  </Node>
</template>

<script>
export default {
  name: 'Time',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      inputs: [],
      outputs: [{
        text: 'Time',
        vec: 1,
        tip: ''
      }, {
        text: 'Sin Time',
        vec: 1,
        tip: ''
      }, {
        text: 'Cos Time',
        vec: 1,
        tip: ''
      }]
    }
  },
  methods: {
    getCode() {
      return `
        uniform float u_time;
      `
    },
    getExpression() {
      const uid = this.value.uid
      return `
        float ${uid}_output_1_i0 = u_time;
        float ${uid}_output_1_i1 = sin(u_time);
        float ${uid}_output_1_i2 = cos(u_time);
      `
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';

</style>
