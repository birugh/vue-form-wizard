<script setup>
defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>

<template>
    <section>
        <h3>Job Details</h3>
        <p>Department: {{ data.department }}</p>
        <p>Job Title: {{ data.job_title }}</p>
        <p>Join Date: {{ data.join_date }}</p>
        <p>Work Arrangement: {{ data.work_arrangement }}</p>
        <p>Device Request: {{ data.device_request }}</p>
    </section>
</template>
