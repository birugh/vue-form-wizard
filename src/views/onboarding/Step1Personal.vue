<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

import InputText from 'primevue/inputtext'
import { Message } from 'primevue'


const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^08[0-9]{8,11}$/, 'Invalid phone number'),
    emergency_contact: yup.string()
        .required('Emergency contact is required')
        .matches(/^08[0-9]{8,11}$/, 'Invalid phone number'),
})

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

onMounted(() => {
    if (!store.onboarding?.personal_information) return
    setValues(store.onboarding.personal_information)
})

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
    <h2 class="text-2xl font-medium mb-4">Personal Information</h2>
    <div class="h-separator"></div>

    <form class="flex justify-center flex-col gap-4">
        <div class="field-row">

            <div class="flex flex-col gap-1 w-100">
                <label class="label-field req">Name</label>
                <InputText v-model="name" placeholder="e.g. Biru Kheza Maharley" />
                <Message v-if="errors.name" severity="error" size="small" variant="simple">{{
                    errors.name }}</Message>
            </div>

            <div class="flex flex-col gap-1 w-100">
                <label class="label-field req">Email</label>
                <InputText v-model="email" type="email" placeholder="e.g. example@gmail.com" />
                <Message v-if="errors.email" severity="error" size="small" variant="simple">{{ errors.email }}</Message>
            </div>
        </div>

        <div class="field-row">
            <div class="flex flex-col gap-1">
                <label class="label-field req">Phone Number</label>
                <InputText v-model="phone" placeholder="e.g. 08XXXXXXXXXX" />
                <Message v-if="errors.phone" severity="error" size="small" variant="simple">{{ errors.phone }}</Message>
            </div>

            <div class="flex flex-col gap-1">
                <label class="label-field req">Emergency Contact</label>
                <InputText v-model="emergency_contact" placeholder="e.g. 08XXXXXXXXXX" />
                <Message v-if="errors.emergency_contact" severity="error" size="small" variant="simple">{{
                    errors.emergency_contact }}</Message>
            </div>
        </div>
    </form>
</template>
