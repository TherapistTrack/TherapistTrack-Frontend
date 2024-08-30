import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // LOGIN VIEW
    {
      path: '/',
      name: 'login',
      component: () => import('@/pages/login/LoginView.vue')
    },

    // ADMIN VIEW
    {
      path: '/admin',
      component: () => import('@/pages/admin/AdminView.vue'),
      children: [
        {
          path: 'user',
          component: () => import('@/pages/admin/UsersView.vue'),
          children: [
            {
              path: 'create',
              component: () => import('@/pages/admin/CreateUser.vue')
            },
            {
              path: 'edit:id',
              component: () => import('@/pages/admin/EditUser.vue'),
              props: (route) => ({
                userId: route.params.id // Pass id from route parameters
              })
            },
            {
              path: 'view:id',
              component: () => import('@/pages/admin/ViewUser.vue'),
              props: (route) => ({
                userId: route.params.id // Pass id from route parameters
              })
            }
          ]
        }
      ]
    },
    // CONFIG PAGE
    {
      path: '/config',
      redirect: '/config/account',
      component: () => import('@/pages/config/ProfileView.vue'),
      children: [
        {
          path: 'account',
          component: () => import('@/pages/config/AccountView.vue')
        },
        {
          path: 'patients',
          component: () => import('@/pages/config/PatientList.vue')
        },
        {
          path: 'template',
          component: () => import('@/pages/config/CustomizeTemplate.vue')
        },
        {
          path: 'records',
          component: () => import('@/pages/notfound/NotFoundView.vue')
        }
      ]
    },
    // RECORD VIEW
    {
      path: '/records',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    },

    // PATIENT VIEW
    {
      path: '/patient/:id',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    },

    // UPLOAD VIEW
    {
      path: '/upload',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    },
    {
      path: '/upload/prepare',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    },
    {
      path: '/upload/waiting',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    },

    // NOT FOUND PAGE
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    }
  ]
})

export default router
