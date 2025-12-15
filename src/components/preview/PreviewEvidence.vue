<script setup>
import Panel from 'primevue/panel'
import DataView from 'primevue/dataview'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'

// const props = 
defineProps({
    files: {
        type: Array,
        default: () => [],
    },
})

const previewFile = ref(null)

const isImage = (mime) => mime?.startsWith('image/')

const fileUrl = (path) => `http://127.0.0.1:8000/storage/${path}`

const formatSize = (bytes) => {
    if (!bytes) return '-'
    const kb = bytes / 1024
    return kb > 1024
        ? (kb / 1024).toFixed(2) + ' MB'
        : kb.toFixed(1) + ' KB'
}

const openPreview = (file) => {
    previewFile.value = file
}
</script>



<template>
    <Panel header="Evidence Files" v-if="files.length" toggleable>
        <DataView :value="files">
            <template #list="{ items }">
                <ul class="m-0 list-none border border-gray-500 rounded-md p-4 flex flex-col gap-2 w-full">
                    <li v-for="(file, i) in items" :key="i"
                        class="p-2 hover:bg-gray-800 rounded transition cursor-pointer" @click="openPreview(file)">
                        <div class="flex flex-wrap p-2 items-center gap-4">
                            <!-- Thumbnail / Icon -->
                            <img v-if="isImage(file.mime)" class="w-16 h-16 object-cover shrink-0 rounded"
                                :src="fileUrl(file.path)" :alt="file.original_name" />

                            <div v-else
                                class="w-16 h-16 flex items-center justify-center bg-surface-200 dark:bg-surface-700 rounded text-xl">
                                📄
                            </div>

                            <!-- File Info -->
                            <div class="flex-1 flex flex-col gap-1">
                                <span class="font-bold text-sm">
                                    {{ file.original_name }}
                                </span>

                                <div class="flex items-center gap-2 text-xs text-muted-color">
                                    <i class="pi pi-file" />
                                    <span>{{ file.mime }}</span>
                                </div>
                            </div>

                            <!-- File Size -->
                            <span class="font-bold ml-8 text-sm">
                                {{ formatSize(file.size) }}
                            </span>
                        </div>
                    </li>
                </ul>
            </template>
        </DataView>

        <!-- PREVIEW DIALOG -->
        <Dialog v-model:visible="previewFile" modal header="Preview File" :style="{ width: '50vw' }" v-if="previewFile">
            <img v-if="isImage(previewFile.mime)" :src="fileUrl(previewFile.path)" class="w-full rounded" />

            <div v-else class="text-center">
                <p class="mb-3">{{ previewFile.original_name }}</p>
                <a :href="fileUrl(previewFile.path)" target="_blank" class="text-primary underline">
                    Open file
                </a>
            </div>
        </Dialog>
    </Panel>

</template>
