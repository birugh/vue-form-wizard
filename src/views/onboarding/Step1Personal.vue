<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

import { useOnboardingStore } from '@/stores/onboarding.store'
import { createDraft, updateStep1 } from '@/api/onboarding.api'

const router = useRouter()
const store = useOnboardingStore()

// 1️⃣ Schema
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

// 2️⃣ Form
const { handleSubmit, setValues, errors, isSubmitting } = useForm({
    validationSchema: schema,
    validateOnMount: false,
})

const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: phone } = useField('phone')
const { value: emergency_contact } = useField('emergency_contact')

// 3️⃣ Submit
const submit = handleSubmit(async (values) => {
    let onboardingId

    if (!store.onboarding?.id) {
        const res = await createDraft(values)
        onboardingId = res.data.data.id
    }
    else {
        onboardingId = store.onboarding.id
        await updateStep1(onboardingId, values)
    }

    await store.fetchOnboarding(onboardingId)

    router.push('/onboarding/step-2')
})

// 4️⃣ Load existing draft (edit case)
onMounted(() => {
    // console.log(store.onboarding);
    if (!store.onboarding?.personal_information) return

    setValues(store.onboarding.personal_information)
})
</script>

<template>
    <section>
        <h2>Step 1 - Personal Information</h2>

        <form>
            <div>
                <label>Name</label>
                <input type="text" v-model="name" />
                <span class="error-message">{{ errors.name }}</span>
            </div>

            <div>
                <label>Email</label>
                <input type="email" v-model="email" />
                <span class="error-message">{{ errors.email }}</span>
            </div>

            <div>
                <label>Phone Number</label>
                <input type="text" v-model="phone" />
                <span class="error-message">{{ errors.phone }}</span>
            </div>

            <div>
                <label>Emergency Contact</label>
                <input type="text" v-model="emergency_contact" />
                <span class="error-message">{{ errors.emergency_contact }}</span>
            </div>
        </form>

        <div>
            <button type="button" disabled>
                Back
            </button>
            <button type="button" @click="submit" :disabled="isSubmitting">
                Next
            </button>
        </div>

    </section>
</template>
