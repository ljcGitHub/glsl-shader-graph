<template>
  <div class="debugger-view">
    <canvas ref="canvas" style="width: 160px; height: 160px"></canvas>
    <div class="debugger-text" style="top: 5px; left: 5px">(0, 1)</div>
    <div class="debugger-text" style="top: 5px; right: 5px">(1, 1)</div>
    <div class="debugger-text" style="bottom: 5px; left: 5px">(0, 0)</div>
    <div class="debugger-text" style="bottom: 5px; right: 5px">(1, 0)</div>
  </div>
</template>

<script>
import { createdShaderMaterial, render } from 'common/utils/shader'
import { getShaderBin } from 'common/utils/utils'

const THREE = window.THREE

export default {
  name: 'Debugger',
  props: {
    uid: {
      type: String
    },
    position: {
      type: String,
      default: 'projectionMatrix * modelViewMatrix * vec4( position, 1.0 )'
    },
    fragColor: {
      type: String,
      default: 'vec4(1.0, 1.0, 1.0, 1.0)'
    }
  },
  computed: {
    compile() {
      return this.$state.compile
    }
  },
  mounted() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 2)
    const renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas
    })
    renderer.setSize(140, 140)
    camera.position.z = 2
    camera.target = new THREE.Vector3(0, 0, 0)
    scene.add(camera)
    this.scene = scene
    const renderDestroy = render(scene, camera, renderer)
    this.$once('hook:beforeDestroy', () => {
      renderDestroy()
    })
  },
  methods: {
    showDebugger() {
      if (this.mesh) this.scene.remove(this.mesh)
      const shader = getShaderBin.apply(this)
      this.mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, 1, 1),
        createdShaderMaterial(shader.vertexShader, shader.fragmentShader, shader.uniforms)
      )
      this.scene.add(this.mesh)
    }
  },
  watch: {
    compile() {
      if (this.compile) {
        this.showDebugger()
      }
    }
  }
}

</script>

<style scoped lang="stylus">
@import '~common/style/variable';

.debugger-view {
  position: relative;
  display: flex;
  width: 218px;
  height: 160px;
  justify-content: center;
  align-items: center;
  background-color: #393939;
  border-top: 1px solid $body-background-color;
}

.debugger-text {
  position: absolute;
  font-size: 12px;
  color: #fff;
}
</style>
