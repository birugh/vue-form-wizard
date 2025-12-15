<script setup>
import { confirmUnsavedChanges } from '@/utils/confirmUnsaved';
import WizardSteps from './WizardSteps.vue'
import { useOnboardingWizard } from '@/composables/useOnboardingWizard'
import { ref } from 'vue'
import NavigationBar from '@/components/navigation/navigation-bar.vue';
import Sidebar from '@/components/navigation/side-bar.vue';
import { useOnboardingStore } from '@/stores/onboarding.store'

const store = useOnboardingStore()

const isSubmitted = computed(() => store.isSubmitted)

const sidebarVisible = ref(false)

const route = useRoute()
const router = useRouter()

const {
  stepRef,
  resolvedSteps,
  currentIndex,
  isProcessing,
  goBack,
  goNext,
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

const handleGoBack = () => {

  if (isSubmitted.value) {

    router.push('/onboardings');
  } else {
    goBack()
  }
}

</script>

<template>
  <header>
    <navigation-bar @toggle-sidebar="sidebarVisible = true" />
  </header>
  <div class="container py-12">
    <div class="container-content">

      <div class="dashboard__title">
        <h2 class="font-semibold text-2xl mb-8">Employee Onboarding Wizard</h2>
        <Button v-if="isSubmitted" icon="pi pi-chevron-circle-left" @click="handleGoBack" label="Back" size="small"
          severity="secondary" />
      </div>

      <WizardSteps :steps="resolvedSteps" :modelValue="activeStep" @request-step-change="handleStepChange" />

      <main class="my-12">
        <router-view v-slot="{ Component }">
          <component :is="Component" ref="stepRef" />
        </router-view>
      </main>

      <footer>
        <div class="flex justify-between items-center">

          <Button @click="saveDraft" :disabled="isProcessing || isSubmitted" label="Save as Draft" size="small" />
          <ButtonGroup>
            <Button @click="handleGoBack" :disabled="isProcessing || currentIndex === 0 || isSubmitted" label="Previous"
              size="small" />
            <Button @click="goNext" :disabled="isProcessing || isSubmitted"
              :label="currentIndex < 3 ? 'Next' : 'Submit'" size="small" />
          </ButtonGroup>
        </div>
      </footer>
    </div>
  </div>
  <sidebar v-model:visible="sidebarVisible" />
</template>
