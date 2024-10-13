import Vue from 'vue'
import VueRouter from 'vue-router'
import LayOut from '../views/LayOut.vue'
import DashBoard from "@/views/DashBoard.vue";
import HotWords from '@/views/HotWords.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: LayOut,
        redirect: '/dashBoard',
        children: [{
            path: 'dashBoard',
            name: '首页',
            component: DashBoard
        }, {
            path: 'hotWords',
            component: HotWords
        },
        ]
    },
]

const router = new VueRouter({
    routes
})

export default router
