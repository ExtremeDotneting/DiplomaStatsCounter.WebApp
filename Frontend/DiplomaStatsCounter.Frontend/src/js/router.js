import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from "@/pages/SignIn";
import AllPagesLinks from "@/components/AllPagesLinks";
import DialogForm from "@/components/DialogForm";
import Empty from '@/components/Empty'
import VueHelpers from '../../libs/vueHelpers';
import CallbackProcessing from '@/components/CallbackProcessing'

Vue.use(VueRouter)

let routes = [
  {
    path: '/',
    component: Empty
  }
]
function addToRoute(component) {
  VueHelpers.addComponentToRoutes(routes, component);
}

addToRoute(Empty);
addToRoute(SignIn);
addToRoute(AllPagesLinks);
addToRoute(DialogForm);
addToRoute(CallbackProcessing);

VueHelpers.registerAllRoutes(routes);

console.log("Routes:");
console.log(routes);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//router.replace({ path: '', redirect: '/index' });

export default router