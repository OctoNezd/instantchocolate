<template>
    <div>
        <b-sidebar
            :open="installQueue.length > 0"
            fullheight
            :reduce="!(scriptModalOpen || installerModalOpen)"
            expand-on-hover
            :canCancel="[]"
            :overlay="false"
        >
            <div class="expanded is-justify-content-space-between">
                <div class="appList">
                    <div class="has-text-right">
                        <a
                            class="has-text-right"
                            @click="$store.commit('clearInstallQueue')"
                        >
                            <b-icon icon="inbox-remove" size="is-small" />
                            Clear package list
                        </a>
                    </div>
                    <SoftwareSummary
                        v-for="item in installQueue"
                        :key="item"
                        :software="packageList[item]"
                        nodescription
                        showToggleButton
                    />
                </div>
                <div class="download">
                    <h1 class="subtitle is-6 has-text-centered mb-3">
                        By downloading packages/running the command below you
                        agree to the package licenses
                    </h1>
                    <b-button
                        expanded
                        type="is-info mb-3"
                        @click="installerModalOpen = true"
                        icon-left="window-maximize"
                    >
                        Download installer
                    </b-button>
                    <b-button
                        expanded
                        type="is-info is-light"
                        @click="scriptModalOpen = true"
                        icon-left="script"
                    >
                        Show guide to install everything manually
                    </b-button>
                </div>
            </div>
            <div
                class="not-expanded is-inline-flex is-flex-direction-column is-align-items-center"
            >
                <span class="title is-5 queuetext tilted-text mb-0">
                    {{ installQueue.length }} package(s) queued up.
                </span>
                <p class="packagelist tilted-text is-flex-grow-1">
                    <transition-group name="fade">
                        <span
                            v-for="item in installQueue"
                            :key="item"
                            class="packagelist-item"
                        >
                            {{ packageList[item].displayName }}
                        </span>
                    </transition-group>
                </p>
                <b-icon icon="chevron-right" custom-size="mdi-36px"> </b-icon>
            </div>
        </b-sidebar>
        <b-modal
            v-model="installerModalOpen"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Example Modal"
            aria-modal
        >
            <InstallerModal
                v-if="installerModalOpen"
                @close="installerModalOpen = false"
            />
        </b-modal>
        <b-modal
            v-model="scriptModalOpen"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Example Modal"
            aria-modal
        >
            <ScriptModal @close="scriptModalOpen = false" />
        </b-modal>
    </div>
</template>

<script>
import { packageMixin } from "@/shared.js";
import SoftwareSummary from "./SoftwareSummary.vue";
import ScriptModal from "./ScriptModal.vue";
import InstallerModal from "./InstallerModal.vue";

export default {
    mixins: [packageMixin],
    data: function() {
        return { scriptModalOpen: false, installerModalOpen: false };
    },
    components: { SoftwareSummary, ScriptModal, InstallerModal }
};
</script>

<style lang="scss">
.appList {
    // min-height: 100%;
    overflow-y: scroll;
}
.download {
    border-top: 1px solid var(--border-color);
    background-color: var(--bglight);
    z-index: 99;
    bottom: 0;
    left: 0;
}
.expanded {
    min-height: 100%;
    display: flex;
    flex-direction: column;
}
.expanded > * {
    padding: 10px;
}
.queuetext {
    white-space: nowrap;
}
.packagelist {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.packagelist-item:not(:last-child)::after {
    content: ",";
}
.sidebar-content {
    background-color: var(--background) !important;
    color: var(--text) !important;
}
.not-expanded {
    // display: none;
    margin: 10px;
    padding: 0 !important;
    gap: 5px;
    height: calc(
        100% - 20px
    ); // a hack i guess? i fucking hate counter strike source
}
.sidebar-content {
    overflow: hidden !important;
}
.tilted-text {
    writing-mode: vertical-rl;
}
.b-sidebar {
    .sidebar-content {
        &.is-mini {
            &:not(.is-mini-expand),
            &.is-mini-expand:not(:hover):not(.is-mini-delayed) {
                .expanded {
                    display: none;
                }
                .not-expanded {
                    display: inline-flex;
                }

                width: 3em !important;
                max-width: 3em !important;
            }
        }
    }
}
.b-sidebar {
    // transition: width 1s;
}
.b-sidebar .sidebar-content {
    width: 40% !important;
    max-width: 40%;
}
</style>
