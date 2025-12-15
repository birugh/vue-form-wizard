<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

const router = useRouter()

defineEmits(['toggle-sidebar'])

const items = ref([])

const goToProfile = () => {
    router.push('/profile')
}
</script>

<template>
    <Menubar :model="items">
        <template #start>
            <Button icon="pi pi-bars" text @click="$emit('toggle-sidebar')" />
        </template>

        <template #end>
            <Avatar icon="pi pi-user" shape="circle" class="cursor-pointer" @click="goToProfile" />
        </template>
    </Menubar>
</template>
