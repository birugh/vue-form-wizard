<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { updateStep3 } from '@/api/onboarding.api'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'


// import { debounce } from '@/utils/debounce'

const router = useRouter()
const store = useOnboardingStore()

if (!store.onboardingId) {
    router.push('/onboarding/step-1')
}

const step3Schema = yup.object({
    communication_tools: yup
        .array()
        .of(yup.string())
        .min(1, 'Pilih minimal 1 communication tool'),

    technical_tools: yup
        .array()
        .of(yup.string())
        .min(1, 'Pilih minimal 1 technical tool'),

    access_level: yup
        .string()
        .required('Access level wajib dipilih'),

    specific_zones: yup
        .array()
        .of(yup.string())
        .min(1, 'Pilih minimal 1 zone'),
})

const {
    handleSubmit,
    values,
    errors,
    setValues,
} = useForm({
    validationSchema: step3Schema,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
})

const { value: communication_tools } = useField('communication_tools', undefined, {
    initialValue: [],
})

const { value: technical_tools } = useField('technical_tools', undefined, {
    initialValue: [],
})

const { value: access_level } = useField('access_level')

const { value: specific_zones } = useField('specific_zones', undefined, {
    initialValue: [],
})



// const form = reactive({
//     communication_tools: [],
//     technical_tools: [],
//     access_level: '',
//     specific_zones: [],
// })

const files = ref([])

function handleFiles(event) {
    files.value = Array.from(event.target.files)
}

const saveDraft = async () => {
    if (!store.onboardingId) return

    const formData = new FormData()

    formData.append('access_level', values.access_level || '')

    values.communication_tools?.forEach(v =>
        formData.append('communication_tools[]', v)
    )

    values.technical_tools?.forEach(v =>
        formData.append('technical_tools[]', v)
    )

    values.specific_zones?.forEach(v =>
        formData.append('specific_zones[]', v)
    )

    files.value.forEach(file =>
        formData.append('evidences[]', file)
    )

    try {
        await updateStep3(store.onboardingId, formData)
    } catch (err) {
        console.error(err)
    }
}


// const autoSave = debounce(() => {
//   saveDraft()
// }, 1000)

// watch(form, () => {
//   autoSave()
// })

// onBeforeRouteLeave(() => {
//     saveDraft()
// })

const goNext = handleSubmit(async () => {
    await saveDraft()
    router.push('/onboarding/preview')
})

const goBack = async () => {
    await saveDraft()
    router.push('/onboarding/step-2')
}
</script>

<template>
    <section>
        <h2>Step 3 - Access Rights & Evidence</h2>

        <form>
            <fieldset>
                <legend>System Access</legend>

                <label>Communication Tools</label>
                <Multiselect v-model="communication_tools" mode="tags" :options="['Slack', 'Email']" />
                <span class="error-message">
                    {{ errors.communication_tools }}
                </span>

                <label>Technical Tools</label>
                <Multiselect v-model="technical_tools" mode="tags" :options="['GitHub', 'Postman']" />
                <span class="error-message">
                    {{ errors.technical_tools }}
                </span>
            </fieldset>

            <fieldset>
                <legend>Facility Access</legend>

                <div>
                    <label>Access Level</label>
                    <select v-model="access_level">
                        <option value="">Select</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    <span class="error-message">
                        {{ errors.access_level }}
                    </span>
                </div>

                <div>
                    <label>Specific Zones</label>
                    <Multiselect v-model="specific_zones" mode="tags"
                        :options="['Office', 'Server Room', 'Warehouse']" />
                    <span class="error-message">
                        {{ errors.specific_zones }}
                    </span>
                </div>
            </fieldset>

            <div>
                <label>Upload Evidence</label>
                <input type="file" multiple @change="handleFiles" />
            </div>
        </form>

        <div>
            <button type="button" @click="goBack">Back</button>
            <button type="button" @click="saveDraft">Save Draft</button>
            <button type="button" @click="goNext">Next</button>
        </div>
    </section>
</template>
