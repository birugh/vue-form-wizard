<script setup>
import { onMounted } from 'vue'
import { useForm, useField, useFieldArray } from 'vee-validate'
import * as yup from 'yup'
import { useOnboardingStore } from '@/stores/onboarding.store'

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'


const schema = yup.object({
  name: yup.string().required('Name is required'),

  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),

  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^08[0-9]{8,15}$/, 'Invalid phone number'),

  emergency_contacts: yup
    .array()
    .of(
      yup
        .string()
        .required('Emergency contact is required')
        .matches(/^08[0-9]{8,15}$/, 'Invalid phone number')
    )
    .min(1, 'At least 1 emergency contact is required')
    .test(
      'unique',
      'Emergency contacts must be unique',
      value => {
        if (!value) return true
        return new Set(value).size === value.length
      }
    )
    .test(
      'not-same-as-phone',
      'Emergency contact cannot be the same as phone number',
      function (value = []) {
        return !value.includes(this.parent.phone)
      }
    ),
})


const {
  validate,
  setValues,
  values,
  errors,
} = useForm({
  validationSchema: schema,
  initialValues: {
    emergency_contacts: [''],
  },
})


const { value: name } = useField('name')
const { value: email } = useField('email')
const { value: phone } = useField('phone')

const { fields, push, remove, replace } = useFieldArray('emergency_contacts')


const store = useOnboardingStore()

const buildPayload = () => {
  const formData = new FormData()

  formData.append('name', values.name)
  formData.append('email', values.email)
  formData.append('phone', values.phone)

  values.emergency_contacts
    .filter(v => v && v.trim() !== '')
    .forEach(v => {
      formData.append('emergency_contact[]', v)
    })

  return formData
}

const buildDraftPayload = () => {
  return {
    name: values.name,
    email: values.email,
    phone: values.phone,
    emergency_contact: values.emergency_contacts.filter(
      v => v && v.trim() !== ''
    ),
  }
}


onMounted(() => {
  const data = store.onboarding?.personal_information
  if (!data) return

  const contacts = Array.isArray(data.emergency_contact)
    ? data.emergency_contact
    : ['']

  setValues({
    name: data.name,
    email: data.email,
    phone: data.phone,
    emergency_contacts: [],
  })

  replace(contacts.length ? contacts : [''])
})


defineExpose({
  async validateStep() {
    const result = await validate()
    return result.valid
  },
  // getValues() {
  //   return values
  // },
  getPayload() {
    return buildPayload()
  },
  getDraftPayload() {
    return buildDraftPayload()
  },
  hasValue() {
    return Object.values(values).some(
      v => Array.isArray(v)
        ? v.some(i => i && i !== '')
        : v !== null && v !== '' && v !== undefined
    )
  },
})

</script>


<template>
  <h2 class="text-2xl font-medium mb-4">Personal Information</h2>
  <div class="h-separator"></div>

  <form class="flex flex-col gap-4">

    <div class="field-row">
      <div class="flex flex-col gap-1 w-100">
        <label class="label-field req">Name</label>
        <InputText v-model="name" placeholder="e.g. Biru Kheza Maharley" />
        <Message v-if="errors.name" severity="error" size="small" variant="simple">
          {{ errors.name }}
        </Message>
      </div>

      <div class="flex flex-col gap-1 w-100">
        <label class="label-field req">Email</label>
        <InputText v-model="email" type="email" placeholder="e.g. example@gmail.com" />
        <Message v-if="errors.email" severity="error" size="small" variant="simple">
          {{ errors.email }}
        </Message>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label class="label-field req">Phone Number</label>
      <InputText v-model="phone" placeholder="08XXXXXXXXXX" />
      <Message v-if="errors.phone" severity="error" size="small" variant="simple">
        {{ errors.phone }}
      </Message>
    </div>

    <div class="flex flex-col gap-2">
      <label class="label-field req">Emergency Contacts</label>

      <div v-for="(field, index) in fields" :key="field.key" class="flex items-center gap-2">
        <InputText v-model="field.value" placeholder="08XXXXXXXXXX" class="flex-1" />

        <Button icon="pi pi-trash" severity="danger" text v-if="fields.length > 1" @click="remove(index)" />
      </div>

      <Message v-if="errors.emergency_contacts" severity="error" size="small" variant="simple">
        {{ errors.emergency_contacts }}
      </Message>

      <Button icon="pi pi-plus" label="Add Emergency Contact" text @click="push('')" />
    </div>
  </form>
</template>
