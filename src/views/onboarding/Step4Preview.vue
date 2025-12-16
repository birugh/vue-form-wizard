<script setup>
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import PreviewPersonal from '@/components/preview/PreviewPersonal.vue';
import PreviewJob from '@/components/preview/PreviewJob.vue';
import PreviewAccess from '@/components/preview/PreviewAccess.vue';
import PreviewEvidence from '@/components/preview/PreviewEvidence.vue';
import { Divider, Message, Skeleton } from 'primevue';

const store = useOnboardingStore()

const onboarding = computed(() => store.onboarding)

defineExpose({
  confirmFinal() {
    if (!onboarding.value?.id) return false
    return true
  },
})
</script>

<template>
  <section>
    <h2 class="text-2xl font-medium mb-4">Preview & Confirmation</h2>
    <Message severity="error">Please review all information before submitting.</Message>
    <div class="h-separator"></div>

    <div v-if="!onboarding">
      <div class="flex flex-col gap-4">
        <Skeleton height="2rem" width="40%" />
        <Skeleton height="1.5rem" width="30%" />

        <Divider />

        <Skeleton height="1.5rem" width="50%" />
        <Skeleton height="3rem" width="45%" />

        <Divider />

        <Skeleton height="1.5rem" width="50%" />
        <Skeleton height="3rem" width="45%" />

        <Divider />

        <Skeleton height="1.5rem" width="50%" />
        <Skeleton height="3rem" width="45%" />

        <Divider />

        <Skeleton height="1.5rem" width="50%" />
        <Skeleton height="3rem" width="45%" />
      </div>
    </div>

    <div class="flex flex-col gap-4" v-else>
      <PreviewPersonal :data="onboarding.personal_information" />
      <PreviewJob :data="onboarding.job_details" />
      <PreviewAccess :data="onboarding.access_rights" />
      <PreviewEvidence :files="onboarding.access_rights?.evidences || []" />
    </div>
  </section>
</template>
