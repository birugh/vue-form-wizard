<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

// PrimeVue
import InputText from 'primevue/inputtext'
import { Message } from 'primevue'

// =======================
// 1️⃣ Schema
// =======================
const schema = yup.object({
    name: yup.string().required('Name wajib diisi'),
    email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
    phone: yup.string()
        .required('Nomor HP wajib diisi')
        .matches(/^08[0-9]{8,11}$/, 'Nomor HP tidak valid'),
    emergency_contact: yup.string()
        .required('Emergency contact wajib diisi')
        .matches(/^08[0-9]{8,11}$/, 'Nomor HP tidak valid'),
})

// =======================
// 2️⃣ Form
// =======================
const {
    validate,
    setValues,
    values,
    errors,
} = useForm({
    validationSchema: schema,
    validateOnMount: false,
})

const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: phone } = useField('phone')
const { value: emergency_contact } = useField('emergency_contact')

const store = useOnboardingStore()

// =======================
// 3️⃣ Load draft
// =======================
onMounted(() => {
    if (!store.onboarding?.personal_information) return
    setValues(store.onboarding.personal_information)
})

// =======================
// 4️⃣ Contract ke Wizard
// =======================
defineExpose({
    async validateStep() {
        const result = await validate()
        return result.valid
    },
    getValues() {
        return values
    },
})
</script>

<template>
    <section>
        <h2>Step 1 - Personal Information</h2>

        <form class="flex justify-center flex-col gap-4">
            <div class="flex flex-col gap-1">
                <label>Name</label>
                <InputText v-model="name" />
                <Message v-if="errors.name" severity="error" size="small" variant="simple">{{ errors.name }}</Message>
            </div>

            <div class="flex flex-col gap-1">
                <label>Email</label>
                <InputText v-model="email" type="email" />
                <Message v-if="errors.email" severity="error" size="small" variant="simple">{{ errors.email }}</Message>
            </div>

            <div class="flex flex-col gap-1">
                <label>Phone Number</label>
                <InputText v-model="phone" />
                <Message v-if="errors.phone" severity="error" size="small" variant="simple">{{ errors.phone }}</Message>
            </div>

            <div class="flex flex-col gap-1">
                <label>Emergency Contact</label>
                <InputText v-model="emergency_contact" />
                <Message v-if="errors.emergency_contact" severity="error" size="small" variant="simple">{{ errors.emergency_contact }}</Message>
            </div>
        </form>
    </section>
</template>
