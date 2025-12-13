import { createRouter, createWebHistory } from 'vue-router'
import Step1Personal from '@/views/onboarding/Step1Personal.vue'
import Step2Job from '@/views/onboarding/Step2Job.vue'
import Step3Access from '@/views/onboarding/Step3Access.vue'
import Step4Preview from '@/views/onboarding/Step4Preview.vue'
import WizardLayout from '@/components/wizard/WizardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/onboarding',
      component: WizardLayout,
      children: [
        { path: 'step-1', component: Step1Personal },
        { path: 'step-2', component: Step2Job },
        { path: 'step-3', component: Step3Access },
        { path: 'preview', component: Step4Preview },
      ],
    }
  ],
})

export default router
