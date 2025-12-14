<script setup>
import Panel from 'primevue/panel'

defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>

<template>
    <Panel header="Personal Information">
        <p><strong>Name:</strong> {{ data.name || '-' }}</p>
        <p><strong>Email:</strong> {{ data.email || '-' }}</p>
        <p><strong>Phone:</strong> {{ data.phone || '-' }}</p>
        <p>
            <strong>Emergency Contact:</strong>
            {{ data.emergency_contact || '-' }}
        </p>
    </Panel>
</template>
