<template>
    <img
        class="software-icon"
        v-if="!fallback"
        :src="finalUrl"
        @error="fallback = true"
        alt="Software icon"
    />
    <object
        v-else
        type="image/svg+xml"
        width="100%"
        height="100%"
        :data="require('../assets/placeholder.svg')"
    ></object>
</template>
<script>
import { packageMixin } from "@/shared.js";

export default {
    name: "IconDisplay",
    props: ["src"],
    data: function() {
        var finalUrl = this.src;
        var fallback = false;
        if (this.src === undefined && this.packageList !== undefined) {
            finalUrl = this.packageList.icon;
        } else if (this.src === undefined && this.packageList === undefined) {
            finalUrl = "";
            fallback = true;
        }
        return { fallback: fallback, finalUrl: finalUrl };
    },
    mixins: [packageMixin]
};
</script>
