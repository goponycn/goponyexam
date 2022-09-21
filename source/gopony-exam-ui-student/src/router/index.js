import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/Layout'
Vue.use(VueRouter);

const routes = [{
		path: '/exam/:id?',
		component: () => import("@/views/paper/detail")
	},
	{
		path: '/',
		component: Layout,
		children: [{
				path: '',
				component: () => import("@/views/index")
			},
			{
				path: '/paper',
				component: () => import("@/views/paper/index")
			},
			{
				path: '/achievement',
				component: () => import("@/views/achievement/index")
			},
			{
				path: '/notice',
				component: () => import("@/views/notice/index")
			},
			{
				path: '/notice/:id?',
				component: () => import("@/views/notice/detail")
			},
			{
				path: '/profile',
				component: () => import("@/views/profile/index")
			}

		],
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router
