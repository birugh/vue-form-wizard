<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

// =======================
// 1️⃣ Schema (tetap di step)
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
// 3️⃣ Load existing draft
// =======================
onMounted(() => {
    if (!store.onboarding?.personal_information) return
    setValues(store.onboarding.personal_information)
})

// =======================
// 4️⃣ EXPOSE CONTRACT KE WIZARD
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

        <!-- <div>
            <button type="button" disabled>
                Back
            </button>
            <button type="button" @click="submit" :disabled="isSubmitting">
                Next
            </button>
        </div> -->

    </section>
</template>
