<script setup>
</script>

<template>
  <section>
    <h2>Step 2 - Job Details</h2>

    <form>
      <div>
        <label>Department</label>
        <select>
          <option value="">Select Department</option>
          <option>IT</option>
          <option>HR</option>
        </select>
      </div>

      <div>
        <label>Job Title</label>
        <input type="text" />
      </div>

      <div>
        <label>Join Date</label>
        <input type="date" />
      </div>

      <div>
        <label>Work Arrangement</label>
        <select>
          <option>WFO</option>
          <option>Remote</option>
          <option>Hybrid</option>
        </select>
      </div>

      <div>
        <label>Device Request</label>
        <select>
          <option>MacBook</option>
          <option>Laptop</option>
        </select>
      </div>
    </form>
  </section>
</template>
