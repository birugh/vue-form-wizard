<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const auth = useAuthStore()

const visible = defineModel('visible')

const isAdmin = computed(() => auth.user?.role === 'admin')

const go = (path) => {
    visible.value = false
    router.push(path)
}

const logout = async () => {
    visible.value = false
    await auth.logout()
    router.replace('/login')
}
</script>

<template>
    <Drawer v-model:visible="visible">
        <div class="flex flex-col h-full">

            <div class="flex-1 overflow-y-auto">
                <ul class="list-none p-2 m-0 flex flex-col gap-1">
                    <li>
                        <template v-if="isAdmin">
                            <div v-ripple v-styleclass="{
                                selector: '@next',
                                enterFromClass: 'hidden',
                                enterActiveClass: 'animate-slidedown',
                                leaveToClass: 'hidden',
                                leaveActiveClass: 'animate-slideup'
                            }" class="p-4 flex items-center justify-between cursor-pointer">
                                <span class="font-medium">Onboarding</span>
                                <i class="pi pi-chevron-down"></i>
                            </div>

                            <ul class="hidden overflow-hidden transition-all duration-300">
                                <li class="px-4">
                                    <Button text icon="pi pi-chart-bar" label="Dashboard" class="w-full justify-start!"
                                        @click="go('/onboardings')" />
                                </li>
                                <li class="px-4">
                                    <Button text icon="pi pi-plus" label="Create" class="w-full justify-start!"
                                        @click="go('/onboarding/step-1')" />
                                </li>
                            </ul>
                        </template>
                    </li>
                    <li>
                        <div v-ripple v-styleclass="{
                            selector: '@next',
                            enterFromClass: 'hidden',
                            enterActiveClass: 'animate-slidedown',
                            leaveFromClass: 'animate-slidedown',
                            leaveToClass: 'hidden',
                            leaveActiveClass: 'animate-slideup'
                        }" class="p-4 flex items-center justify-between cursor-pointer">
                            <span class="font-medium">Profile</span>
                            <i class="pi pi-chevron-down"></i>
                        </div>
                        <ul class="hidden overflow-hidden transition-all duration-300">
                            <li class="px-4">
                                <Button text icon="pi pi-user" label="My Profile" class="flex w-full justify-start!"
                                    @click="go('/onboarding/step-1')" />
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="h-separator"></div>

            <Button icon="pi pi-sign-out" label="Logout" severity="danger" text class="w-full justify-start"
                @click="logout" />
        </div>
    </Drawer>
</template>
