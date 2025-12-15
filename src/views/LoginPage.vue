<script setup>
import { ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth.store'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const router = useRouter()
const { login } = useAuth()
const auth = useAuthStore()

const schema = yup.object({
    email: yup
        .string()
        .email('Email tidak valid')
        .required('Email wajib diisi'),

    password: yup
        .string()
        .required('Password wajib diisi'),
})

const {
    handleSubmit,
    errors,
    isSubmitting,
} = useForm({
    validationSchema: schema,
})

const { value: email } = useField('email')
const { value: password } = useField('password')

const apiError = ref('')

const onSubmit = handleSubmit(async () => {
    apiError.value = ''

    try {
        const result = await login(email.value, password.value)

        if (!result.ok) {
            apiError.value = result.message
            return
        }

        if (auth.isAdmin) {
            router.push('/onboardings')

        } else {
            router.push('/profile')
        }

    } catch (err) {
        apiError.value = 'Email atau password salah'
        console.log(err);
    }
})
</script>

<template>
    <section>
        <h2 class="text-2xl font-medium mb-4 text-center">Login Form</h2>

        <form @submit.prevent="onSubmit" class="p-fluid">
            <div class="flex flex-col gap-1 mb-2">
                <label>Email</label>
                <InputText v-model="email" type="email" placeholder="Enter email" />
                <Message v-if="errors.email" severity="error" size="small" variant="simple">{{ errors.email }}</Message>
            </div>

            <div class="flex flex-col gap-1">
                <label>Password</label>
                <div>
                    <Password :fluid="true" v-model="password" toggleMask :feedback="false"
                        placeholder="Enter password" />
                </div>
                <Message v-if="apiError" severity="error" variant="simple" :closable="false" class="my-2">
                    {{ apiError }}
                </Message>
                <Message v-if="errors.password" severity="error" size="small" variant="simple">{{ errors.password }}
                </Message>
            </div>


            <Button v-if="isSubmitting" type="submit" label="Login" class="mt-3" />
        </form>
    </section>
</template>