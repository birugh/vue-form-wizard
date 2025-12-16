<script setup>
import Panel from 'primevue/panel'

defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <Panel header="Personal Information" toggleable>
    <div class="preview-form">
      <p>Name:
        <span>
          {{ data.name || '-' }}
        </span>
      </p>
      <p>Email:
        <span>
          {{ data.email || '-' }}
        </span>
      </p>
      <p>Phone:
        <span>
          {{ data.phone || '-' }}
        </span>
      </p>
      <p>
        Emergency Contact:
        <span>
          {{
            Array.isArray(data.emergency_contact) && data.emergency_contact.length
              ? data.emergency_contact.join(', ')
              : '-'
          }}
        </span>
      </p>
    </div>
  </Panel>
</template>
