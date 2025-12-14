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

router.beforeEach((to, from, next) => {
  const onboardingStore = useOnboardingStore()

  if (
    to.matched.some(route => route.meta.requiresOnboardingId) &&
    !onboardingStore.onboardingId
  ) {
    next('/onboarding/step-1')
  } else {
    next()
  }
})


export default router
