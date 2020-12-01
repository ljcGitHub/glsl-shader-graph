<template>
  <Node title="Slider" :outputs="outputs" v-model="value">
    <div style="border-top: 1px solid #232323;background-color: #393939;">
      <div class="slider-wrapper">
        <el-slider
          style="width: 160px"
          v-model="val"
          :show-tooltip="false"
          :format-tooltip="formatTooltip"
          @change="change"
        ></el-slider>
        <span class="slider-tip slider-val">{{ value.vector.constValue }}</span>
      </div>
      <div class="slider-block">
        <span class="slider-tip">Min</span>
        <el-input style="width: 60px" v-model="value.vector.min"></el-input>
        <span class="slider-tip">Max</span>
        <el-input style="width: 60px" v-model="value.vector.max"></el-input>
      </div>
    </div>
  </Node>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    value: {
      type: Object
    }
  },
  created() {
    if (!this.value.vector.min) {
      this.$set(this.value.vector, 'min', 0)
    }
    if (!this.value.vector.max) {
      this.$set(this.value.vector, 'max', 1)
    }
    if (!this.value.vector.constValue) {
      this.val = 50
      this.$set(this.value.vector, 'constValue', 0.5)
    } else {
      this.val = this.value.vector.constValue * 100
    }
  },
  data() {
    return {
      val: 50,
      inputs: [],
      outputs: [{
        text: 'Out',
        vec: 1,
        tip: ''
      }]
    }
  },
  methods: {
    formatTooltip() {
      const { min, max } = this.value.vector
      const val = min + max * this.val / 100
      this.value.vector.constValue = val
      return val
    },
    getExpression() {
      const value = this.value
      const targetVector = value.vector
      const uid = value.uid
      return `
        float ${uid} = ${targetVector.constValue};
        float ${uid}_output_1_i0 = ${uid};
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

.slider-wrapper {
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

.slider-block {
  display: flex;
  justify-content: center;
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

.slider-tip {
  margin: 0 5px;
  font-size: 12px;
  color: #fff;
}

.slider-val {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
}
</style>
