<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { createDraft } from '@/api/onboarding.api'
// import { debounce } from '@/utils/debounce'
import { loadOnboardingData } from '@/utils/loadOnboarding'

const router = useRouter()
const store = useOnboardingStore()

const form = reactive({
    name: '',
    email: '',
    phone: '',
    emergency_contact: '',
})

const isSaving = ref(false)
const isValid = ref(false)

function validateStep1() {
    return (
        form.name &&
        form.email &&
        form.phone &&
        form.emergency_contact
    )
}

async function saveDraft() {
    if (!validateStep1()) return

    if (store.onboardingId) return

    try {
        isSaving.value = true
        const { result } = await createDraft(form)
        store.setOnboardingId(result.data.id)
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

function goNext() {
    if (!validateStep1()) return
    router.push('/onboarding/step-2')
}

onMounted(async () => {
    try {
        const onboarding = await loadOnboardingData(store.onboardingId)


        if (onboarding.personal_information) {
            Object.assign(form, onboarding.personal_information)
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
                <input type="text" v-model="form.name" />
            </div>

            <div>
                <label>Email</label>
                <input type="email" v-model="form.email" />
            </div>

            <div>
                <label>Phone Number</label>
                <input type="text" v-model="form.phone" />
            </div>

            <div>
                <label>Emergency Contact</label>
                <input type="text" v-model="form.emergency_contact" />
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
