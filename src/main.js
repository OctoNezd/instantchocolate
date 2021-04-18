import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import axios from "axios";
import VueAxios from "vue-axios";

console.log(process.env.VUE_APP_API_URL);
var axiosInstance = axios.create({ baseURL: process.env.VUE_APP_API_URL });
Vue.use(VueAxios, axiosInstance);

Vue.use(Buefy);

Vue.prototype.$gitcommit = process.env.VUE_APP_GIT_HASH;
Vue.prototype.$installQueue = [];
Object.filter = (obj, predicate) =>
  Object.keys(obj)
    .filter((key) => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {});
Vue.config.productionTip = false;
new Vue({
  render: (h) => h(App),
}).$mount("#app");
