// 获取uid
export const guid = function () {
  return 'xxxxxxaxxxxb4xxxcyxxxdxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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
