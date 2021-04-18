<template>
  <!-- <div class="column is-one-quarter"> -->
  <div class="card software">
    <div class="card-content">
      <SoftwareSummary :software="software" :skeleton="skeleton" />
    </div>

    <footer class="card-footer">
      <div href="#" class="card-footer-item">
        <b-skeleton v-if="skeleton" size="is-large" />
        <a v-else @click="$emit('showModal', software.packageName)">
          <b-icon icon="information" size="is-small" />
          More info
        </a>
      </div>
      <div href="#" class="card-footer-item">
        <b-skeleton v-if="skeleton" size="is-large" />
        <SoftwareAddButton v-else :package="software.packageName" />
      </div>
    </footer>
  </div>
</template>

<script>
import SoftwareSummary from "./SoftwareSummary.vue";
import SoftwareAddButton from "./SoftwareAddButton.vue";
export default {
  name: "SoftwareItem",
  components: { SoftwareSummary, SoftwareAddButton },
  props: ["software", "skeleton"],
};
</script>

<style scoped>
.software .card-content {
  flex-grow: 1;
}
.software {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
</style>
