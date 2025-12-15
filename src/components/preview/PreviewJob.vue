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
    <Panel header="Job Details" toggleable>
        <div class="preview-form">

            <p>Department:
                <span>
                    {{ data.department || '-' }}
                </span>
            </p>
            <p>Job Title:
                <span>
                    {{ data.job_title || '-' }}
                </span>
            </p>

            <p>Join Date:
                <span>
                    {{ formattedDate }}
                </span>
            </p>

            <p>
                Work Arrangement:
                <Tag :value="data.work_arrangement || '-'" />
            </p>

            <p>
                Device Request:
                <Tag :value="data.device_request || '-'" severity="info" />
            </p>
        </div>
    </Panel>
</template>
