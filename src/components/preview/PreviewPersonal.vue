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
    <h3>Personal Information</h3>
    <p>Name: {{ data.name }}</p>
    <p>Email: {{ data.email }}</p>
    <p>Phone: {{ data.phone }}</p>
    <p>Emergency Contact: {{ data.emergency_contact }}</p>
  </section>
</template>
