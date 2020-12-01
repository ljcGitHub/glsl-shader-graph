import Vue from 'vue'
import Element from 'element-ui'
import App from './App.vue'
import 'common/style/index.styl'
import 'element-ui/lib/theme-chalk/index.css'
import Store from './store/index'

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Element)
Vue.prototype.$state = Store.state
Vue.prototype.$mutations = Store.mutations
Vue.prototype.$bus = Store.bus

const BaseComponent = require.context('./base', true, /\.vue$/)
const Component = require.context('./components', true, /\.vue$/)
BaseComponent.keys().forEach(filePath => {
  const cmp = BaseComponent(filePath)
  Vue.component(cmp.default.name, cmp.default)
})
Component.keys().forEach(filePath => {
  const cmp = Component(filePath)
  Vue.component(cmp.default.name, cmp.default)
})

new Vue({
  render: h => h(App)
}).$mount('#app')
