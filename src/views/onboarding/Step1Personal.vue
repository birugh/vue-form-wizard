<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { createDraft } from '@/api/onboarding.api'
// import { debounce } from '@/utils/debounce'
import { loadOnboardingData } from '@/utils/loadOnboarding'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'


const step1Schema = yup.object({
    name: yup.string().required('Name wajib diisi'),
    email: yup.string().email('Email tidak valid').required('Email wajib diisi'),
    phone: yup.string()
        .required('Nomor HP wajib diisi')
        .matches(
            /^08[0-9]{8,11}$/,
            'Nomor HP harus diawali 08 dan berisi 10–13 digit'
        ),
    emergency_contact: yup.string()
        .required('Emergency contact wajib diisi')
        .matches(
            /^08[0-9]{8,11}$/,
            'Nomor HP harus diawali 08 dan berisi 10–13 digit'
        ),
})

const {
    handleSubmit,
    setValues,
    values,
    errors,
    // meta,

} = useForm({
    validationSchema: step1Schema,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
})


const router = useRouter()
const store = useOnboardingStore()

// const form = reactive({
//     name: '',
//     email: '',
//     phone: '',
//     emergency_contact: '',
// })
const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: phone } = useField('phone')
const { value: emergency_contact } = useField('emergency_contact')


const isSaving = ref(false)
const isValid = ref(false)

// function validateStep1() {
//     return (
//         form.name &&
//         form.email &&
//         form.phone &&
//         form.emergency_contact
//     )
// }

async function saveDraft() {
    // if (!validateStep1()) return

    if (!store.onboardingId) return

    try {
        isSaving.value = true
        const result = await createDraft(values)
        store.setOnboardingId(result.data.data.id)
        store.step1Completed = true
    } catch (err) {
        console.error(err)
    } finally {
        isSaving.value = false
    }
}

// const autoSave = debounce(() => {
//   saveDraft()
// }, 800)

// watch(form, () => {
//     if (validateStep1()) {
//         autoSave()
//     }
// })

// onBeforeRouteLeave(() => {
//     if (validateStep1()) {
//         saveDraft()
//     }
// })

// function goNext() {
//     if (!validateStep1()) return
//     router.push('/onboarding/step-2')
// }
const goNext = handleSubmit(async () => {
    if (!store.onboardingId) {

        try {
            const result = await createDraft(values)
            store.setOnboardingId(result.data.data.id)
            store.step1Completed = true
        } catch (err) {
            console.error(err)
        }
    }
    store.maxStepReached = Math.max(store.maxStepReached, 2)
    router.push('/onboarding/step-2')

})


onMounted(async () => {
    try {
        console.log(store.onboardingId);
        if (!store.onboardingId) return

        const onboarding = await loadOnboardingData(store.onboardingId)

        if (onboarding.personal_information) {
            setValues(onboarding.personal_information)
            // console.log(onboarding.personal_information);
            // console.log(form);
        }
    } catch (err) {
        console.log(err)
    }
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
            <button type="button" @click="saveDraft">
                Save Draft
            </button>

            <button type="button" @click="goNext">
                Next
            </button>
        </div>

        <p v-if="isSaving">Saving draft...</p>
    </section>
</template>
