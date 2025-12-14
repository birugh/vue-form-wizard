<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
    const result = await login(username.value, password.value)

    if (!result.ok) {
        error.value = result.message
        return
    }

    router.push('/onboarding')
}

</script>

<template>
    <h1 class="text-center font-medium text-2xl mb-4">Login Form</h1>

    <form method="POST" @submit.prevent="handleSubmit">
        <div>
            <label class="label-field req">Email</label><br>
            <input class="field" type="email" name="email" v-model="username">
        </div>

        <div>
            <label class="label-field req">Password</label><br>
            <input class="field" type="password" name="password" v-model="password">
        </div>

        <p class="error-message my-2">{{ error }}</p>
        <button class="btn btn-primary cursor-pointer mt-2 mb-4">Login</button>
    </form>
</template>