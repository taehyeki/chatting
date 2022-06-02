import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import socketPlugin from './plugins/socketPlugin'
// import vueMoment from './plugins/vue-moment'
import store from './store'
import './plugins'
import bridge from './plugins/bridge.plug.js'
import emitterApi from './api/emitter/emitter.api'
import commonApi from './api/common/common.api'


Vue.config.productionTip = false

Vue.use(bridge)
Vue.use(socketPlugin)
Vue.prototype.$emitterApi = emitterApi
Vue.prototype.$commonApi = commonApi

var vm = new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

window.app = vm;
