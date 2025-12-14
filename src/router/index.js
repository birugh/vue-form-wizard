import { createRouter, createWebHistory } from 'vue-router'
import Step1Personal from '@/views/onboarding/Step1Personal.vue'
import Step2Job from '@/views/onboarding/Step2Job.vue'
import Step3Access from '@/views/onboarding/Step3Access.vue'
import Step4Preview from '@/views/onboarding/Step4Preview.vue'
import WizardLayout from '@/components/wizard/WizardLayout.vue'
import { useOnboardingStore } from '@/stores/onboarding.store'

const routes = [
  {
    path: '/',
    redirect: '/onboarding/step-1',
  },
  {
    path: '/onboarding',
    component: WizardLayout,
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
  if (!to.path.startsWith('/onboarding')) {
    return next()
  }

  const store = useOnboardingStore()

  if (!store.onboarding) {
    if (to.path !== '/onboarding/step-1') {
      return next('/onboarding/step-1')
    }
    return next()
  }

  const step = stepMap.find(s => s.path === to.path)
  if (!step) return next()

  if (store.onboarding[step.key] === null) {
    return next('/onboarding/step-1')
  }

  next()
})


export default router
