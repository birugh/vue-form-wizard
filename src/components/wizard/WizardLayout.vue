<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function goNext() {
  // 
}

function goBack() {
  // 
  router.back()
}

function saveDraft() {
  // 
}

function submit() {
  // 
}
</script>

<template>
  <div>
    <header>
      <h1>Employee Onboarding Wizard</h1>
    </header>

    <nav>
      <ol>
        <li>Step 1 - Personal Information</li>
        <li>Step 2 - Job Details</li>
        <li>Step 3 - Access Rights & Evidence</li>
        <li>Step 4 - Preview & Confirmation</li>
      </ol>
    </nav>

    <main>
      <router-view />
    </main>

    <footer>
      <button type="button" @click="goBack">
        Back
      </button>

      <button type="button" @click="saveDraft">
        Save Draft
      </button>

      <button type="button" @click="goNext">
        Next
      </button>

      <button type="button" @click="submit">
        Submit
      </button>
    </footer>
  </div>
</template>
