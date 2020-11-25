<template>
  <div class="vector" :id="uid" :class="{ omit: hideText }">
    <div class="vector-round" :class="vecType">
      <span v-if="active" class="vector-select"></span>
    </div>
    <div class="vector-text" :title="tip">
      {{ text }}<span style="font-size: 12px">({{ vec }})</span>
    </div>
  </div>
</template>

<script>
import touchHandle from 'common/utils/touch'

export default {
  name: 'Vector',
  props: {
    uid: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: '',
      masssage: '标题'
    },
    vec: {
      type: Number,
      default: 1,
      masssage: '变量值'
    },
    tip: {
      type: String,
      default: '',
      masssage: '提示'
    },
    type: {
      type: String,
      default: 'input',
      masssage: 'IO类型'
    },
    hideText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: true
    }
  },
  computed: {
    vecType() {
      if (this.vec === 2) return 'vec2'
      if (this.vec === 3) return 'vec3'
      if (this.vec === 4) return 'vec4'
      return 'vec'
    }
  },
  mounted() {
    this.inNode = null
    this.outNode = []
    const destroy = touchHandle(this.$el, {
      start: this.start,
      move: this.move,
      end: this.end
    })
    this.$once('hook:beforeDestroy', () => {
      destroy()
    })
  },
  methods: {
    start(e) {
      this.$emit('vectorStart', e, this.uid)
    },
    move(e) {
      this.$emit('vectorMore', e, this.uid)
    },
    end(e) {
      this.$emit('vectorEnd', e, this.uid)
    }
  }
}

</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.vector {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 28px;
  line-height: 28px;

  &:hover {
    cursor: pointer;
    opacity: 0.68;
  }

  &.omit {
    position: absolute;
    width: 12px;
    height: 12px;

    .vector-text {
      display: none;
    }
  }

  .vector-text {
    margin: 0 8px;
    color: $font-color;
    font-size: 14px;
  }

  .vector-round {
    position: relative;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid $vector-color;

    .vector-select {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 6px;
      height: 6px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background-color: $vector-color;
      overflow: hidden;
    }

    &.vec2 {
      border: 1px solid $vector2-color;

      .vector-select {
        background-color: $vector2-color;
      }
    }

    &.vec3 {
      border: 1px solid $vector3-color;

      .vector-select {
        background-color: $vector3-color;
      }
    }

    &.vec4 {
      border: 1px solid $vector4-color;

      .vector-select {
        background-color: $vector4-color;
      }
    }
  }
}
</style>
