import Vue from 'vue'
import VueRouter from 'vue-router'
import SignInPage from "@/pages/SignInPage";
import AllPagesLinks from "@/components/AllPagesLinks";
import DialogForm from "@/components/DialogForm";
import EmptyPage from "@/pages/EmptyPage"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: EmptyPage
  },  
  {
    path: '/allPagesLinks',
    component: AllPagesLinks
  },
  {
    path: '/signInPage',
    component: SignInPage
  },
  {
    path: '/dialogForm',
    component: DialogForm
  }  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.replace({ path: '', redirect: '/' });

export default router