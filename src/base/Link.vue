<template>
  <path
    class="line"
    :id="uid"
    :class="`vec${this.vec}`"
    :d="d"
  />
</template>

<script>
export default {
  name: 'Link',
  props: {
    pos: {
      type: Array,
      default: () => []
    },
    vec: {
      type: [Number, String],
      default: 1
    },
    uid: {
      type: String
    }
  },
  data() {
    return {
      type: 'vec1',
      d: '',
      active: false
    }
  },
  created() {
    this.lineUpdate.apply(this, this.pos)
  },
  methods: {
    lineUpdate(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
      this.d = this.calcPath(x1, y1, x2, y2)
    },
    calcPath(x1, y1, x2, y2) {
      if (this.$state.config.lineStyle === 'straight-line') {
        return `M ${x1} ${y1} L ${x2} ${y2}`
      } else {
        return `M ${x1},${y1} C ${x2},${y1} ${x1},${y2},${x2},${y2}`
      }
    }
  }
}

</script>

<style lang="stylus">
@import '~common/style/variable';

.line {
  stroke-width: 2;
  stroke: #b2b2b2;
  fill: none;
}
</style>
