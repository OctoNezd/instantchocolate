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
    EventBus.$on(EventBus.installQueueChanged, this.updateState);
    this.updateState(EventBus.$installQueue);
  },
  methods: {
    updateState: function(installQueue) {
      this.state = installQueue.indexOf(this.package) !== -1;
    },
    toggle: function() {
      var index = EventBus.$installQueue.indexOf(this.package);
      if (index !== -1) {
        EventBus.$installQueue.splice(index, 1);
      } else {
        EventBus.$installQueue.push(this.package);
      }
      EventBus.$emit(EventBus.installQueueChanged, EventBus.$installQueue);
      this.$emit("toggled");
    },
  },
};
</script>
