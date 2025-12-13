<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from '@/stores/onboarding.store'
import { updateStep3 } from '@/api/onboarding.api'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

// import { debounce } from '@/utils/debounce'

const router = useRouter()
const store = useOnboardingStore()

if (!store.onboardingId) {
    router.push('/onboarding/step-1')
}

const form = reactive({
    communication_tools: [],
    technical_tools: [],
    access_level: '',
    specific_zones: [],
})

const files = ref([])

function handleFiles(event) {
    files.value = Array.from(event.target.files)
}

async function saveDraft() {
    if (!store.onboardingId) return


    const formData = new FormData()

    // Access rights
    formData.append('access_level', form.access_level)

    form.communication_tools.forEach(v =>
        formData.append('communication_tools[]', v)
    )

    form.technical_tools.forEach(v =>
        formData.append('technical_tools[]', v)
    )

    form.specific_zones.forEach(v =>
        formData.append('specific_zones[]', v)
    )

    // Files
    files.value.forEach(file =>
        formData.append('evidences[]', file)
    )

    console.log(form);
    console.log(files);
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1])
    }

    try {
        await updateStep3(store.onboardingId, formData)
    } catch (err) {
        if (err.response) {
            console.error('Status:', err.response.status)
            console.error('Validation errors:', err.response.data)
        } else {
            console.error(err)
        }
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

async function goNext() {
    await saveDraft()
    router.push('/onboarding/preview')
}

async function goBack() {
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

                <label>
                    <Multiselect v-model="form.communication_tools" mode="tags" :options="['Slack', 'Email']" />

                </label>

                <label>
                    <Multiselect v-model="form.technical_tools" mode="tags" :options="['GitHub', 'Postman']" />

                </label>
            </fieldset>

            <fieldset>
                <legend>Facility Access</legend>

                <div>
                    <label>Access Level</label>
                    <select v-model="form.access_level">
                        <option value="">Select</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>

                <div>
                    <label>Specific Zones</label>
                    <Multiselect v-model="form.specific_zones" mode="tags" :close-on-select="false" :searchable="true"
                        :options="[
                            'Office',
                            'Server Room',
                            'Warehouse'
                        ]" />
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
