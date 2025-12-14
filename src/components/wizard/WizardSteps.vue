<script setup>
const props = defineProps({
    steps: {
        type: Array,
        required: true,
    },
})
</script>

<template>
    <nav class="wizard-steps">
        <ol>
            <li v-for="s in steps" :key="s.step">
                <router-link v-if="s.enabled" :to="s.path">
                    Step {{ s.step }} - {{ s.label }}
                </router-link>

                <span v-else class="disabled">
                    Step {{ s.step }} - {{ s.label }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<style scoped>
.wizard-steps ol {
    display: flex;
    gap: 16px;
    list-style: none;
    padding: 0;
}

.disabled {
    color: #aaa;
    cursor: not-allowed;
}
</style>
