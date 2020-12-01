<template>
  <Node
    title="Multiply"
    :inputs="inputs"
    :outputs="outputs"
    v-model="value"
    style="width: 155px"
  >
    <div style="width:100%;"></div>
  </Node>
</template>

<script>
import { vecSetValue } from 'common/utils/utils'

export default {
  name: 'Multiply',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      inputs: [{
        text: 'A',
        vec: 1,
        tip: ''
      }, {
        text: 'B',
        vec: 1,
        tip: ''
      }],
      outputs: [{
        text: 'Out',
        vec: 4,
        tip: ''
      }]
    }
  },
  methods: {
    getCode() {
      return `
        vec4 Multiply(vec4 A, vec4 B){
          return A * B;
        }
      `
    },
    getExpression() {
      const value = this.value
      const targetVector = value.vector
      const uid = value.uid
      const input1 = targetVector[`${uid}-input-1-i0`]
      const input2 = targetVector[`${uid}-input-1-i1`]
      let reg1 = input1 ? vecSetValue(input1.target.replace(/-/g, '_'), 4, input1.vec) : 'vec4(0.0, 0.0, 0.0, 0.0)'
      let reg2 = input2 ? vecSetValue(input2.target.replace(/-/g, '_'), 4, input2.vec) : 'vec4(0.0, 0.0, 0.0, 0.0)'
      return `
        vec4 ${uid} = Multiply(${reg1}, ${reg2});
        vec4 ${uid}_output_4_i0 = ${uid};
      `
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';

</style>
