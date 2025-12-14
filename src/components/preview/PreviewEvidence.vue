<script setup>
defineProps({
    files: {
        type: Array,
        default: () => [],
    },
})
</script>

<template>
    <section v-if="files.length">
        <h3>Evidence Files</h3>
        <ul>
            <li v-for="(file, i) in files" :key="i">
                {{ file.original_name }}
            </li>
        </ul>
    </section>
</template>
