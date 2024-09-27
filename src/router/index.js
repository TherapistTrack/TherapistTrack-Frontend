import { createRouter, createWebHistory } from 'vue-router'
import { routeGuard } from '@/oauth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // LOGIN VIEW
    {
      path: '/',
      name: 'login',
      component: () => import('@/pages/login/LoginView.vue')
    },
    {
      path: '/callback',
      name: 'loginCallback',
      component: () => import('@/pages/login/CallbackView.vue')
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
              path: 'edit/:userId',
              name: 'EditUser',
              component: () => import('@/pages/admin/EditUser.vue'),
              props: (route) => ({
                userId: route.params.userId
              })
            },
            {
              path: 'view/:userId',
              component: () => import('@/pages/admin/ViewUser.vue'),
              props: (route) => ({
                userId: route.params.userId, // Pass id from route parameters
                data: Object
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
        },
        {
          path: 'files',
          component: () => import('@/pages/config/FileView.vue')
        },
        {
          path: '/config/customize-file',
          component: () => import('@/pages/config/CustomizeFile.vue')
        }
      ]
    },
    // RECORD VIEW
    {
      path: '/record',
      component: () => import('@/pages/record/RecordIndex.vue'),
      children: [
        {
          path: 'main',
          component: () => import('@/pages/record/RecordView.vue'),
          children: [
            {
              path: 'edit/:recordId',
              component: () => import('@/pages/record/EditRecord.vue'),
              props: (route) => ({
                recordId: route.params.id, // Pass id from route parameters
                viewData: Object,
                allData: Object
              })
            },
            {
              path: 'view/:recordId',
              component: () => import('@/pages/record/ViewRecord.vue'),
              props: (route) => ({
                recordId: route.params.id, // Pass id from route parameters
                viewData: Object
              })
            },
            {
              path: 'table-settings',
              component: () => import('@/pages/record/RecordShowTable.vue'),
              props: {
                shownHeaders: Object,
                allHeaders: Object
              }
            }
          ]
        },
        {
          path: 'create',
          component: () => import('@/pages/record/CreateRecord.vue')
        }
      ]
    },

    // PATIENT VIEW
    {
      path: '/patient/:id',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    },

    // UPLOAD VIEW
    {
      path: '/upload',
      component: () => import('@/pages/upload/UploadFiles.vue')
    },
    {
      path: '/upload/select',
      component: () => import('@/pages/upload/UploadSelect.vue')
    },
    {
      path: '/upload/form',
      component: () => import('@/pages/upload/UploadForm.vue')
    },
    {
      path: '/upload/doing',
      component: () => import('@/pages/upload/UploadDoing.vue')
    },
    {
      path: '/upload/finish',
      component: () => import('@/pages/upload/UploadFinish.vue')
    },

    // NOT FOUND PAGE
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/notfound/NotFoundView.vue')
    }
  ]
})

// Dev check to allow free navigetion withouth having any JWT tokens.
const freeNavigation = import.meta.env.VITE_FREE_NAVIGATION || 'FALSE'
if (freeNavigation === 'FALSE') {
  router.beforeEach(routeGuard)
}

export default router
