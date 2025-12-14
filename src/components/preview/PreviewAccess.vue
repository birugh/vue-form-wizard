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
        <h3>Access Rights</h3>

        <p>Communication Tools:</p>
        <ul>
            <li v-for="(item, i) in data.communication_tools || []" :key="i">
                {{ item }}
            </li>
        </ul>

        <p>Technical Tools:</p>
        <ul>
            <li v-for="(item, i) in data.technical_tools || []" :key="i">
                {{ item }}
            </li>
        </ul>

        <p>Access Level: {{ data.access_level }}</p>

        <p>Specific Zones:</p>
        <ul>
            <li v-for="(zone, i) in data.specific_zones || []" :key="i">
                {{ zone }}
            </li>
        </ul>
    </section>
</template>
