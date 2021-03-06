import Vue from 'vue'
import VueRouter from '@/vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
      {
        path: 'a',
        component:{
          render: h=> <h1>about - a</h1>
        }
      },
      {
        path: 'b',
        component:{
          render: h=> <h1>about - b</h1>
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


router.beforeEach((to,from,next)=>{
  console.log('before one:' , to, from)
  next()
})
router.beforeEach((to,from,next)=>{
  console.log('before two:' , to, from)
  next()
})

export default router
