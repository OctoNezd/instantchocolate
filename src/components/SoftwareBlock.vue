<template>
    <!-- <div class="column is-one-quarter"> -->
    <div class="card software">
        <div
            class="card-content"
            :class="{
                'is-flex is-justify-content-space-between is-align-items-center p-0': minimalMode
            }"
        >
            <SoftwareSummary
                :software="software"
                :skeleton="skeleton"
                :minimalMode="minimalMode"
                :class="{ 'p-2': minimalMode }"
            />
            <div class="minModeButtons" v-if="minimalMode">
                <SoftwareAddButton
                    :package="software.packageName"
                    :minimalMode="minimalMode"
                    style="min-height: 36px"
                />
                <p class="sep" />

                <a
                    @click="
                        $store.dispatch('setPackageModal', software.packageName)
                    "
                >
                    <b-icon icon="information-variant" size="is-medium" />
                </a>
            </div>
        </div>

        <footer class="card-footer" v-if="!minimalMode">
            <div href="#" class="card-footer-item">
                <b-skeleton v-if="skeleton" size="is-large" />
                <a
                    v-else
                    @click="
                        $store.dispatch('setPackageModal', software.packageName)
                    "
                >
                    <b-icon icon="information-variant" size="is-small" />
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
    props: { software: Object, skeleton: Boolean, minimalMode: Boolean }
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
.minModeButtons {
    border-left: 1px solid var(--border-color);
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-content: stretch;
    flex-direction: column;
}
.minModeButtons > *:not(.sep) {
    padding: 3px;
}
.sep {
    border-bottom: 1px solid var(--border-color);
}
</style>
