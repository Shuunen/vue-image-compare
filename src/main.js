import Vue from 'vue'
import App from './app.vue'

Vue.config.productionTip = false

// eslint-disable-next-line id-length
new Vue({ render: h => h(App) }).$mount('#app')
