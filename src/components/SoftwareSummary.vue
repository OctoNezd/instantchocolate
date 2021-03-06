<template>
    <div
        class="softwaresummary"
        :class="{ 'pb-1': !(nodescription || minimalMode) }"
    >
        <div class="media" :class="{ 'mb-0': nodescription || minimalMode }">
            <div class="media-left">
                <figure class="image is-48x48">
                    <b-skeleton v-if="skeleton" width="48" height="48" />
                    <IconDisplay v-else :src="software.icon" />
                </figure>
            </div>
            <div class="media-content">
                <b-skeleton size="is-large" v-if="skeleton"></b-skeleton>
                <p
                    class="title"
                    :class="{
                        'is-4': !(nodescription || minimalMode),
                        'is-6': minimalMode
                    }"
                    v-else-if="software.displayname != ''"
                >
                    {{ software.displayName }}
                </p>
                <b-skeleton v-if="skeleton"></b-skeleton>
                <p
                    v-else
                    :class="
                        software.displayName !== ''
                            ? 'subtitle is-6'
                            : 'title is-4'
                    "
                >
                    {{ software.packageName }} (version: {{ software.version }})
                </p>
            </div>
        </div>
        <div
            class="is-flex flex-direction-row is-justify-content-space-between"
        >
            <SoftwareAddButton
                :package="software.packageName"
                v-if="showToggleButton"
            />
            <div
                class=""
                v-if="
                    !skeleton && showToggleButton && packageList && replacement
                "
            >
                <a @click="swap">
                    <b-icon
                        icon="swap-horizontal-circle-outline"
                        size="is-small"
                    />
                    Swap for {{ replacement.displayName }}
                </a>
            </div>
        </div>
        <div class="content" v-if="!(nodescription || minimalMode)">
            <b-skeleton v-if="skeleton" :count="3"></b-skeleton>
            <p v-else-if="software.summary !== ''">
                {{ software.summary }}
            </p>
        </div>
    </div>
</template>
<script>
import SoftwareAddButton from "./SoftwareAddButton.vue";
import IconDisplay from "./IconDisplay.vue";
import { packageMixin } from "@/shared.js";

export default {
    name: "SoftwareSummary",
    components: { SoftwareAddButton, IconDisplay },
    props: {
        software: Object,
        skeleton: Boolean,
        nodescription: Boolean,
        showToggleButton: Boolean,
        minimalMode: Boolean
    },
    mixins: [packageMixin],
    computed: {
        replacement() {
            return this.packageList[this.software.packageName + ".install"];
        }
    },
    methods: {
        swap: function() {
            this.$store.dispatch(
                "toggleInstallQueueItem",
                this.replacement.packageName
            );
            this.$store.dispatch(
                "toggleInstallQueueItem",
                this.software.packageName
            );
        }
    }
};
</script>
<style>
.software-icon {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
}
.softwaresummary .media {
    align-items: stretch;
}
.softwaresummary .image {
    min-height: 100%;
}
</style>
