<template>
  <div id="app">
    <div style="position: absolute;top: 0px;left: 0;z-index:-1">
      <div style="color: #fff;" v-for="node in nodes" :key="node.uid + 's'">
        {{ `x:${node.x}, y:${node.y}, ${node.uid}`}}
      </div>
    </div>
    <div class="node-wrapper" :style="scaleStyle">
      <component
        v-for="node in nodes"
        :key="node.uid"
        :is="node.name"
        :value="node"
        ref="node"
      ></component>
    </div>
    <Shortcuts></Shortcuts>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg">
      <Link
        v-for="link in links"
        :key="link.uid"
        :pos="link.pos"
        :uid="link.uid"
        :vec="link.vec"
      ></Link>
    </svg>
  </div>
</template>

<script>
import { getVeotorRect } from 'common/utils/utils'
import { style } from 'common/utils/dom'

const getCace = function () {
  const cace = window.localStorage.getItem('node')
  if (cace) return JSON.parse(cace).data
  return []
}
const setCace = function (node) {
  window.localStorage.setItem('node', JSON.stringify({
    data: node
  }))
}

export default {
  name: 'app',
  computed: {
    nodes() {
      return this.$state.nodes
    },
    loading() {
      return this.$state.loading
    },
    scaleStyle() {
      return `${[style.transform]}: scale(${this.$state.config.scale});`
    }
  },
  data() {
    return {
      links: []
    }
  },
  created() {
    this.$state.nodes = getCace()
    this.loadingLine()
  },
  methods: {
    loadingLine() {
      setCace(this.$state.nodes)
      this.links = []
      this.loadinger && clearTimeout(this.loadinger)
      this.loadinger = setTimeout(() => {
        const nodes = this.$refs.node
        const links = []
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i]
          for (const x in node.value.vector) {
            const data = node.value.vector[x]
            if (data.type === 'input') {
              const pos1 = getVeotorRect(document.getElementById(data.source))
              const pos2 = getVeotorRect(document.getElementById(data.target))
              links.push({
                uid: data.lineUid,
                pos: [pos1.x, pos1.y, pos2.x, pos2.y],
                vec: data.vec
              })
            }
          }
        }
        this.links = links
      }, 40)
    }
  },
  watch: {
    loading(val, oldVal) {
      this.loadingLine()
    }
  }
}
</script>

<style lang="stylus">
@import '~common/style/variable';
@import '~common/style/mixin';

#app, html, body {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
}

#app::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 200vw;
  height: 200vh;
  background: url('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMtaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjQ0MUU5NkYyNDM4MTFFQkFDM0VENTNCMUZCRDQ1QTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjQ0MUU5NzAyNDM4MTFFQkFDM0VENTNCMUZCRDQ1QTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNDQxRTk2RDI0MzgxMUVCQUMzRUQ1M0IxRkJENDVBOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyNDQxRTk2RTI0MzgxMUVCQUMzRUQ1M0IxRkJENDVBOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAYEBAQFBAYFBQYJBgUGCQsI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');
  transform: scale(0.6);
  transform-origin: left top;
  z-index: -1;
}

.svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

.node-wrapper{
  position: relative;
  width: 100vw;
  height: 100vh;
}

.el-message{
  padding: 12px 12px;
  min-width: inherit;
  background-color: #fff;
}
</style>
