<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

import MultiSelect from 'primevue/multiselect'
import Select from 'primevue/select'
import FileUpload from 'primevue/fileupload'
import { Message } from 'primevue'

const schema = yup.object({
    communication_tools: yup
        .array()
        .of(yup.string())
        .min(1, 'Please select at least one communication tool'),

    technical_tools: yup
        .array()
        .of(yup.string())
        .min(1, 'Please select at least one technical tool'),

    access_level: yup
        .string()
        .required('Access level is required'),

    specific_zones: yup
        .array()
        .of(yup.string())
        .min(1, 'Please select at least one zone'),

    evidences: yup
        .array()
        .min(1, 'Please upload at least one file'),
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

const { value: communication_tools } = useField('communication_tools', undefined, { initialValue: [] })
const { value: technical_tools } = useField('technical_tools', undefined, { initialValue: [] })
const { value: access_level } = useField('access_level')
const { value: specific_zones } = useField('specific_zones', undefined, { initialValue: [] })
const { value: evidences } = useField('evidences', undefined, { initialValue: [] })

const store = useOnboardingStore()


const zoneOptions = ['Office', 'Server Room', 'Warehouse', 'Data Center', 'Meeting Room', 'Production Area']
const communicationOptions = ['Slack', 'Email', 'Microsoft Teams', 'Zoom', 'WhatsApp']
const technicalOptions = ['GitHub', 'GitLab', 'Bitbucket', 'Postman', 'Jira', 'Docker', 'Steam']
const accessLevelOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
]


const onFileSelect = (event) => {
    evidences.value = event.files
}

const onFileRemove = (event) => {
    evidences.value = evidences.value.filter(
        file => !event.files.some(f => f.name === file.name)
    )
}

onMounted(() => {
    if (!store.onboarding?.access_rights) return
    setValues(store.onboarding.access_rights)
})

const buildPayload = () => {
    const formData = new FormData()

    values.communication_tools.forEach(v =>
        formData.append('communication_tools[]', v)
    )

    values.technical_tools.forEach(v =>
        formData.append('technical_tools[]', v)
    )

    formData.append('access_level', values.access_level)

    values.specific_zones.forEach(v =>
        formData.append('specific_zones[]', v)
    )

    evidences.value.forEach(file =>
        formData.append('evidences[]', file)
    )

    return formData
}

defineExpose({
    async validateStep() {
        const result = await validate()
        return result.valid
    },
    getPayload() {
        return buildPayload()
    },
    hasValue() {
        return Object.values(values).some(
            (v) => v !== null && v !== '' && v !== undefined
        )
    },
})
</script>

<template>
    <section>

        <h2 class="text-2xl font-medium mb-4">Access Rights & Evidence</h2>
        <div class="h-separator"></div>

        <form class="flex justify-center flex-col gap-4">
            <div class="flex justify-center flex-col gap-2 mb-2">
                <h3 class="text-xl font-medium">System Access</h3>
                <div class="field-row">
                    <div class="flex flex-col gap-1 w-80">
                        <label class="label-field req">Communication Tools</label>
                        <MultiSelect v-model="communication_tools" :options="communicationOptions" display="chip"
                            placeholder="Select tools" />
                        <Message v-if="errors.communication_tools" class="error-messsage" severity="error" size="small"
                            variant="simple">{{ errors.communication_tools }}</Message>
                    </div>
                    <div class="flex flex-col gap-1 w-80">

                        <label class="label-field req">Technical Tools</label>
                        <MultiSelect v-model="technical_tools" :options="technicalOptions" display="chip"
                            placeholder="Select tools" />
                        <Message v-if="errors.technical_tools" class="error-messsage" severity="error" size="small"
                            variant="simple">{{ errors.technical_tools }}</Message>
                    </div>
                </div>
            </div>

            <div class="flex justify-center flex-col gap-2">
                <h3 class="text-xl font-medium">Facility Access</h3>
                <div class="field-row">
                    <div class="flex flex-col gap-1 w-50">
                        <label class="label-field req">Access Level</label>
                        <Select v-model="access_level" :options="accessLevelOptions" optionLabel="label"
                            optionValue="value" placeholder="Select access level" />
                        <Message v-if="errors.access_level" class="error-messsage" severity="error" size="small"
                            variant="simple">{{ errors.access_level }}</Message>
                    </div>
                    <div class="flex flex-col gap-1 w-80">

                        <label class="label-field req">Specific Zones</label>
                        <MultiSelect v-model="specific_zones" :options="zoneOptions" display="chip"
                            placeholder="Select zones" />
                        <Message v-if="errors.specific_zones" class="error-messsage" severity="error" size="small"
                            variant="simple">{{ errors.specific_zones }}</Message>
                    </div>
                </div>
            </div>

            <div class="flex justify-center flex-col gap-4">
                <label class="label-field req">Upload Evidence</label>
                <FileUpload mode="advanced" customUpload multiple accept="image/*,application/pdf"
                    :maxFileSize="5000000" @select="onFileSelect" @remove="onFileRemove" />
                <Message v-if="errors.evidences" class="error-messsage" severity="error" size="small" variant="simple">
                    {{ errors.evidences }}</Message>
            </div>
        </form>
    </section>
</template>
