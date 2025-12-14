<script setup>
import { confirmUnsavedChanges } from '@/utils/confirmUnsaved';
import WizardSteps from './WizardSteps.vue'
import { useOnboardingWizard } from '@/composables/useOnboardingWizard'

const route = useRoute()
const router = useRouter()

const {
  stepRef,
  resolvedSteps,
  currentIndex,
  isProcessing,
  goNext,
  goBack,
  saveDraft,
} = useOnboardingWizard()

import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup'
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const activeStep = computed(() => {
  const current = resolvedSteps.value.find(s => s.path === route.path)
  return current ? String(current.step) : '1'
})

const handleStepChange = async (targetStep) => {
  const currentStep = stepRef.value

  if (currentStep?.hasValue?.()) {
    const confirmed = await confirmUnsavedChanges()
    if (!confirmed) return
  }

  await router.push(targetStep.path)
}
</script>

<template>
  <div class="container">
    <header>
      <h1 class="font-semibold text-2xl">Employee Onboarding Wizard</h1>
    </header>

    <WizardSteps :steps="resolvedSteps" :modelValue="activeStep" @request-step-change="handleStepChange" />

    <main>
      <div class="px-24 py-12">
        <router-view v-slot="{ Component }">

          <component :is="Component" ref="stepRef" />
        </router-view>
      </div>
    </main>

    <footer>
      <div class="flex justify-between items-center">

        <Button @click="saveDraft" :disabled="isProcessing" label="Save as Draft" size="small" />
        <ButtonGroup>
          <Button @click="goBack" :disabled="isProcessing || currentIndex === 0" label="Previous" size="small" />
          <Button @click="goNext" :disabled="isProcessing" :label="currentIndex < 3 ? 'Next' : 'Submit'" size="small" />
        </ButtonGroup>
      </div>
    </footer>
  </div>
</template>
