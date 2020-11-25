import { addEvent, removeEvent } from './dom'

const start = 'mousedown'
const move = 'mousemove'
const end = 'mouseup'

function touchHandle(el, option) {
  let touch = false
  const startFunc = function (e) {
    touch = true
    option.start && option.start(e)
  }
  const moveFunc = function (e) {
    if (touch) {
      option.move && option.move(e)
    }
  }
  const endFunc = function (e) {
    if (touch) {
      touch = false
      option.end && option.end(e)
    }
  }
  addEvent(el, start, startFunc)
  addEvent(document, move, moveFunc)
  addEvent(document, end, endFunc)
  return function () {
    removeEvent(el, start, startFunc)
    removeEvent(document, move, moveFunc)
    removeEvent(document, end, endFunc)
  }
}

export default touchHandle
