<template>
  <Node
    title="Texture2D"
    :inputs="inputs"
    :outputs="outputs"
    v-model="value"
  >
    <div style="width: 100%">
      <Debugger :uid="value.uid" :fragColor="`${this.value.uid}_output_4_i0`"></Debugger>
    </div>
  </Node>
</template>

<script>
import { vecSetValue } from 'common/utils/utils'

export default {
  name: 'Texture2D',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      inputs: [{
        text: 'Texture',
        vec: 2,
        tip: ''
      }, {
        text: 'UV',
        vec: 2,
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
        uniform sampler2D u_texcoord;
        vec4 Texture2D(sampler2D texture, vec2 UV){
          return texture2D(texture, UV);
        }
      `
    },
    getExpression() {
      const value = this.value
      const targetVector = value.vector
      const uid = value.uid
      const input1 = targetVector[`${uid}-input-2-i0`]
      const input2 = targetVector[`${uid}-input-2-i1`]
      let reg1 = input1 ? vecSetValue(input1.target.replace(/-/g, '_'), 2, input1.vec) : 'u_texcoord'
      let reg2 = input2 ? vecSetValue(input2.target.replace(/-/g, '_'), 2, input2.vec) : 'vec2(0, 0)'
      return `
        vec4 ${uid} = Texture2D(${reg1}, ${reg2});
        vec4 ${uid}_output_4_i0 = ${uid};
      `
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';
</style>
