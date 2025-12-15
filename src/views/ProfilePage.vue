<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { useRouter } from 'vue-router'
import { Button } from 'primevue'

const auth = useAuthStore()
const onboardingStore = useOnboardingStore()
const router = useRouter()

const user = computed(() => auth.user)
const onboarding = computed(() => onboardingStore.onboarding)

const goToOnboarding = () => {
    if (!onboarding.value) {
        router.push('/onboarding/step-1')
        return
    }

    if (!onboarding.value.personal_information) {
        router.push('/onboarding/step-1')
    } else if (!onboarding.value.job_details) {
        router.push('/onboarding/step-2')
    } else if (!onboarding.value.access_rights) {
        router.push('/onboarding/step-3')
    } else {
        router.push('/onboarding/preview')
    }
}

const handleLogout = async () => {
    await auth.logout()
    router.replace('/login')
}
</script>

<template>
    <!-- ========================= -->
    <!-- PERSONAL INFORMATION -->
    <!-- ========================= -->
    <section>
        <h3>Personal Information</h3>

        <p><strong>Name:</strong> {{ user?.name }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Role:</strong> {{ user?.role }}</p>
        <p><strong>Verified:</strong> {{ user?.is_verified ? 'Yes' : 'No' }}</p>
        <p><strong>Joined At:</strong> {{ user?.created_at }}</p>
    </section>

    <hr />

    <!-- ========================= -->
    <!-- OTHER INFORMATION -->
    <!-- ========================= -->
    <section v-if="user?.role === 'user'">
        <h3>Other Information (Onboarding)</h3>

        <!-- BELUM ADA ONBOARDING -->
        <div v-if="!onboarding">
            <p>No onboarding information available.</p>
            <button @click="goToOnboarding">
                Start Onboarding
            </button>
        </div>

        <!-- ADA ONBOARDING -->
        <div v-else>
            <p><strong>Status:</strong> {{ onboarding.status }}</p>
            <p><strong>Submitted At:</strong> {{ onboarding.submitted_at ?? '-' }}</p>

            <hr />

            <!-- PERSONAL INFORMATION (ONBOARDING) -->
            <div v-if="onboarding.personal_information">
                <h4>Onboarding – Personal Information</h4>
                <p><strong>Name:</strong> {{ onboarding.personal_information.name }}</p>
                <p><strong>Email:</strong> {{ onboarding.personal_information.email }}</p>
                <p><strong>Phone:</strong> {{ onboarding.personal_information.phone }}</p>
                <p><strong>Emergency Contact:</strong> {{ onboarding.personal_information.emergency_contact }}</p>
            </div>

            <hr />

            <!-- JOB DETAILS -->
            <div v-if="onboarding.job_details">
                <h4>Job Details</h4>
                <p><strong>Job Title:</strong> {{ onboarding.job_details.job_title }}</p>
                <p><strong>Department:</strong> {{ onboarding.job_details.department }}</p>
                <p><strong>Join Date:</strong> {{ onboarding.job_details.join_date }}</p>
                <p><strong>Work Arrangement:</strong> {{ onboarding.job_details.work_arrangement }}</p>
                <p><strong>Device Request:</strong> {{ onboarding.job_details.device_request }}</p>
            </div>

            <hr />

            <!-- ACCESS RIGHTS -->
            <div v-if="onboarding.access_rights">
                <h4>Access Rights</h4>

                <p><strong>Access Level:</strong> {{ onboarding.access_rights.access_level }}</p>

                <p><strong>Specific Zones:</strong></p>
                <ul>
                    <li v-for="zone in onboarding.access_rights.specific_zones" :key="zone">
                        {{ zone }}
                    </li>
                </ul>

                <p><strong>Technical Tools:</strong></p>
                <ul>
                    <li v-for="tool in onboarding.access_rights.technical_tools" :key="tool">
                        {{ tool }}
                    </li>
                </ul>

                <p><strong>Communication Tools:</strong></p>
                <ul>
                    <li v-for="tool in onboarding.access_rights.communication_tools" :key="tool">
                        {{ tool }}
                    </li>
                </ul>

                <p><strong>Evidences:</strong></p>
                <ul>
                    <li v-for="(file, index) in onboarding.access_rights.evidences" :key="index">
                        {{ file.original_name }} ({{ file.mime }})
                    </li>
                </ul>
            </div>

            <hr />

            <!-- <button @click="goToOnboarding">
                Continue / Review Onboarding
            </button> -->

        </div>
    </section>



    <!-- ========================= -->
    <!-- ADMIN VIEW -->
    <!-- ========================= -->
    <section v-else>
        <h3>Other Information</h3>
        <p>You are logged in as admin.</p>

        <router-link to="/onboardings">
            Go to Onboardings Dashboard
        </router-link>
    </section>
    <Button @click="handleLogout" label="Logout" size="small" />
</template>
