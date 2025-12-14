<script setup>
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import PreviewPersonal from '@/components/preview/PreviewPersonal.vue';
import PreviewJob from '@/components/preview/PreviewJob.vue';
import PreviewAccess from '@/components/preview/PreviewAccess.vue';
import PreviewEvidence from '@/components/preview/PreviewEvidence.vue';

const store = useOnboardingStore()

// =======================
// 1️⃣ Read-only onboarding data
// =======================
const onboarding = computed(() => store.onboarding)

// =======================
// 2️⃣ Expose confirmation ke Wizard
// =======================
defineExpose({
  confirmFinal() {
    if (!onboarding.value?.id) return false
    return true
  },
})
</script>

<template>
  <section>
    <h2>Step 4 - Preview & Confirmation</h2>
    <p>Please review all information before submitting.</p>

    <div v-if="!onboarding">
      <p>Loading preview...</p>
    </div>

    <div v-else>
      <PreviewPersonal :data="onboarding.personal_information" />
      <PreviewJob :data="onboarding.job_details" />
      <PreviewAccess :data="onboarding.access_rights" />
      <PreviewEvidence :files="onboarding.access_rights?.evidences || []" />
    </div>
  </section>
</template>
