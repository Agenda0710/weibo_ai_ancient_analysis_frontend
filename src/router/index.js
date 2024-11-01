import Vue from 'vue'
import VueRouter from 'vue-router'
import LayOut from '../views/LayOut.vue'
import DashBoard from "@/views/DashBoard.vue";
import HotWords from '@/views/HotWords.vue'
import PublicSentimentStatics from "@/views/PublicSentimentStatics.vue";
import ArticleAnalysis from "@/views/ArticleAnalysis.vue";
import RegionAnalysis from "@/views/RegionAnalysis.vue";
import CommentAnalysis from "@/views/CommentAnalysis.vue";
import SentimentAnalysis from "@/views/SentimentAnalysis.vue";
import ArticleContentWordCloud from "@/views/ArticleContentWordCloud.vue";
import HotSearchAnalysis from "@/views/HotSearchAnalysis.vue";
import CurrentNewsAnalysis from "@/views/currentNewsAnalysis.vue";
import DataViews from "@/views/DataViews.vue";

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
        }, {
            path: 'publicSentimentStatics',
            component: PublicSentimentStatics
        }, {
            path: 'articleAnalysis',
            component: ArticleAnalysis
        }, {
            path: 'regionAnalysis',
            component: RegionAnalysis
        }, {
            path: 'commentAnalysis',
            component: CommentAnalysis
        }, {
            path: 'sentimentAnalysis',
            component: SentimentAnalysis
        },{
            path: 'articleContentWordCloud',
            component: ArticleContentWordCloud,
        },{
            path: 'hotSearchAnalysis',
            component: HotSearchAnalysis
        },{
            path: 'currentNewsAnalysis',
            component: CurrentNewsAnalysis
        }
        ],
    },
    {
        path: '/dataViews',
        component: DataViews
    }
]

const router = new VueRouter({
    routes
})

export default router
