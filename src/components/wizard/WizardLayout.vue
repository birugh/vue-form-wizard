<script setup>
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const store = useOnboardingStore()

const steps = [
  { label: 'Personal Information', path: '/onboarding/step-1', step: 1 },
  { label: 'Job Details', path: '/onboarding/step-2', step: 2 },
  { label: 'Access Rights & Evidence', path: '/onboarding/step-3', step: 3 },
  { label: 'Preview & Confirmation', path: '/onboarding/preview', step: 4 },
]

function goNext() {
  // 
}

function goBack() {
  // 
  router.back()
}

function saveDraft() {
  // 
}

function submit() {
  // 
}
</script>

<template>
  <div>
    <header>
      <h1>Employee Onboarding Wizard</h1>
    </header>

    <nav>
      <li v-for="s in steps" :key="s.step">
        <router-link v-if="store.maxStepReached >= s.step" :to="s.path">
          Step {{ s.step }} - {{ s.label }}
        </router-link>

        <span v-else class="disabled">
          Step {{ s.step }} - {{ s.label }}
        </span>
      </li>
    </nav>

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
