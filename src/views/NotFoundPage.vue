<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { Button } from 'primevue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const goHome = () => {
    if (!auth.isAuthenticated) {
        router.push('/login')
    } else if (auth.isAdmin) {
        router.push('/onboardings')
    } else {
        router.push('/profile')
    }
}
</script>

<template>
    <div class="h-screen flex justify-center items-center">
        <div class=" flex flex-col gap-2 w-fit p-12 rounded-md shadow-md text-center">
            <h2 class="font-bold text-6xl">404</h2>
            <p class="font-normal text-4xl mb-4">Page not found.</p>

            <Button @click="goHome" size="medium" variant="link" label="Go Back" class="w-fit mx-auto" />
        </div>
    </div>
</template>
