<template>
    <a @click="toggle">
        <b-icon
            :icon="state ? 'server-minus' : 'server-plus'"
            size="is-small"
        />
        <span v-if="!state">Add</span><span v-else>Remove</span>
    </a>
</template>
<script>
import { packageMixin } from "@/shared.js";

export default {
    name: "SoftwareAddButton",
    mixins: [packageMixin],
    props: ["package"],

    methods: {
        toggle: function() {
            this.$emit("toggled");

            this.$store.dispatch("toggleInstallQueueItem", this.package);
        }
    },
    computed: {
        state() {
            return this.$store.state.installQueue.includes(this.package);
        }
    }
};
</script>
