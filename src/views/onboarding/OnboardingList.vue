<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useServerPagination } from '@/composables/useServerPagination'
import NavigationBar from '@/components/navigation/navigation-bar.vue';
import Sidebar from '@/components/navigation/side-bar.vue';

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

const hasPersonalInfo = (item) =>
    !!item.personal_information

const hasJobDetails = (item) =>
    !!item.job_details

const hasAccessRights = (item) => {
    const ar = item.access_rights
    if (!ar) return false

    if (!ar.access_level || ar.access_level === 'undefined') return false
    if (!Array.isArray(ar.evidences) || ar.evidences.length === 0) return false

    return true
}

const openDraft = (item) => {
    store.setActive(item)

    if (!hasPersonalInfo(item)) {
        router.push('/onboarding/step-1')
    } else if (!hasJobDetails(item)) {
        router.push('/onboarding/step-2')
    } else if (!hasAccessRights(item)) {
        router.push('/onboarding/step-3')
    } else {
        router.push('/onboarding/preview')
    }
}

const isLoading = computed(() => store.loading === true)

const skeletonRows = Array.from({ length: 10 })

const sidebarVisible = ref(false)
</script>

<template>
    <header>
        <navigation-bar @toggle-sidebar="sidebarVisible = true" />
    </header>
    <main class="my-12">
        <div class="container">

            <div class="dashboard__title">
                <h2 class="text-2xl font-medium mb-4">Onboarding Drafts</h2>
                <router-link to="/onboarding/step-1"><Button label="Create Onboarding" size="small"
                        icon="pi pi-plus-circle" /></router-link>
            </div>

            <DataTable v-if="isLoading" :value="skeletonRows" stripedRows tableStyle="min-width: 60rem">
                <Column header="No">
                    <template #body>
                        <Skeleton width="50%" />
                    </template>
                </Column>
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

            <DataTable v-else lazy paginator :value="store.list" :rows="store.perPage" :totalRecords="store.total"
                :first="(store.page - 1) * store.perPage" @page="onPageChange">
                <Column header="No">
                    <template #body="{ index }">
                        {{ index + 1 }}
                    </template>
                </Column>
                <Column header="Name">
                    <template #body="{ data }">
                        {{ data.personal_information?.name || '-' }}
                    </template>
                </Column>

                <Column header="Status" field="status" />

                <Column header="Last Updated" field="updated_at" />

                <Column header="Action">
                    <template #body="{ data }">
                        <Button v-if="!data.submitted_at" label="Continue" size="small" severity="info"
                            @click="openDraft(data)" />
                        <Button v-else label="Submitted" size="small" icon="pi pi-file-check" severity="success"
                            @click="openDraft(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </main>
    <sidebar v-model:visible="sidebarVisible" />
</template>
