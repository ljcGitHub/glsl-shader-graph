let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend'
    }
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export const style = {
  transform: prefixStyle('transform'),
  transition: prefixStyle('transition'),
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd')
}

export function hasClass(el, className) {
  return el.classList.contains(className)
}

export function addClass(el, className) {
  el.classList.add(className)
}

export function removeClass(el, className) {
  el.classList.remove(className)
}

export const addEvent = function (el, type, fn, capture) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, { passive: false, capture: !!capture })
  } else {
    el.attachEvent('on' + type, fn)
  }
}

export const removeEvent = function (el, type, fn, capture) {
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, { passive: false, capture: !!capture })
  } else {
    el.detachEvent('on' + type, fn)
  }
}

export const mouseScroll = function (callback) {
  const scrollFunc = function (arg) {
    const e = arg || window.event
    let direction = 0
    if (e.wheelDelta) { // 判断浏览器IE，谷歌滑轮事件
      if (e.wheelDelta > 0) { // 当滑轮向上滚动时
        direction = 1
      }
      if (e.wheelDelta < 0) { // 当滑轮向下滚动时
        direction = -1
      }
    } else if (e.detail) { // Firefox滑轮事件
      if (e.detail > 0) { // 当滑轮向下滚动时
        direction = -1
      }
      if (e.detail < 0) { // 当滑轮向上滚动时
        direction = 1
      }
    }
    callback && callback(direction)
  }
  document.addEventListener('DOMMouseScroll', scrollFunc, false)
  window.onmousewheel = scrollFunc
}
