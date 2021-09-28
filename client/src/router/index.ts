import { looseIndexOf } from '@vue/shared'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/login',
		name: 'Login',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
	},
	{
		path: '/login-redirect',
		name: 'LoginRedirect',
		component: () => import(/* webpackChunkName: "about" */ '../views/LoginRedirect.vue')
	},
	{
		path: '/logout',
		name: 'Logout',
		component: () => import(/* webpackChunkName: "about" */ '../views/Logout.vue')
	},
	{
		path: '/overview',
		name: 'Overview',
		meta: { requiresLogin: true, title: "Overview" },
		component: () => import(/* webpackChunkName: "about" */ '../views/Overview.vue')
	},
	{
		path: '/world/:id',
		name: 'World',
		meta: { requiresLogin: true, title: "World" + },
		component: () => import(/* webpackChunkName: "about" */ '../views/World.vue')
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/"
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

router.beforeEach((to, from) => {
	document.title = "Realms Hub";
	if(to.meta.title) {
		document.title += " - " + <string>to.meta.title;
	}

	if (to.meta.requiresLogin) {
		if (localStorage.getItem("id")) {
			return true;
		} else {
			return { path: "/" };
		}
	}
	return true;
})

export default router;
