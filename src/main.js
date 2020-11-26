import Vue from 'vue'
import Element from 'element-ui'
import App from './App.vue'
import 'common/style/index.styl'
import 'element-ui/lib/theme-chalk/index.css'
import * as BaseComponents from 'base/zIndex'
import * as Components from 'components/zIndex'
import Store from './store/index'

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.use(Element)
Vue.prototype.$state = Store.state
Vue.prototype.$mutations = Store.mutations
Vue.prototype.$bus = Store.bus

for (const x in Components) {
  Vue.component(Components[x].name, Components[x])
}
for (const x in BaseComponents) {
  Vue.component(BaseComponents[x].name, BaseComponents[x])
}

new Vue({
  render: h => h(App)
}).$mount('#app')
