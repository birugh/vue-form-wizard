<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useServerPagination } from '@/composables/useServerPagination'

// PrimeVue
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

const router = useRouter()
const store = useOnboardingStore()
const { onPageChange } = useServerPagination(store)

onMounted(async () => {
    await store.fetchAll()
})

const openDraft = (item) => {
    if (item.submitted_at) return

    store.setActive(item)

    if (!item.personal_information) {
        router.push('/onboarding/step-1')
    } else if (!item.job_details) {
        router.push('/onboarding/step-2')
    } else if (!item.access_rights) {
        router.push('/onboarding/step-3')
    } else {
        router.push('/onboarding/preview')
    }
}

// fallback kalau belum ada loading di store
const isLoading = computed(() => store.loading === true)

// dummy rows untuk skeleton
const skeletonRows = Array.from({ length: 5 })
</script>

<template>
    <section>
        <div class="dashboard__title">
            <h1>Onboarding Drafts</h1>
            <router-link to="/onboarding/step-1"><Button label="Create Onboarding" size="small" /></router-link>
        </div>

        <DataTable v-if="isLoading" :value="skeletonRows" stripedRows tableStyle="min-width: 60rem">
            <Column header="Name">
                <template #body>
                    <Skeleton width="80%" />
                </template>
            </Column>

            <Column header="Status">
                <template #body>
                    <Skeleton width="60%" />
                </template>
            </Column>

            <Column header="Last Updated">
                <template #body>
                    <Skeleton width="70%" />
                </template>
            </Column>

            <Column header="Action">
                <template #body>
                    <Skeleton width="50%" height="2rem" />
                </template>
            </Column>
        </DataTable>

        <!-- ✅ DATA TABLE -->
        <DataTable v-else lazy paginator :value="store.list" :rows="store.perPage" :totalRecords="store.total"
            :first="(store.page - 1) * store.perPage" @page="onPageChange">
            <Column header="Name">
                <template #body="{ data }">
                    {{ data.personal_information?.name || '-' }}
                </template>
            </Column>

            <Column header="Status" field="status" />

            <Column header="Last Updated" field="updated_at" />

            <Column header="Action">
                <template #body="{ data }">
                    <Button v-if="!data.submitted_at" label="Continue" size="small" @click="openDraft(data)" />
                    <span v-else>Submitted</span>
                </template>
            </Column>
        </DataTable>
    </section>
</template>
