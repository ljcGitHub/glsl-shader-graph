<template>
  <div>
    <div
      class="right-click-menu"
      v-if="rightMenuVisible"
      :style="menuStyle"
      @mouseleave="rightMenuHide"
    >
      <div class="right-click-title">右键菜单</div>
      <div class="right-click-item" @click="copyNode"><span>复制</span><span>C</span></div>
      <div class="right-click-item" @click="pasteNode"><span>粘贴</span><span>V</span></div>
      <div class="right-click-item" @click="deleteNode"><span>删除</span><span>X</span></div>
    </div>
  </div>
</template>

<script>
import { addEvent } from 'common/utils/dom'
import { guid } from 'common/utils/utils'

export default {
  name: 'Shortcuts',
  data() {
    return {
      copyNodes: [],
      rightMenuVisible: false,
      rightMenu: { x: 0, y: 0 }
    }
  },
  created() {
    this.rightMenuHandle()
    this.documentClick()
    this.$bus.$on('start', this.start)
    this.$bus.$on('move', this.move)
    this.$bus.$on('end', this.end)
  },
  computed: {
    menuStyle() {
      return `left: ${this.rightMenu.x}px; top: ${this.rightMenu.y}px;`
    },
    disabled() {
      return !this.$state.selectNodes.length
    }
  },
  methods: {
    start(e) {
      this.distanceX = e.pageX
      this.distanceY = e.pageY
      const nodes = this.$state.nodes
      const selectNodes = this.$state.selectNodes
      const startNodes = []
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (selectNodes.includes(node.uid)) {
          startNodes.push({
            i: i,
            uid: node.uid,
            x: node.x,
            y: node.y
          })
        }
      }
      this.startNodes = startNodes
    },
    move(e) {
      const startNodes = this.startNodes
      for (let i = 0; i < startNodes.length; i++) {
        const startNode = startNodes[i]
        const node = this.$state.nodes[startNode.i]
        node.x = startNode.x + e.pageX - this.distanceX
        node.y = startNode.y + e.pageY - this.distanceY
      }
    },
    end(e) {
      this.$mutations.commit('refresh')
    },
    documentClick() {
      const that = this
      addEvent(document, 'mouseup', function(e) {
        if (e.button === 2 || that.rightMenuVisible) return false
        if (!that.$state.selectNodeTag) {
          that.$mutations.clearSelectNode()
        }
        that.$state.selectNodeTag = false
      })
    },
    rightMenuHandle() {
      const that = this
      window.oncontextmenu = function (e) {
        e.preventDefault()
        that.rightMenuVisible = true
        that.rightMenu.x = e.clientX - 120
        that.rightMenu.y = e.clientY - 40
      }
    },
    rightMenuHide() {
      this.rightMenuVisible = false
    },
    copyNode() {
      this.rightMenuHide()
      if (this.disabled) {
        this.$message.error('请选中需要复制的节点')
        return false
      }
      this.copyNodes = this.$state.selectNodes.slice()
    },
    pasteNode() {
      this.rightMenuHide()
      if (!this.copyNodes.length) {
        this.$message.error('请选择复制的节点')
        return false
      }
      const nodes = this.$state.nodes
      let copyNodes = {}
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (this.copyNodes.includes(node.uid)) {
          copyNodes[node.uid] = node
        }
      }
      let copyNodesStr = JSON.stringify(copyNodes)
      const selectNodes = []
      for (const x in copyNodes) {
        const node = copyNodes[x]
        const nodeUid = node.uid
        const reg = new RegExp(nodeUid, 'g')
        const newNodeUid = guid()
        copyNodesStr = copyNodesStr.replace(reg, newNodeUid)
        selectNodes.push(newNodeUid)
        for (const key in node.vector) {
          const reg2 = new RegExp(node.vector[key].lineUid, 'g')
          copyNodesStr = copyNodesStr.replace(reg2, guid())
        }
      }
      copyNodes = JSON.parse(copyNodesStr)
      this.$mutations.commit('addAllNodes', Object.keys(copyNodes).map(k => copyNodes[k]))
      this.$state.selectNodes = selectNodes
    },
    deleteNode() {
      this.rightMenuHide()
      if (this.disabled) {
        this.$message.error('请选择删除的节点')
        return false
      }
      const nodes = this.$state.nodes.slice()
      const selectNodes = this.$state.selectNodes
      this.$mutations.commit('setNodes', nodes.filter(node => !selectNodes.includes(node.uid)))
    }
  }
}

</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.right-click-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  background-color: rgba(31, 31, 31, 0.8);
  border: 1px solid #3d3d3d;
  border-radius: 8px;
  z-index: 100;
  overflow: hidden;

  .right-click-title {
    padding: 12px 12px;
    width: 100%;
    line-height: 1;
    color: #fff;
    font-size: 14px;
    border-bottom: 1px solid #3d3d3d;
  }

  .right-click-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 8px 24px;
    width: 100%;
    line-height: 1;
    color: #fff;
    font-size: 12px;

    &:hover {
      background-color: #547ab5;
    }
  }
}
</style>
