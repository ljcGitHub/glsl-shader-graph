
import Store from 'store/index'

const THREE = window.THREE

export var commonUniforms = {
  u_time: { value: 1.0 },
  u_resolution: { value: new THREE.Vector2() }
}

export var createdUniforms = function (uniforms) {
  const me = Object.create(commonUniforms)
  for (const x in uniforms) {
    me[x] = uniforms[x]
  }
  return me
}

const rafs = []
function animate() {
  requestAnimationFrame(animate)
  rafs.forEach(cb => cb())
  if (Store.state.compile) {
    commonUniforms.u_time.value += 0.05
  } else {
    commonUniforms.u_time.value = 0
  }
}
animate()

export const render = function (scene, camera, renderer) {
  const ani = function () {
    renderer.render(scene, camera)
  }
  rafs.push(ani)
  return function () {
    rafs.splice(rafs.indexOf(ani), 1)
  }
}

export const createdShaderMaterial = function (vertexShader, fragmentShader, uniforms = {}) {
  return new THREE.ShaderMaterial({
    uniforms: createdUniforms(uniforms),
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
}
