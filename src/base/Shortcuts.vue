<template>
  <div>
    <div
      class="right-click-menu"
      v-if="rightMenuVisible"
      :style="menuStyle"
      @mouseleave="rightMenuHide"
    >
      <div class="right-click-title">右键菜单</div>
      <div style="padding: 10px 0">
        <div class="search-item" @keyup.prevent.stop>
          <el-input
            placeholder="搜索节点"
            prefix-icon="el-icon-search"
            v-model="searchText"
          ></el-input>
        </div>
        <div class="right-click-line"></div>
        <template v-if="searchText.length">
          <div
            class="right-click-item"
            v-for="(node, $index) in nodes"
            :key="$index"
            @click="addNode(node)"
          >
            <span>{{ node }}</span>
          </div>
        </template>
        <template v-else>
          <div
            class="right-click-item"
            v-for="(node, $index) in components"
            :key="$index"
          >
            <span>{{ node.name }}</span
            ><i class="el-icon-arrow-right"></i>
            <div class="add-node">
              <div
                class="right-click-item"
                v-for="(child, $$index) in node.children"
                :key="$$index"
                @click="addNode(child)"
              >
                <span>{{ child }}</span>
              </div>
            </div>
          </div>
        </template>

        <div class="right-click-line"></div>
        <div class="right-click-item" @click="allNode">
          <span>全选</span><span>A</span>
        </div>
        <div class="right-click-item" @click="copyNode">
          <span>复制</span><span>C</span>
        </div>
        <div class="right-click-item" @click="pasteNode">
          <span>粘贴</span><span>V</span>
        </div>
        <div class="right-click-item" @click="deleteNode">
          <span>删除</span><span>X</span>
        </div>
        <div class="right-click-line"></div>
        <div class="right-click-item" @click="prevStep">
          <span>上一步</span><span>Z</span>
        </div>
        <div class="right-click-item" @click="nextStep">
          <span>下一步</span><span>Shift+Z</span>
        </div>
      </div>
    </div>

    <div class="middle-click-menu">
      <div class="middle-icon" @click="prevStep" v-html="arrowLeft"></div>
      <div
        class="middle-icon"
        v-if="$state.compile"
        v-html="play"
        @click="compileClose"
      ></div>
      <div class="middle-icon" v-else @click="compileShow" v-html="stop"></div>
      <div class="middle-icon right" @click="nextStep" v-html="arrowLeft"></div>
    </div>
  </div>
</template>

<script>
import { addEvent, mouseScroll } from 'common/utils/dom'
import { guid } from 'common/utils/utils'
import { arrowLeft, play, stop } from 'common/utils/svg'
import components from 'common/utils/cps'

export default {
  name: 'Shortcuts',
  data() {
    return {
      searchText: '',
      components,
      copyNodes: [],
      rightMenuVisible: false,
      rightMenu: { x: 0, y: 0 },
      arrowLeft,
      play,
      stop
    }
  },
  created() {
    this.rightMenuHandle()
    this.documentClick()
    this.documentKey()
    this.$bus.$on('start', this.start)
    this.$bus.$on('move', this.move)
    this.$bus.$on('end', this.end)
    mouseScroll((e) => {
      const value = e * 0.1
      let scale = this.$state.config.scale + value
      scale = Math.max(0.6, Math.min(1.8, scale))
      this.$state.config.scale = scale
    })
  },
  computed: {
    menuStyle() {
      return `left: ${this.rightMenu.x}px; top: ${this.rightMenu.y}px;`
    },
    disabled() {
      return !this.$state.selectNodes.length
    },
    nodes() {
      const nodes = []
      components.forEach(item => {
        item.children.forEach(child => {
          if (child.indexOf(this.searchText) > -1) {
            nodes.push(child)
          }
        })
      })
      return nodes
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
      addEvent(document, 'mouseup', function (e) {
        if (e.button === 2 || that.rightMenuVisible) return false
        if (!that.$state.selectNodeId) {
          that.$mutations.clearSelectNode()
        }
        that.$state.selectNodeId = ''
      })
    },
    documentKey() {
      addEvent(document, 'keyup', (e) => {
        let key = e.key.toLocaleUpperCase()
        if (e.code === 'Space') key = 'Space'
        switch (key) {
          case 'A':
            this.allNode() // 全选
            break
          case 'C':
            this.copyNode() // 复制
            break
          case 'V':
            this.pasteNode() // 粘贴
            break
          case 'X':
            this.deleteNode() // 删除
            break
          case 'Z':
            if (e.shiftKey) {
              this.nextStep() // 代码前进
            } else {
              this.prevStep() // 代码后退
            }
            break
          case 'Space':
            this.$state.compile ? this.compileClose() : this.compileShow()
            break
          default:
            break
        }
      })
    },
    rightMenuHandle() {
      const that = this
      window.oncontextmenu = function (e) {
        e.preventDefault()
        that.rightMenuVisible = true
        that.searchText = ''
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
      this.$message.success('复制成功')
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
      this.$message.success('粘贴成功')
    },
    deleteNode() {
      this.rightMenuHide()
      if (this.disabled) {
        this.$message.error('请选择删除的节点')
        return false
      }
      const nodes = this.$state.nodes.slice()
      const selectNodes = this.$state.selectNodes
      const newNodes = nodes.filter(node => !selectNodes.includes(node.uid))
      const newNodesKey = newNodes.map(node => node.uid)
      newNodes.forEach(item => {
        for (const x in item.vector) {
          if (x.indexOf('output') > -1) {
            const _tn = item.vector[x]
            for (let j = 0; j < _tn.length; j++) {
              const [targetNodeUid] = _tn[j].target.split('-')
              if (!newNodesKey.includes(targetNodeUid)) {
                item.vector[x].splice(j, 1)
              }
            }
          } else if (x.indexOf('input') > -1) {
            const [targetNodeUid] = item.vector[x].target.split('-')
            if (!newNodesKey.includes(targetNodeUid)) {
              delete item.vector[x]
            }
          }
        }
      })
      this.$mutations.commit('setNodes', newNodes)
      this.$message.success('删除成功')
    },
    nextStep() {
      this.rightMenuHide()
      this.$mutations.nextStep() // 代码前进
    },
    prevStep() {
      this.rightMenuHide()
      this.$mutations.prevStep() // 代码后退
    },
    allNode() {
      this.rightMenuHide()
      this.$state.selectNodes = this.$state.nodes.map(node => node.uid)
    },
    compileShow() {
      this.rightMenuHide()
      this.$state.compile = true
    },
    compileClose() {
      this.rightMenuHide()
      this.$state.compile = false
    },
    addNode(nodeName) {
      this.rightMenuHide()
      this.$mutations.commit('addNodes', { name: nodeName })
    }
  }
}

</script>

<style lang="stylus">
@import '~common/style/variable';

.right-click-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  background-color: rgba(31, 31, 31, 0.8);
  border: 1px solid #3d3d3d;
  border-radius: 8px;
  z-index: 100;

  .right-click-title {
    padding: 12px 12px;
    width: 100%;
    line-height: 1;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    border-bottom: 1px solid #3d3d3d;
  }

  .right-click-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    width: 100%;
    line-height: 1;
    color: #fff;
    font-size: 12px;

    &:hover {
      background-color: #547ab5;
    }
  }

  .right-click-line {
    margin: 10px 0;
    width: 100%;
    height: 1px;
    background-color: #dcdcdc;
  }
}

.middle-click-menu {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 4%;
  left: 50%;
  width: 160px;
  height: 42px;
  background-color: #424242;
  transform: translateX(-50%);
  border-radius: 8px;
  z-index: 100;
  overflow: hidden;
  opacity: 0.4;

  .middle-icon {
    margin: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    font-size: 22px;
    color: rgba(255, 255, 255, 0.6);

    &:hover {
      cursor: pointer;
      color: #fff;
    }

    &.right {
      transform: rotate(180deg);
    }
  }

  &:hover {
    opacity: 1;
  }
}

.search-item {
  padding: 0 12px;
  width: 100%;

  .el-input__inner {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    color: #fff;
    background-color: rgba(31, 31, 31, 0.8);
  }

  .el-input__icon {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
}

.right-click-item {
  .add-node {
    display: none;
    position: absolute;
    top: 50%;
    left: 100%;
    padding: 10px 0;
    width: 180px;
    background-color: rgba(31, 31, 31, 0.8);
    border: 1px solid #3d3d3d;
    border-radius: 8px;
    transform: translateY(-50%);
  }

  &:hover {
    .add-node {
      display: block;
    }
  }
}
</style>
