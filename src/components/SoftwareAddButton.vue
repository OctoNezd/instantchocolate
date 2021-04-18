<template>
  <a @click="toggle">
    <b-icon :icon="state ? 'server-minus' : 'server-plus'" size="is-small" />
    <span v-if="!state">Add</span><span v-else>Remove</span>
  </a>
</template>
<script>
import { EventBus } from "@/eventBus.js";
export default {
  name: "SoftwareAddButton",
  props: ["package"],
  data: function() {
    return { state: false };
  },
  created: function() {
    EventBus.$on("installQueueChanged", this.updateState);
    this.updateState();
  },
  methods: {
    updateState: function() {
      this.state = this.$installQueue.indexOf(this.package) !== -1;
    },
    toggle: function() {
      var index = this.$installQueue.indexOf(this.package);
      if (index !== -1) {
        this.$installQueue.splice(index, 1);
      } else {
        this.$installQueue.push(this.package);
      }
      EventBus.$emit("installQueueChanged");
      this.$emit("toggled");
    },
  },
};
</script>
