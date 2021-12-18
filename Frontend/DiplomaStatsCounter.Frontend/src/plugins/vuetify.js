import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  rtl: false,
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#24292F',
        accent: '#e91e63',
        secondary: '#30b1dc',
        success: '#4CAF50',
        info: '#24292F',
        warning: '#FB8C00',
        error: '#FF5252'
      },
      dark: {
        primary: '#21CFF3',
        accent: '#FF4081',
        secondary: '#ffe18d',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      }
     
    }
  }
});
