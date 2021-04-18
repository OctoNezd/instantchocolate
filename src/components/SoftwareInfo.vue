<template>
  <div class="card">
    <div class="card-content">
      <SoftwareSummary :software="software" />
      <vue-markdown :source="software.description" />
    </div>
    <footer class="card-footer">
      <div href="#" class="card-footer-item">
        <a :href="software.licenseUrl">
          <b-icon icon="license" size="is-small" />
          License
        </a>
      </div>
      <div href="#" class="card-footer-item">
        <a :href="software.galleryUrl">
          <b-icon icon="link" size="is-small" />
          Package on Chocolatey
        </a>
      </div>
      <div href="#" class="card-footer-item">
        <a :href="software.abuseUrl" class="has-text-danger">
          <b-icon icon="flag" size="is-small" />
          Report abuse
        </a>
      </div>
      <div href="#" class="card-footer-item">
        <SoftwareAddButton
          :package="software.packageName"
          @toggled="$emit('toggled')"
        />
      </div>
    </footer>
  </div>
</template>
<script>
import VueMarkdown from "vue-markdown-render";
import SoftwareSummary from "./SoftwareSummary.vue";
import SoftwareAddButton from "./SoftwareAddButton.vue";
export default {
  name: "SoftwareModal",
  components: { SoftwareSummary, SoftwareAddButton, VueMarkdown },
  props: ["software"],
};
</script>
