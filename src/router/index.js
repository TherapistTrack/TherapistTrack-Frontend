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
      component: () => import('@/pages/config/ConfigIndex.vue'),
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
          component: () => import('@/pages/config/CustomizeRecord.vue')
        },
        {
          path: 'template/:templateId',
          component: () => import('@/pages/config/CustomizeRecord.vue')
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
          path: 'files/new',
          component: () => import('@/pages/config/CustomizeFile.vue')
        },
        {
          path: 'files/:fileId',
          component: () => import('@/pages/config/CustomizeFile.vue')
        }
      ]
    },

    // DOCTOR VIEWS

    {
      path: '/doctor',
      component: () => import('@/pages/doctor/DoctorIndex.vue'),
      redirect: '/doctor/records',
      children: [
        // Records Flow
        {
          path: 'records',
          component: () => import('@/pages/record/RecordView.vue'),
          children: [
            {
              path: 'edit/:recordId',
              component: () => import('@/pages/record/EditRecord.vue'),
              props: (route) => ({
                recordId: route.params.id // Pass id from route parameters
              })
            },
            {
              path: 'view/:recordId',
              component: () => import('@/pages/record/ViewRecord.vue'),
              props: (route) => ({
                recordId: route.params.id // Pass id from route parameters
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

        // Create Record
        {
          path: 'create-record',
          component: () => import('@/pages/record/CreateRecord.vue')
        },

        // Patient Flow
        {
          path: 'patient/:recordId',
          component: () => import('@/pages/patient/PatientView.vue'),
          props: (route) => ({
            recordId: route.params.recordId
          }),
          children: [
            {
              path: 'edit/:fileId',
              component: () => import('@/pages/patient/EditPatient.vue'),
              props: (route) => ({
                fileId: route.params.fileId
              })
            },
            {
              path: 'view/:fileId',
              component: () => import('@/pages/patient/ViewPatient.vue'),
              props: (route) => ({
                fileId: route.params.fileId
              })
            },
            {
              path: 'table-settings',
              component: () => import('@/pages/patient/PatientShowTable.vue'),
              props: {
                shownHeaders: Object,
                allHeaders: Object
              }
            }
          ]
        },

        // File Flow
        {
          path: 'file/:fileId',
          component: () => import('@/pages/file/FileView.vue'),
          children: [
            {
              path: 'info',
              component: () => import('@/pages/file/FileInfo.vue')
            },
            {
              path: 'editInfo',
              component: () => import('@/pages/file/EditFileInfo.vue')
            }
          ]
        }
      ]
    },

    // UPLOAD VIEW

    {
      path: '/upload',
      component: () => import('@/pages/upload/UploadIndex.vue'),
      children: [
        {
          path: 'files',
          name: 'uploadFiles',
          component: () => import('@/pages/upload/UploadFiles.vue')
        },
        {
          path: 'select',
          name: 'uploadSelect',
          component: () => import('@/pages/upload/UploadSelect.vue')
        },
        {
          path: 'form',
          name: 'uploadForm',
          component: () => import('@/pages/upload/UploadForm.vue')
        },
        {
          path: 'doing',
          name: 'uploadDoing',
          component: () => import('@/pages/upload/UploadDoing.vue')
        },
        {
          path: 'finish',
          name: 'uploadFinish',
          component: () => import('@/pages/upload/UploadFinish.vue')
        }
      ]
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
