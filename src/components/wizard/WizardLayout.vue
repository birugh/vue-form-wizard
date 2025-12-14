<script setup>
import { useOnboardingStore } from '@/stores/onboarding.store'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WizardSteps from './WizardSteps.vue'

const route = useRoute()
const store = useOnboardingStore()

const steps = [
  {
    step: 1,
    label: 'Personal Information',
    path: '/onboarding/step-1',
    requiredKey: null,
  },
  {
    step: 2,
    label: 'Job Details',
    path: '/onboarding/step-2',
    key: 'personal_information',
  },
  {
    step: 3,
    label: 'Access Rights & Evidence',
    path: '/onboarding/step-3',
    key: 'job_details',
  },
  {
    step: 4,
    label: 'Preview & Confirmation',
    path: '/onboarding/preview',
    key: 'access_rights',
  },
]


const resolvedSteps = computed(() => {
  if (!store.onboarding) return []

  return steps.map(step => ({
    ...step,
    enabled: store.onboarding[step.key] !== null,
  }))
})

onMounted(async () => {
  if (store.onboarding?.id) return
  if (!route.query.onboarding_id) return

  await store.fetchOnboarding(route.query.onboarding_id)
})
</script>

<template>
  <div>
    <header>
      <h1>Employee Onboarding Wizard</h1>
    </header>

    <WizardSteps :steps="resolvedSteps" />

    <main>
      <router-view />
    </main>

    <!-- <footer>
      <button type="button" @click="goBack">
        Back
      </button>

      <button type="button" @click="saveDraft">
        Save Draft
      </button>

      <button type="button" @click="goNext">
        Next
      </button>

      <button type="button" @click="submit">
        Submit
      </button>
    </footer> -->
  </div>
</template>

<style scoped>
.disabled {
  color: #aaa;
  cursor: not-allowed;
}
</style>