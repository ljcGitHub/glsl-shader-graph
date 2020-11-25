import Vue from 'vue'
import { guid } from 'common/utils/utils'

const copy = function (data) {
  return JSON.parse(JSON.stringify(data))
}

const state = Vue.observable({
  config: {
    language: 'zh', // zh en
    lineStyle: 'straight-line' // straight-line直线 curve-line曲线
  },
  loading: 0,
  selectNodes: [],
  nodes: [] // 节点
})

const mutations = {
  addNodes(params) {
    state.nodes.push({
      name: params.name,
      x: params.x || 0,
      y: params.y || 0,
      uid: guid(),
      vector: {}
    })
  },
  deleteNodes(val) {
    for (let i = 0; i < state.nodes.length; i++) {
      const node = state.nodes[i]
      if (node.uid === val.uid) {
        state.nodes.splice(i, 1)
        return false
      }
    }
  },
  selectNode(uid) {
    if (!state.selectNodes.includes(uid)) {
      state.selectNodes.push(uid)
    }
  },
  clearSelectNode() {
    state.selectNodes = []
  },
  setNodes(val) {
    state.selectNodes = []
    state.nodes = copy(val)
    state.loading = state.loading + 1
    console.log(state.nodes)
  },
  index: 0,
  history: [[]],
  commit(type, ...rect) {
    if (this[type]) {
      this[type].apply(this, rect)
      const history = this.history.slice(0, this.index + 1)
      history.push(state.nodes)
      this.history = copy(history)
      this.index = history.length - 1
    }
  },
  refresh() {
    state.loading = state.loading + 1
    console.log(state.nodes)
    console.log('刷新函数')
  },
  prevStep() {
    if (this.history[this.index - 1]) {
      this.history[this.index] = copy(state.nodes)
      this.index = this.index - 1
      this.setNodes(this.history[this.index])
    }
  },
  nextStep() {
    if (this.history[this.index + 1]) {
      this.history[this.index] = copy(state.nodes)
      this.index = this.index + 1
      this.setNodes(this.history[this.index])
    }
  }
}
export default { state, mutations }
