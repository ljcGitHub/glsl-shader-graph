// 获取uid
export const guid = function () {
  return 'uidxxxxxxaxxxxb4xxxcyxxxdxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 获取输入输出节点的圆的中心坐标
export const getVeotorRect = function (el) {
  let round = null
  if (el.className.indexOf('.vector-round') > -1) {
    round = el
  } else {
    round = el.querySelector('.vector-round')
  }
  const rect = round.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

// 传值转变量
export const vecSetValue = function (uid, _sourceVec, _targetVec) {
  const sourceVec = Number(_sourceVec)
  const targetVec = Number(_targetVec)
  if (targetVec === sourceVec) return uid
  if (sourceVec === 1) {
    if (targetVec === 2) return `${uid}.x`
    if (targetVec === 3) return `${uid}.x`
    if (targetVec === 4) return `${uid}.x`
  } else if (sourceVec === 2) {
    if (targetVec === 1) return `vec2(${uid}, ${uid})`
    if (targetVec === 3) return `${uid}.xy`
    if (targetVec === 4) return `${uid}.xy`
  } else if (sourceVec === 3) {
    if (targetVec === 1) return `vec3(${uid}, ${uid}, ${uid})`
    if (targetVec === 2) return `vec3(${uid}.xy, 0.0)`
    if (targetVec === 4) return `vec3(${uid}.xyz)`
  } else if (sourceVec === 4) {
    if (targetVec === 1) return `vec3(${uid}, ${uid}, ${uid}, ${uid})`
    if (targetVec === 2) return `vec4(${uid}.xy, 0.0, 0.0)`
    if (targetVec === 3) return `vec3(${uid}.xyz, 0.0)`
  }
}

// 获取节点关系
export const findShaderNode = function (_uid, nodes) {
  const codes = []
  const expressions = []
  const nodeNames = {}
  const nodeKeys = {}
  nodes.forEach(item => {
    nodeKeys[item.value.uid] = item
  })
  const dg = function (uid) {
    const node = nodeKeys[uid]
    const vector = node.value.vector
    if (!nodeNames[uid]) {
      if (node.getCode) {
        codes.push(node.getCode())
      }
    }
    expressions.push(node.getExpression())
    for (let x in vector) {
      if (x.indexOf('input') > -1) {
        const inputNode = vector[x]
        const [inputNodeUid] = inputNode.target.split('-')
        dg(inputNodeUid)
      }
    }
  }
  dg(_uid)
  return { codes: codes.reverse(), expressions: expressions.reverse() }
}

// 转换script
export const getShader = function (sn, position, fragColor) {
  let vertexShader = `
    void main(){
      gl_Position = ${position};
    }
  `
  let fragmentShader = `
    ${sn.codes.join('\n')}

    void main(){
      ${sn.expressions.join('\n')}
      gl_FragColor = ${fragColor};
    }
  `

  return { vertexShader, fragmentShader }
}

// 获取shader
export const getShaderBin = function () {
  const nodes = this.$root.$children[0].$refs.node
  const shaderNodes = findShaderNode(this.uid, nodes)
  const shaderScript = getShader(shaderNodes, this.position, this.fragColor)
  console.log(shaderScript.vertexShader)
  console.log(shaderScript.fragmentShader)
  return {
    vertexShader: shaderScript.vertexShader,
    fragmentShader: shaderScript.fragmentShader
  }
}
