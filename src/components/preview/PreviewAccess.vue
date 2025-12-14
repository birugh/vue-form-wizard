<script setup>
import Panel from 'primevue/panel'
import Chip from 'primevue/chip'

defineProps({
    data: {
        type: Object,
        required: true,
    },
})
</script>

<template>
    <Panel header="Access Rights">
        <div>
            <p><strong>Communication Tools</strong></p>
            <div v-if="data.communication_tools?.length">
                <Chip v-for="(item, i) in data.communication_tools" :key="i" :label="item" class="mr-2 mb-2" />
            </div>
            <p v-else>-</p>
        </div>

        <div>
            <p><strong>Technical Tools</strong></p>
            <div v-if="data.technical_tools?.length">
                <Chip v-for="(item, i) in data.technical_tools" :key="i" :label="item" class="mr-2 mb-2" />
            </div>
            <p v-else>-</p>
        </div>

        <div>
            <p><strong>Access Level</strong></p>
            <p>{{ data.access_level || '-' }}</p>
        </div>

        <div>
            <p><strong>Specific Zones</strong></p>
            <div v-if="data.specific_zones?.length">
                <Chip v-for="(zone, i) in data.specific_zones" :key="i" :label="zone" class="mr-2 mb-2" />
            </div>
            <p v-else>-</p>
        </div>
    </Panel>
</template>
