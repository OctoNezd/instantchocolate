<template>
    <Modal title="Manual install" @close="$emit('close')">
        <div
            v-for="(installStep, index) in installSteps"
            :key="installStep.text"
            class="is-flex instructionstep"
        >
            <b-icon
                :icon="installStep.icon"
                size="is-large"
                :type="installStep.iconType"
            />
            <div>
                <p class="title is-3">
                    {{ index + 1 }}. {{ installStep.title }}
                </p>
                <p class="subtitle mb-0">{{ installStep.text }}</p>
                <span class="subtitle" v-if="installStep.protip">
                    <span class="has-text-warning-dark">
                        <b-icon icon="lightbulb-on" />PROTIP:
                    </span>
                    {{ installStep.protip }}
                </span>
                <b-input
                    v-if="installStep.command"
                    icon-right="clipboard"
                    icon-right-clickable
                    @icon-right-click="copyToClipboard"
                    :value="installStep.command"
                    readonly
                />
            </div>
        </div>
    </Modal>
</template>

<script>
import { packageMixin } from "@/shared.js";
import Modal from "./Modal.vue";
export default {
    mixins: [packageMixin],
    components: { Modal },
    methods: {
        copyToClipboard: function(e) {
            e.srcElement.parentElement.parentElement
                .querySelector("input")
                .select();
            document.execCommand("copy");
        }
    },
    computed: {
        installSteps() {
            return [
                {
                    title: "Install Chocolatey",
                    text:
                        "Chocolatey is the package manager that makes InstantChocolate possible!",
                    icon: "package-variant",
                    iconType: "is-info",
                    protip: "Always check scripts you run from internet!",
                    command:
                        "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
                },
                {
                    title: "Install your packages",
                    iconType: "is-grey-light",
                    icon: "kettle-steam",
                    command: `choco install ${this.installQueue.join(" ")}`
                },
                {
                    title: "Enjoy!",
                    iconType: "is-chocolate",
                    icon: "coffee"
                }
            ];
        }
    }
};
</script>

<style></style>
