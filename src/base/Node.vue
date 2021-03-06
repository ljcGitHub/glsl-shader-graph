<template>
  <div
    class="card"
    :id="value.uid"
    :style="cardStyle"
    :class="{ active: $state.selectNodes.includes(value.uid) }"
    ref="card"
  >
    <el-card shadow="never">
      <div class="card-header" slot="header" ref="header">
        <span>{{ title }}</span>
        <div class="card-arrow" :class="{ active: more }" @click="moreHandle">
          <i class="el-icon-arrow-up"></i>
        </div>
      </div>
      <div class="card-content">
        <div class="sides">
          <div class="sides-left" v-if="inputs.length" :style="inputStyle">
            <Vector
              v-for="(input, $index) in inputs"
              :key="$index"
              :text="input.text"
              :vec="input.vec"
              :tip="input.tip"
              :hideText="hideText"
              :uid="`${value.uid}-input-${input.vec}-i${$index}`"
              type="input"
              ref="input"
              @vectorStart="(e, uid) => vectorStart(e, uid, input.vec, 'input')"
              @vectorMore="(e, uid) => vectorMore(e, uid, input.vec, 'input')"
              @vectorEnd="(e, uid) => vectorEnd(e, uid, input.vec, 'input')"
            ></Vector>
          </div>
          <div
            class="sides-content"
            v-if="inputs.length && outputs.length"
          ></div>
          <div class="sides-right" v-if="outputs.length" :style="outputStyle">
            <Vector
              v-for="(output, $index) in outputs"
              :key="$index"
              :text="output.text"
              :vec="output.vec"
              :tip="output.tip"
              :hideText="hideText"
              :uid="`${value.uid}-output-${output.vec}-i${$index}`"
              type="output"
              ref="output"
              @vectorStart="
                (e, uid) => vectorStart(e, uid, output.vec, 'output')
              "
              @vectorMore="(e, uid) => vectorMore(e, uid, output.vec, 'output')"
              @vectorEnd="(e, uid) => vectorEnd(e, uid, output.vec, 'output')"
            ></Vector>
          </div>
        </div>
        <div v-show="more">
          <slot></slot>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import touchHandle from 'common/utils/touch'
import { style } from 'common/utils/dom'
import { guid, getVeotorRect } from 'common/utils/utils'
import Vue from 'vue'
import Link from 'base/Link'

const LinkInstance = Vue.extend(Link)
const createLink = function (optipn) {
  const link = new LinkInstance({
    propsData: optipn
  }).$mount()
  return link
}

export default {
  name: 'Node',
  props: {
    value: {
      type: Object
    },
    title: {
      type: String,
      default: ''
    },
    inputs: {
      type: Array,
      default: () => []
    },
    outputs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      more: true,
      hideText: false
    }
  },
  computed: {
    cardStyle() {
      const zIndex = this.$state.selectNodes.includes(this.value.uid) ? '10' : ''
      const transformCss = `translate(${this.value.x}px, ${this.value.y}px`
      return `${[style.transform]}: ${transformCss}; zIndex: ${zIndex}`
    },
    scale() {
      return this.$state.config.scale
    },
    inputStyle() {
      if (!this.more) return `height: 0px;margin: 0;padding: 0;`
      return `height: ${this.inputs.length * 28 + 12}px`
    },
    outputStyle() {
      if (!this.more) return `height: 0px;margin: 0;padding: 0;`
      return `height: ${this.outputs.length * 28 + 12}px`
    }
  },
  mounted() {
    const touchHandleDestroy = touchHandle(this.$refs.header, {
      start: this.start,
      move: this.move,
      end: this.end
    })
    this.$once('hook:beforeDestroy', () => {
      touchHandleDestroy()
    })
  },
  methods: {
    moreHandle() {
      if (this.more) {
        this.more = false
        this.closePos()
      } else {
        this.more = true
        this.openPos()
      }
      this.$nextTick(() => this.uploadAllLine())
    },
    start(e) {
      this.$state.selectNodeId = this.value.uid
      if (!this.$state.selectNodes.includes(this.value.uid)) {
        // 之前没选中当前节点
        this.$mutations.selectNode(this.value.uid)
        // 选中了节点，判断是否叠加其他选中节点
        if (!e.shiftKey) {
          this.$mutations.radioSelectNode(this.$state.selectNodeId)
        }
      } else {
        // 有其他选中节点， 判断是否叠加其他选中节点，还是单选
        if (e.shiftKey) {
          this.$mutations.eliminateSelectNode(this.value.uid)
        }
      }
      this.$bus.$emit('start', e)
    },
    move(e) {
      this.$bus.$emit('move', e)
    },
    end(e) {
      this.$bus.$emit('end', e)
    },
    translate(x, y) {
      if (this.$refs.card) {
        this.value.x = x
        this.value.y = y
        this.$refs.card.style.zIndex = 10
      }
    },
    vectorStart(e, uid, vec, type) {
      // 检查是否存在已经连接的线
      let pos1 = null
      let pos2 = null
      let lining = null
      if (type === 'input' && this.value.vector[uid]) {
        const targetNodes = this.value.vector[uid]
        pos1 = getVeotorRect(document.getElementById(targetNodes.target)) // 源坐标
        pos2 = getVeotorRect(document.getElementById(uid)) // 自己坐标
        lining = createLink({ vec: targetNodes.vec, uid: guid(), pos: [pos1.x, pos1.y, pos2.x, pos2.y] })
        this.sourceUid = targetNodes.target
        this.removeNodeUid(targetNodes.target, uid)
        this.inputVectorMode = this.value.vector[uid]
        delete this.value.vector[uid]
      } else {
        pos1 = getVeotorRect(document.getElementById(uid)) // 源坐标
        let x = this.type === 'input' ? pos1.x + 1 : pos1.x - 1
        let y = this.type === 'input' ? pos1.y + 1 : pos1.y - 1
        pos2 = { x, y }
        lining = createLink({ vec, uid: guid(), pos: [pos1.x, pos1.y, pos2.x, pos2.y] })
        document.querySelector('.svg').appendChild(lining.$el)
        this.sourceUid = uid
        this.inputVectorMode = null
      }
      this.distanceX = e.pageX // 开始坐标
      this.distanceY = e.pageY // 开始坐标
      this.lining = lining
      this.targetUid = null
    },
    vectorMore(e, uid, vec, type) {
      if (this.inputVectorMode) {
        const targetNodes = this.inputVectorMode
        const targetUid = this.hitVeotor(targetNodes.target)
        const pos = this.lining.pos
        let x = pos[2] + e.pageX - this.distanceX
        let y = pos[3] + e.pageY - this.distanceY
        if (targetUid) {
          // 已经命中
          const pos2 = getVeotorRect(document.getElementById(targetUid)) // 源坐标
          x = pos2.x
          y = pos2.y
          this.targetUid = targetUid
        } else {
          this.targetUid = null
        }
        const line = document.getElementById(targetNodes.lineUid)
        line.setAttribute('d', this.lining.calcPath(pos[0], pos[1], x, y))
      } else {
        const targetUid = this.hitVeotor(uid)
        const pos = this.lining.pos
        let x = pos[0] + e.pageX - this.distanceX
        let y = pos[1] + e.pageY - this.distanceY
        if (targetUid) {
          // 已经命中
          const pos2 = getVeotorRect(document.getElementById(targetUid)) // 源坐标
          x = pos2.x
          y = pos2.y
          this.targetUid = targetUid
        } else {
          this.targetUid = null
        }
        this.lining.lineUpdate(pos[0], pos[1], x, y)
      }
    },
    vectorEnd(e, uid, vec, type) {
      if (this.targetUid) {
        this.setNodeUid(this.sourceUid, this.targetUid, this.lining.uid)
        this.setNodeUid(this.targetUid, this.sourceUid, this.lining.uid)
        this.$mutations.commit('refresh')
      } else {
        if (this.inputVectorMode) {
          this.$mutations.commit('refresh')
        }
      }
      const svg = document.querySelector('.svg')
      if (svg) {
        for (let i = 0; i < svg.children.length; i++) {
          if (svg.children[i] === this.lining.$el) {
            svg.removeChild(this.lining.$el)
            break
          }
        }
      }
      this.lining.$destroy()
    },
    hitVeotor(sourceUid) {
      // 是否命中节点
      const targetElement = document.querySelector('.vector:hover')
      if (targetElement) {
        const targetUid = targetElement.getAttribute('id')
        const [targetNodeUid, targetType] = targetUid.split('-')
        const [sourceNodeUid, sourceType] = sourceUid.split('-')
        if (targetNodeUid !== sourceNodeUid &&
          targetType !== sourceType) {
          return targetUid
        }
      }
      return null
    },
    setNodeUid(sourceUid, targetUid, liningUid) {
      const nodes = this.$state.nodes
      const [targetNodeUid, targetType] = targetUid.split('-')
      const sourceVec = sourceUid.split('-')[2]
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.uid === targetNodeUid) {
          if (node.vector[targetUid] && targetType === 'input') {
            // 删除上一个连接节点
            const oldTargetUid = node.vector[targetUid].target
            const [oldTargetUidNodeUid] = oldTargetUid.split('-')
            for (let j = 0; j < nodes.length; j++) {
              const oldNode = nodes[j]
              if (oldNode.uid === oldTargetUidNodeUid) {
                const _vector = oldNode.vector[oldTargetUid]
                if (_vector.constructor === Array) {
                  for (let k = 0; k < _vector.length; k++) {
                    const _outputs = _vector[k]
                    if (_outputs.target === targetUid) {
                      _vector.splice(k, 1)
                      break
                    }
                  }
                  if (_vector.length === 0) delete oldNode.vector[oldTargetUid]
                } else {
                  delete oldNode.vector[oldTargetUid]
                }
                break
              }
            }
          }
          if (targetType === 'output') {
            if (!node.vector[targetUid]) node.vector[targetUid] = []
            node.vector[targetUid].push({
              lineUid: liningUid,
              type: targetType,
              vec: sourceVec,
              source: targetUid,
              target: sourceUid
            })
          } else {
            node.vector[targetUid] = {
              lineUid: liningUid,
              type: targetType,
              vec: sourceVec,
              source: targetUid,
              target: sourceUid
            }
          }
          break
        }
      }
    },
    removeNodeUid(targetUid, sourceUid) {
      const nodes = this.$state.nodes
      const [targetNodeUid, targetNodeType] = targetUid.split('-')
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.uid === targetNodeUid) {
          if (targetNodeType === 'output') {
            if (node.vector[targetUid].length > 1) {
              const _tn = node.vector[targetUid]
              for (let j = 0; j < _tn.length; j++) {
                if (sourceUid === _tn[j].target) {
                  node.vector[targetUid].splice(j, 1)
                }
              }
            } else {
              delete node.vector[targetUid]
            }
          } else {
            delete node.vector[targetUid]
          }
          break
        }
      }
    },
    uploadAllLine() {
      const vector = this.value.vector
      const lining = createLink({ vec: 1, uid: guid(), pos: [0, 1, 2, 2] })
      for (const x in vector) {
        const _vector = vector[x]
        let list = _vector
        if (_vector.constructor !== Array) list = [_vector]
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          const line = document.getElementById(item.lineUid)
          if (line) {
            const pos1 = getVeotorRect(document.getElementById(item.source))
            const pos2 = getVeotorRect(document.getElementById(item.target))
            line.setAttribute('d', lining.calcPath(pos1.x, pos1.y, pos2.x, pos2.y))
          }
        }
      }
      lining.$destroy()
    },
    openPos() {
      const input = this.$refs.input
      const output = this.$refs.output
      input && this.resetPos(input)
      output && this.resetPos(output)
    },
    closePos() {
      const input = this.$refs.input
      const output = this.$refs.output
      input && this.specifiedPos(input, -1)
      output && this.specifiedPos(output)
    },
    specifiedPos(nodes, direction = 1) {
      const _angle = 180 / (nodes.length + 1)
      const header = this.$refs.header
      const radius = header.clientHeight / 2 // 头部高度 / 2
      const height = 6 // 圆圈高度 / 2
      const deg = Math.PI / 180 // 度数
      const distanceX = direction === 1 ? header.clientWidth - radius : radius
      let angle = _angle
      this.hideText = true
      nodes.forEach(item => {
        const el = item.$el
        el.style.top = `${radius - radius * Math.cos(angle * deg) - height}px`
        el.style.left = `${distanceX + radius * direction * Math.sin(angle * deg) - height}px`
        angle += _angle
      })
    },
    resetPos(nodes) {
      this.hideText = false
      nodes.forEach(item => {
        const el = item.$el
        el.style.top = ''
        el.style.left = ''
      })
    }
  },
  watch: {
    cardStyle() {
      this.uploadAllLine()
    },
    scale() {
      this.uploadAllLine()
    }
  }
}

</script>

<style lang="stylus">
@import '~common/style/variable';

.card {
  position: absolute;
  width: 220px;
  z-index: 5;

  &.active {
    .el-card {
      border: 1px solid #fff;
    }
  }

  .el-card {
    color: $font-color;
    background-color: transparent;
    border: 1px solid $body-background-color;
    border-radius: 20px;
  }

  .el-card__header {
    padding: 0;
    border-bottom: 1px solid $body-background-color;
    background-color: #393939;
  }

  .el-card__body {
    padding: 0;
  }

  .el-collapse-item__header {
    display: none;
  }

  .el-collapse-item__wrap {
    background-color: transparent;
  }

  .el-collapse-item__wrap, .el-collapse {
    border: 0px;
  }

  .el-collapse-item__content {
    padding: 0;
  }
}

.card-header {
  position: relative;
  padding: 12px 15px;
  height: 42px;
  line-height: 18px;

  &:hover {
    cursor: move;
    background-color: #424242;
  }
}

.card-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  transform: translateY(-50%);
  transition: transform 0.3s;
  background-color: #625f5f;
  border-radius: 50%;

  &.active {
    transform: translateY(-50%) rotate(180deg);
  }

  &:hover {
    cursor: pointer;
    background-color: #4f4d4d;
  }
}

.card-content {
  background-color: transparent;
  overflow: hidden;
}

.sides {
  display: flex;
  width: 100%;
  color: #fff;
  background-color: rgba(57, 57, 57, 0.8);

  .sides-left {
    margin: 2px 0;
    padding: 6px 0 6px 6px;
    width: 100%;
  }

  .sides-content {
    width: 2px;
    background-color: $body-background-color;
  }

  .sides-right {
    margin: 2px 0;
    padding: 6px 6px 6px 0;
    width: 100%;

    .vector {
      flex-direction: row-reverse;
    }
  }
}
</style>
