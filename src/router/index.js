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
    path: '/onboardings',
    name: 'onboardings.list',
    component: OnboardingList,
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding',
    component: WizardLayout,
    meta: { requiresAuth: true, isWizard: true },
    children: [
      {
        path: 'step-1', component: Step1Personal,
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
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

const stepMap = [
  { path: '/onboarding/step-1', requiredKey: null },
  { path: '/onboarding/step-2', requiredKey: 'personal_information' },
  { path: '/onboarding/step-3', requiredKey: 'job_details' },
  { path: '/onboarding/preview', requiredKey: 'access_rights' },
]

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const onboarding = useOnboardingStore()

  /**
   * 🔐 AUTH GUARD
   */
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  /**
   * 🚫 GUEST ONLY
   */
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next('/onboarding/step-1')
  }

  /**
   * 🧭 ONBOARDING FLOW GUARD
   */
  if (to.meta.isWizard) {
    // belum punya onboarding → hanya boleh ke step-1
    if (!onboarding.onboarding && to.path !== '/onboarding/step-1') {
      return next('/onboarding/step-1')
    }

    const rule = stepMap.find(r => r.path === to.path)

    if (rule && rule.requiredKey) {
      const value = onboarding.onboarding?.[rule.requiredKey]
      if (!value) {
        return next('/onboarding/step-1')
      }
    }
  }

  next()
})


export default router
