<template>
  <Node
    title="Tiling And Offset"
    :inputs="inputs"
    :outputs="outputs"
    v-model="value"
  >
    <div style="width: 100%">
      <Debugger :uid="value.uid" :fragColor="`vec4(${this.value.uid}_output_2_i0, 0.0, 1.0)`"></Debugger>
    </div>
  </Node>
</template>

<script>
import { vecSetValue } from 'common/utils/utils'

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
  },
  methods: {
    getCode() {
      return `
        vec2 TilingAndOffset(vec2 UV, vec2 Tiling, vec2 Offset){
          return UV * Tiling + Offset;
        }
      `
    },
    getExpression() {
      const value = this.value
      const targetVector = value.vector
      const uid = value.uid
      const input1 = targetVector[`${uid}-input-2-i0`]
      const input2 = targetVector[`${uid}-input-2-i1`]
      const input3 = targetVector[`${uid}-input-2-i2`]
      let reg1 = input1 ? vecSetValue(input1.target.replace(/-/g, '_'), 2, input1.vec) : 'gl_FragCoord.xy'
      let reg2 = input2 ? vecSetValue(input2.target.replace(/-/g, '_'), 2, input2.vec) : 'vec2(1, 1)'
      let reg3 = input3 ? vecSetValue(input3.target.replace(/-/g, '_'), 2, input3.vec) : 'vec2(1, 1)'
      return `
        vec2 ${uid} = TilingAndOffset(${reg1}, ${reg2}, ${reg3});
        vec2 ${uid}_output_2_i0 = ${uid};
      `
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';
</style>
