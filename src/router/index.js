import { createRouter, createWebHistory } from 'vue-router'
import Step1Personal from '@/views/onboarding/Step1Personal.vue'
import Step2Job from '@/views/onboarding/Step2Job.vue'
import Step3Access from '@/views/onboarding/Step3Access.vue'
import Step4Preview from '@/views/onboarding/Step4Preview.vue'
import WizardLayout from '@/components/wizard/WizardLayout.vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import LoginLayout from '@/layouts/LoginLayout.vue'
import LoginPage from '@/views/LoginPage.vue'
// import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth.store'
import OnboardingList from '@/views/onboarding/OnboardingList.vue'
import ProfileLayout from '@/layouts/ProfileLayout.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'



const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginPage,
        meta: { guestOnly: true },
      },
    ],
  },
  {
    path: '/profile',
    component: ProfileLayout,
    children: [
      {
        path: '',
        name: 'profile',
        component: ProfilePage,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/onboardings',
    name: 'onboardings.list',
    component: OnboardingList,
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding',
    component: WizardLayout,
    meta: { requiresAuth: true, isWizard: true },
    // redirect: '/onboarding/step-1',
    children: [
      {
        path: 'step-1', component: Step1Personal, beforeEnter: (to, from, next) => {
          const onboarding = useOnboardingStore()
          if (from.path.startsWith('/onboardings')) {
            onboarding.refreshOnboarding()
          }
          next()
        }
      },
      {
        path: 'step-2', component: Step2Job, meta: { requiresOnboardingId: true },
      },
      {
        path: 'step-3', component: Step3Access, meta: { requiresOnboardingId: true },
      },
      {
        path: 'preview', component: Step4Preview, meta: { requiresOnboardingId: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

// const stepMap = [
//   { path: '/onboarding/step-1', requiredKey: null },
//   { path: '/onboarding/step-2', requiredKey: 'personal_information' },
//   { path: '/onboarding/step-3', requiredKey: 'job_details' },
//   { path: '/onboarding/preview', requiredKey: 'access_rights' },
// ]

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const onboarding = useOnboardingStore()

  if (auth.token && !auth.booted) {
    try {
      await auth.fetchMe()
    } catch {
      auth.logout()
      return next('/login')
    }
  }

  if (from.path.startsWith('/onboarding')) {
    onboarding.refreshOnboarding()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return auth.isAdmin
      ? next('/onboardings')
      : next('/profile')
  }

  if ((to.path === '/onboardings' || to.path === '/onboarding') && !auth.isAdmin) {
    return next('/profile')
  }

  // if (to.path === '/onboarding' && !auth.isAdmin) {
  //   return next('/profile')
  // }

  if (to.meta.isWizard) {
    if (!onboarding.onboarding && to.path !== '/onboarding/step-1') {
      return next(auth.isAdmin ? '/onboardings' : '/profile')
    }
  }

  next()
})

export default router
