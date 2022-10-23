import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL0Oknoi_sKY-UoA0P-URP_XkjuApBbc4",
  authDomain: "vue-test-38a5f.firebaseapp.com",
  projectId: "vue-test-38a5f",
  storageBucket: "vue-test-38a5f.appspot.com",
  messagingSenderId: "439304902150",
  appId: "1:439304902150:web:7e1e6174340d2e2973d587"
};

// Initialize Firebase
initializeApp(firebaseConfig);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
