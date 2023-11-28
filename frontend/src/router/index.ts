import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { apolloClient } from '../services/apollo'
import { gql } from 'graphql-tag'

import ViewLogin from "../views/auth/login/login.vue"
import ViewSignIn from "../views/auth/signin/signin.vue"

import ViewApp from "../views/app/index.vue"
import ViewHome from "../views/app/home/index.vue"
import ViewMessages from "../views/app/channels/index.vue"
import ViewLeaderboard from "../views/app/leaderboard/index.vue"
import ViewProfile from "../views/app/profile/index.vue"
import ViewGameLocal from "../views/game/local/index.vue"
import ViewGameTraining from "../views/game/training/index.vue"
import ViewGameOnline from "../views/game/online/index.vue"
import ViewPublicProfile from "../views/app/publicProfile/index.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: `/app`,
    component: ViewApp,
    children: [
      {
        path: `home`,
        component: ViewHome
      },
      {
        path: `channel`,
        component: ViewMessages
      },
      {
        path: `leaderboard`,
        component: ViewLeaderboard
      },
      {
        path: `profile`,
        component: ViewProfile
      },
      {
        path: `game/local`,
        component: ViewGameLocal
      },
      {
        path: `game/training`,
        component: ViewGameTraining
      },
      {
        path: `game/online/:roomId`,
        component: ViewGameOnline
      },
      {
        path: `publicprofile`,
        component: ViewPublicProfile
      }
    ]
  },
  {
    path: `/login`,
    component: ViewLogin
  },
  {
    path: `/signup`,
    component: ViewSignIn
  },
  { path: `/:pathMatch(.*)*`, component: ViewApp }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

async function fetchUserGame() {
  try {
    const { data } = await apolloClient.query({
      query: GET_USER_GAME,
      fetchPolicy: 'network-only',
    });

    return data.getUserGameBeforeStart;
  } catch (error) {
    return null;
  }
}

const GET_USER_GAME = gql`
  query GetUserGameBeforeStart {
    getUserGameBeforeStart {
      id
    }
  }
`

router.beforeEach(async (to, from, next) => {

  if (to.fullPath.startsWith('/app/game/online/')) {
    const userGame = await fetchUserGame();
    if (!userGame || !userGame.id) {
      await next('/app/home');
    } else {
      await next();
    }
  } else {
    await next();
  }
});

router.afterEach((to, from) => {
  if (from.fullPath.startsWith('/app/game/')) {
    router.go(0)
  }
})


export { router }