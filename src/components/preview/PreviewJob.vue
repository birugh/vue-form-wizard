<script setup>
import { computed } from 'vue'
import Panel from 'primevue/panel'
import Tag from 'primevue/tag'

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
})

const formattedDate = computed(() => {
    if (!props.data.join_date) return '-'

    const date = new Date(props.data.join_date)
    return isNaN(date)
        ? props.data.join_date
        : date.toISOString().split('T')[0]
})
</script>

<template>
    <Panel header="Job Details">
        <p><strong>Department:</strong> {{ data.department || '-' }}</p>
        <p><strong>Job Title:</strong> {{ data.job_title || '-' }}</p>

        <p><strong>Join Date:</strong> {{ formattedDate }}</p>

        <p>
            <strong>Work Arrangement:</strong>
            <Tag :value="data.work_arrangement || '-'" />
        </p>

        <p>
            <strong>Device Request:</strong>
            <Tag :value="data.device_request || '-'" severity="info" />
        </p>
    </Panel>
</template>
