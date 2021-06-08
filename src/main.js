import Vue from 'vue'
import App from './app.vue'
import './trackers.js' // eslint-disable-line import/no-unassigned-import

Vue.config.productionTip = false

new Vue({ render: h => h(App) }).$mount('#app')
