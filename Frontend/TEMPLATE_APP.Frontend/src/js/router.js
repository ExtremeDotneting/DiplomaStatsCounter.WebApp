import Vue from 'vue'
import VueRouter from 'vue-router'
import CharacterList from "@/components/CharacterList";
import LoginPage from "@/components/LoginPage";
import AllPagesLinks from "@/components/AllPagesLinks";
import DialogForm from "@/components/DialogForm";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: AllPagesLinks
  },
  {
    path: '/allPagesLinks',
    component: AllPagesLinks
  },
  {
    path: '/characterList',
    component: CharacterList
  },
  {
    path: '/loginPage',
    component: LoginPage
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

router.replace({ path: '', redirect: '/allPagesLinks' });

export {
  router,
  CharacterList,
  LoginPage,
  AllPagesLinks,
  DialogForm
}