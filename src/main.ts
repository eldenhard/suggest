import { createApp } from "vue";
import App from "./App.vue";
import './assets/styles/style.css'
import clickOutsideDirective from "./utils/clickOutside";

const app = createApp(App);


app.directive("click-outside", clickOutsideDirective);

app.mount("#app");