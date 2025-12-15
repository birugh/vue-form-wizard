<script setup>
import { computed } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding.store'
import PreviewPersonal from '@/components/preview/PreviewPersonal.vue';
import PreviewJob from '@/components/preview/PreviewJob.vue';
import PreviewAccess from '@/components/preview/PreviewAccess.vue';
import PreviewEvidence from '@/components/preview/PreviewEvidence.vue';
import { Message } from 'primevue';

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
        <h2 class="text-2xl font-medium mb-4">Preview & Confirmation</h2>
        <!-- <p>Please review all information before submitting.</p> -->
        <Message severity="error">Please review all information before submitting.</Message>
        <div class="h-separator"></div>

        <div v-if="!onboarding">
            <Skeleton width="100%" height="240px"></Skeleton>
        </div>

        <div class="flex flex-col gap-4" v-else>
            <PreviewPersonal :data="onboarding.personal_information" />
            <PreviewJob :data="onboarding.job_details" />
            <PreviewAccess :data="onboarding.access_rights" />
            <PreviewEvidence :files="onboarding.access_rights?.evidences || []" />
        </div>
    </section>
</template>
