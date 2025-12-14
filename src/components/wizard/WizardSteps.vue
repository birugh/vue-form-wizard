<script setup>
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import Step from 'primevue/step'

const props = defineProps({
    steps: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue', 'request-step-change'])

const onUpdateValue = (newValue) => {
    const step = props.steps.find(s => String(s.step) === newValue)
    if (!step || !step.enabled) return

    // ❗ JANGAN update modelValue di sini
    // kita minta izin dulu ke wizard
    emit('request-step-change', step)
}
</script>

<template>
    <Stepper :value="modelValue" @update:value="onUpdateValue">
        <StepList>
            <Step v-for="step in steps" :key="step.step" :value="String(step.step)" :disabled="!step.enabled">
                {{ step.label }}
            </Step>
        </StepList>
    </Stepper>
</template>
