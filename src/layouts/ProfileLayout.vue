<script setup>
import { ref } from 'vue'
import NavigationBar from '@/components/navigation/navigation-bar.vue';
import Sidebar from '@/components/navigation/side-bar.vue';
const sidebarVisible = ref(false)
</script>

<template>
    <header>
        <navigation-bar @toggle-sidebar="sidebarVisible = true" />
    </header>
    <main class="my-12">
        <div class="container">
            <router-view />
        </div>
    </main>
    <sidebar v-model:visible="sidebarVisible" />
</template>
