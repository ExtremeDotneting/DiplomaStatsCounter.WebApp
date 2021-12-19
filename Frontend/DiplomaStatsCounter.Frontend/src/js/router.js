import Vue from 'vue'
import VueRouter from 'vue-router'
import SignIn from "@/pages/SignIn";
import AllPagesLinks from "@/components/AllPagesLinks";
import DialogForm from "@/components/DialogForm";
import Empty from '@/components/Empty'
import VueHelpers from '../../libs/vueHelpers';
import CallbackProcessing from '@/components/CallbackProcessing';
import Main from '@/pages/Main';
import GitHubUserStats from '@/pages/GitHubUserStats';
import GitHubRepositories from '@/pages/GitHubRepositories';
import GitHubRepositoryStats from '@/pages/GitHubRepositoryStats';
import RegressionModel from '@/pages/RegressionModel'

Vue.use(VueRouter)

let routes = [
  // {
  //   path: '/',
  //   component: Main
  // }
]
function addToRoute(component) {
  VueHelpers.addComponentToRoutes(routes, component);
}

addToRoute(Empty);
addToRoute(SignIn);
addToRoute(AllPagesLinks);
addToRoute(DialogForm);
addToRoute(CallbackProcessing);
addToRoute(Main);
addToRoute(GitHubUserStats);
addToRoute(GitHubRepositories);
addToRoute(GitHubRepositoryStats);
addToRoute(RegressionModel);

VueHelpers.registerAllRoutes(routes);

console.log("Routes:");
console.log(VueHelpers.getAllComponentsInfo());

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.lazyPush = function (path) {
  if (this.currentRoute.path === path) {
    return;
  }
  this.push(path);
}

//router.replace({ path: '', redirect: '/index' });

export default router