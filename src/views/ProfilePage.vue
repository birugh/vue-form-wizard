<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useRouter } from 'vue-router'

import Skeleton from 'primevue/skeleton'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { ButtonGroup, Message, Panel } from 'primevue'
import PreviewEvidence from '@/components/preview/PreviewEvidence.vue'

const auth = useAuthStore()
const onboardingStore = useOnboardingStore()
const router = useRouter()

const user = computed(() => auth.user)
const onboarding = computed(() => onboardingStore.onboarding)

const handleLogout = async () => {
    await auth.logout()
    router.replace('/login')
}
</script>

<template>
    <h2 class="text-2xl font-medium mb-4">Profile</h2>

    <div v-if="!user & !onboarding">
        <Panel header="Personal Information" class="profile__content" toggleable>
            <div class="flex flex-col gap-4">
                <Skeleton height="2rem" width="40%" />
                <Skeleton height="1.5rem" width="30%" />

                <Divider />

                <Skeleton height="1.5rem" width="50%" />
                <div class="flex gap-4">
                    <Skeleton height="3rem" width="45%" />
                    <Skeleton height="3rem" width="45%" />
                </div>

                <Divider />

                <Skeleton height="1.5rem" width="50%" />
                <div class="flex gap-4">
                    <Skeleton height="3rem" width="45%" />
                    <Skeleton height="3rem" width="45%" />
                </div>
            </div>
        </Panel>
        <Divider />
        <Panel header="Onboarding Information" class="profile__content" toggleable>
            <div class="flex flex-col gap-4">
                <Skeleton height="2rem" width="40%" />
                <Skeleton height="1.5rem" width="30%" />

                <Divider />

                <Skeleton height="1.5rem" width="50%" />
                <div class="flex gap-4">
                    <Skeleton height="3rem" width="45%" />
                    <Skeleton height="3rem" width="45%" />
                </div>

                <Divider />

                <Skeleton height="1.5rem" width="50%" />
                <div class="flex gap-4">
                    <Skeleton height="3rem" width="45%" />
                    <Skeleton height="3rem" width="45%" />
                </div>
            </div>
        </Panel>
    </div>
    <div v-else>
        <Panel header="Personal Information" class="profile__content" toggleable>
            <div class="flex flex-row gap-4">
                <div class="flex flex-col w-120">
                    <p>Name </p>
                    <small>{{ user?.name }}</small>
                    <p>Email </p>
                    <small>{{ user?.email }}</small>
                </div>
                <div class="flex flex-col">
                    <p>Role</p>
                    <small>
                        <Tag :value="user?.role" severity="info" />
                    </small>
                    <p>Verified</p>
                    <small>
                        <Tag :value="user?.is_verified ? 'Verified' : 'Unverified'"
                            :severity="user?.is_verified ? 'success' : 'warn'" />
                    </small>
                </div>
            </div>

            <p>Joined At</p>
            <small>{{ user?.created_at }}</small>
        </Panel>

        <Divider />

        <div v-if="user?.role === 'user'">
            <Panel header="Onboarding Information" class="profile__content" toggleable>

                <div v-if="!onboarding" class="flex flex-col gap-2">
                    <Message severity="warn" size="medium">No onboarding information available.</Message>
                </div>

                <div v-else class="flex flex-col gap-4">
                    <div class="flex flex-row">

                        <div class="flex flex-col gap-1 w-120">
                            <p>Status</p>
                            <small>
                                <Tag :value="onboarding.status" severity="info" />
                            </small>
                        </div>
                        <div class="flex flex-col">

                            <p>Submitted At</p>
                            <small>{{ onboarding.submitted_at ?? '-' }}</small>
                        </div>
                    </div>

                    <Divider />

                    <div v-if="onboarding.personal_information">
                        <h4 class="text-xl font-medium mb-2">Personal Information</h4>

                        <div class="flex flex-row">
                            <div class="flex-col w-120">
                                <div class="profile__content">

                                    <p>Name</p>
                                    <small>{{ onboarding.personal_information.name }}</small>
                                </div>
                                <div class="profile__content">
                                    <p>Email</p>
                                    <small>{{ onboarding.personal_information.email }}</small>
                                </div>
                            </div>

                            <div class="flex-col">
                                <p>Phone</p>
                                <small>{{ onboarding.personal_information.phone }}</small>
                                <p>Emergency Contact</p>
                                <small class="mb-4">{{ onboarding.personal_information.emergency_contact }}</small>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div v-if="onboarding.job_details">
                        <h4 class="font-medium mb-2">Job Details</h4>

                        <div class="flex flex-row gap-1">
                            <div class="flex-row gap-1 w-120">

                                <p>Department</p>
                                <small>{{ onboarding.job_details.department }}</small>

                                <p>Job Title</p>
                                <small>{{ onboarding.job_details.job_title }}</small>

                            </div>

                            <div class="flex-row gap-1">
                                <p>Work Arrangement</p>
                                <small>{{ onboarding.job_details.work_arrangement }}</small>

                                <p>Device Request</p>
                                <small>{{ onboarding.job_details.device_request }}</small>
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <div v-if="onboarding.access_rights">
                        <h4 class="font-medium mb-2">Access Rights</h4>

                        <div class="flex flex-row gap-1">
                            <div class="flex-row gap-1 w-120">

                                <p>Access Level</p>
                                <small>{{ onboarding.access_rights.access_level }}</small>

                                <p>Specific Zones</p>
                                <small class="flex flex-wrap gap-2">
                                    <Tag v-for="zone in onboarding.access_rights.specific_zones" :key="zone"
                                        :value="zone" severity="info" />
                                </small>
                            </div>

                            <div class="flex-row gap-1">
                                <p>Technical Tools</p>
                                <small class="flex flex-wrap gap-2">
                                    <Tag v-for="tool in onboarding.access_rights.technical_tools" :key="tool"
                                        :value="tool" severity="success" />
                                </small>


                                <p>Communication Tools</p>
                                <small class="flex flex-wrap gap-2">
                                    <Tag v-for="tool in onboarding.access_rights.communication_tools" :key="tool"
                                        :value="tool" severity="warn" />
                                </small>
                            </div>
                        </div>

                    </div>
                </div>
            </Panel>
            <Divider />

            <PreviewEvidence :files="onboarding.access_rights.evidences || []" />
        </div>

        <Divider />
        <div class="dashboard__title">
            <Button label="Logout" severity="danger" size="small" @click="handleLogout" />
            <ButtonGroup v-if="user?.role === 'admin'">

                <Button label="Create" size="medium" severity="secondary">
                    <router-link to="/onboardings" class="font-medium">Create</router-link>
                </Button>
                <Button label="Dashboard Onboarding" size="medium">
                    <router-link to="/onboardings" class="font-medium">Dashboard Onboarding</router-link>
                </Button>
            </ButtonGroup>
        </div>
    </div>
</template>
