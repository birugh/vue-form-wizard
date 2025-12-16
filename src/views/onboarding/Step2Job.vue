<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import { Message } from 'primevue'
import { useMasterStore } from '@/stores/master.store'


const masterStore = useMasterStore();

const schema = yup.object({
  department: yup.string().required('Department is required'),
  job_title: yup.string().required('Job title is required'),
  join_date: yup.date().required('Join date is required'),
  work_arrangement: yup.string().required('Work arrangement is required'),
  device_request: yup.string().required('Device request is required'),
})

const { validate, setValues, values, errors } = useForm({
  validationSchema: schema,
  validateOnMount: false,
})

const { value: department } = useField('department')
const { value: job_title } = useField('job_title')
const { value: join_date } = useField('join_date')
const { value: work_arrangement } = useField('work_arrangement')
const { value: device_request } = useField('device_request')

const store = useOnboardingStore()

const today = new Date()

// const departmentOptions = [
//   { label: 'Information Technology', value: 'IT' },
//   { label: 'Human Resources', value: 'HR' },
//   { label: 'Finance', value: 'FIN' },
//   { label: 'Accounting', value: 'ACC' },
//   { label: 'Marketing', value: 'MKT' },
//   { label: 'Sales', value: 'SLS' },
//   { label: 'Operations', value: 'OPS' },
//   { label: 'Customer Service', value: 'CS' },
//   { label: 'Research and Development', value: 'RND' },
//   { label: 'Legal', value: 'LGL' },
//   { label: 'Procurement', value: 'PRC' },
//   { label: 'Quality Assurance', value: 'QA' },
// ]

const workArrangementOptions = [
  { label: 'Work From Office (WFO)', value: 'WFO' },
  { label: 'Work From Home (WFH)', value: 'WFH' },
  { label: 'Remote', value: 'REMOTE' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'Flexible', value: 'FLEX' },
]

const deviceOptions = [
  { label: 'MacBook', value: 'MACBOOK' },
  { label: 'Windows Laptop', value: 'WINDOWS_LAPTOP' },
  { label: 'Linux Laptop', value: 'LINUX_LAPTOP' },
  { label: 'Desktop PC', value: 'DESKTOP_PC' },
  { label: 'Tablet', value: 'TABLET' },
  { label: 'No Device Provided', value: 'NONE' },
]


onMounted(() => {
  masterStore.fetchDepartments()

  if (!store.onboarding?.job_details) return

  const draft = { ...store.onboarding.job_details }

  if (draft.join_date) {
    draft.join_date = new Date(draft.join_date)
  }

  setValues(draft)
})

defineExpose({
  async validateStep() {
    const result = await validate()
    return result.valid
  },
  getValues() {
    return values
  },
  hasValue() {
    return Object.values(values).some(
      (v) => v !== null && v !== '' && v !== undefined
    )
  },
})
</script>


<template>
  <section>
    <h2 class="text-2xl font-medium mb-4">Job Details</h2>
    <div class="h-separator"></div>

    <form class="flex justify-center flex-col gap-4">
      <div class="field-row">

        <div class="flex flex-col gap-1">
          <label class="label-field req">Department</label>
          <Select v-model="department" :options="masterStore.departments" optionLabel="name" optionValue="name"
            :disabled="masterStore.loading" placeholder="Select department" />
          <Message v-if="errors.department" class="error-messsage" severity="error" size="small" variant="simple">
            {{ errors.department }}
          </Message>
        </div>

        <div class="flex flex-col gap-1 w-100">
          <label class="label-field req">Job Title</label>
          <InputText v-model="job_title" placeholder="e.g. Mobile Developer" />
          <Message v-if="errors.job_title" class="error-messsage" severity="error" size="small" variant="simple">
            {{ errors.job_title }}
          </Message>
        </div>
      </div>

      <div class="flex flex-col gap-1 w-fit">
        <label class="label-field req">Join Date</label>
        <DatePicker v-model="join_date" dateFormat="yy-mm-dd" showIcon :maxDate="today" placeholder="Input a date" />
        <Message v-if="errors.join_date" class="error-messsage" severity="error" size="small" variant="simple">
          {{ errors.join_date }}
        </Message>
      </div>
      <div class="field-row">
        <div class="flex flex-col gap-1 w-fit">
          <label class="label-field req">Work Arrangement</label>
          <Select v-model="work_arrangement" :options="workArrangementOptions" optionLabel="label" optionValue="label"
            placeholder="Select arrangement" />
          <Message v-if="errors.work_arrangement" class="error-messsage" severity="error" size="small" variant="simple">
            {{
              errors.work_arrangement }}</Message>
        </div>

        <div class="flex flex-col gap-1 w-fit">
          <label class="label-field req">Device Request</label>
          <Select v-model="device_request" :options="deviceOptions" optionLabel="label" optionValue="label"
            placeholder="Select device" />
          <Message v-if="errors.device_request" class="error-messsage" severity="error" size="small" variant="simple">{{
            errors.device_request
          }}</Message>
        </div>
      </div>

    </form>
  </section>
</template>
