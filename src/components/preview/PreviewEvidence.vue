<script setup>
import Panel from 'primevue/panel'
import DataView from 'primevue/dataview'

defineProps({
    files: {
        type: Array,
        default: () => [],
    },
})
</script>

<template>
    <Panel header="Evidence Files" v-if="files.length">
        <DataView :value="files">
            <template #list="{ items }">
                <ul>
                    <li v-for="(file, i) in items" :key="i">
                        {{ file.original_name }}
                    </li>
                </ul>
            </template>
        </DataView>
    </Panel>
</template>
