import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  rtl: false,
  theme: {
    options: { customProperties: true },
    dark: false,
    themes: {
      light: {
        primary: '#24292F',
        secondary: '#24292F',
        borders: '#bdbdbd',
        icons: '#F1FCFF',
        background: "#FAFAFA"
      }
    }
  }
});
