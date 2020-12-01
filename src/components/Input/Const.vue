<template>
  <Node title="Const" :outputs="outputs" v-model="value">
    <div style="border-top: 1px solid #232323;background-color: #393939;">
      <div class="input-block">
        <span class="input-tip">X</span>
        <el-input style="width: 60px" v-model="value.vector.x" @change="change"></el-input>
        <span class="input-tip">Y</span>
        <el-input style="width: 60px" v-model="value.vector.y" @change="change"></el-input>
      </div>
      <div class="input-block">
        <span class="input-tip">Z</span>
        <el-input style="width: 60px" v-model="value.vector.z" @change="change"></el-input>
        <span class="input-tip">W</span>
        <el-input style="width: 60px" v-model="value.vector.w" @change="change"></el-input>
      </div>
    </div>
  </Node>
</template>

<script>
export default {
  name: 'Const',
  props: {
    value: {
      type: Object
    }
  },
  created() {
    if (!this.value.vector.x) {
      this.$set(this.value.vector, 'x', 1)
    }
    if (!this.value.vector.y) {
      this.$set(this.value.vector, 'y', 1)
    }
    if (!this.value.vector.z) {
      this.$set(this.value.vector, 'z', 1)
    }
    if (!this.value.vector.w) {
      this.$set(this.value.vector, 'w', 1)
    }
  },
  data() {
    return {
      inputs: [],
      outputs: [{
        text: 'Out',
        vec: 4,
        tip: ''
      }]
    }
  },
  methods: {
    getExpression() {
      const value = this.value
      const targetVector = value.vector
      const uid = value.uid
      const { x, y, z, w } = targetVector
      return `
        vec4 ${uid}_output_4_i0 = vec4(${x}, ${y}, ${z}, ${w});
      `
    },
    change() {
      this.$mutations.commit('refresh')
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';

.input-wrapper {
  position: relative;
  padding: 6px 12px;

  .el-slider__bar {
    background-color: transparent;
  }

  .el-slider__runway {
    margin: 6px 0;
    background-color: #747373;
  }
}

.input-block {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 6px 6px;

  .el-input__inner {
    padding: 0 6px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    color: #fff;
    background-color: #414141;
  }
}

.input-tip {
  margin: 0 5px;
  font-size: 12px;
  color: #fff;
}

</style>
