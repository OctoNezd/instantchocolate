<template>
    <div>
        <Modal
            :title="
                inProgress ? 'Please wait, generating .exe...' : 'Thank you!'
            "
            @close="$emit('close')"
        >
            <div v-if="!inProgress">
                <h1 class="title">Download should start now!</h1>
                <h2 class="subtitle mb-3">
                    If it didn't start, try this button
                </h2>
                <b-button
                    tag="a"
                    :href="installerUrl"
                    :download="fileName"
                    expanded
                    type="is-dark mb-3"
                >
                    Start download
                </b-button>
                <div class="is-flex is-align-items-center" style="gap: 1em;">
                    <b-icon size="is-large" icon="emoticon-sad" />

                    <p>
                        Note that some antivirus software gets sad and starts
                        complaining about installer. That's because installer is
                        powered by PS2EXE and some skids who can only program in
                        high-level languages decided to write malware with
                        it.<br />
                        If your AV triggers on this, submit the resulting
                        executable to your AV company for false positive.
                    </p>
                </div>
            </div>
            <details :open="inProgress">
                <summary>Log</summary>
                <pre>{{ log }}</pre>
            </details>
        </Modal>
    </div>
</template>

<script>
import Modal from "./Modal.vue";
import axios from "axios";
import { packageMixin } from "@/shared.js";

export default {
    mixins: [packageMixin],
    components: { Modal },
    data: function() {
        return {
            inProgress: true,
            fileName: "",
            log: "",
            installerUrl: ""
        };
    },
    created: function() {
        this.log += `Downloading installer...`;
        axios
            .get("/installerBase.exe", {
                responseType: "arraybuffer"
            })
            .then(installerBase => {
                this.log += `\nDownloaded installer.`;
                this.log += `\nGenerating json for installer...`;
                var installerData = [];
                this.installQueue.forEach(element => {
                    installerData.push(this.packageList[element]);
                });
                console.log("iq:", this.installQueue);
                const installerJson = JSON.stringify(installerData);
                this.log += "\nJSON:" + installerJson;
                this.installerUrl = window.URL.createObjectURL(
                    new Blob([
                        installerBase.data,
                        "INSTANTCHOCOLATE",
                        installerJson
                    ])
                );
                this.inProgress = false;
                this.fileName = `InstantChocolate-${this.installQueue
                    .slice(0, 5)
                    .join("-")}`;
                if (this.installQueue.length > 5) {
                    this.fileName =
                        this.fileName + `-${this.installQueue.length - 5}-more`;
                }
                // this.fileName = "test.exe";
                this.fileName = this.fileName + ".exe";
            });
    }
};
</script>

<style></style>
