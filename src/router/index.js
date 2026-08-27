import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/weather/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/weather/favorites',
      name: 'weather-favorites',
      component: () => import('../views/WeatherFavoritesView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/weather-mockup',
      name: 'weather',
      component: () => import('../views/WeatherView.vue'),
    },
    {
      path: '/weather-composition',
      name: 'weather-composition',
      component: () => import('../views/WeatherCompositionView.vue'),
    },
    {
      path: '/weather-dashboard',
      name: 'weather-dashboard',
      component: () => import('../views/WeatherDashboardView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
