import Vue from 'vue'
// import App from './App.vue'
import AdjoinSku from './AdjoinSku.vue'

Vue.config.productionTip = false

new Vue({
    render: h => h(AdjoinSku),
}).$mount('#app')
