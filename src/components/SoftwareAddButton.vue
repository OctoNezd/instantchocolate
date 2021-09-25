<template>
    <a @click="toggle">
        <b-icon
            :icon="state ? 'server-minus' : 'server-plus'"
            :size="minimalMode ? 'is-medium' : 'is-small'"
        />
        <span v-if="!minimalMode">
            <span v-if="!state">Add</span><span v-else>Remove</span>
        </span>
    </a>
</template>
<script>
import { packageMixin } from "@/shared.js";

export default {
    name: "SoftwareAddButton",
    mixins: [packageMixin],
    props: { package: String, minimalMode: Boolean },

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
