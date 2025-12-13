<script setup>
</script>

<template>
  <section>
    <h2>Step 3 - Access Rights & Evidence</h2>

    <form>
      <fieldset>
        <legend>System Access</legend>

        <label>
          <input type="checkbox" />
          Communication Tools
        </label>

        <label>
          <input type="checkbox" />
          Technical Tools
        </label>
      </fieldset>

      <fieldset>
        <legend>Door & Facility Access</legend>

        <div>
          <label>Access Level</label>
          <select>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label>Specific Zones</label>
          <select multiple>
            <option>Office</option>
            <option>Server Room</option>
            <option>Warehouse</option>
          </select>
        </div>
      </fieldset>

      <div>
        <label>Upload Evidence</label>
        <input type="file" multiple />
      </div>
    </form>
  </section>
</template>
