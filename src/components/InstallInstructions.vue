<template>
  <div class="modal-card" id="installguide" style="width: auto">
    <div class="overflow-on">
      <InstallQueue
        :softwareCatalog="softwareCatalog"
        :installQueue="installQueue"
        @toggleInstallInstructions="$emit('toggleInstallInstructions')"
        buttonText="Hide install instructions"
      />
      <div class="container is-fluid">
        <div class="is-flex column-mobile" id="result">
          <div id="packageslist">
            <p class="title is-4">Packages that will be installed:</p>
            <SoftwareSummary
              :software="findPackage(packageName)"
              :softwareCatalog="softwareCatalog"
              v-for="packageName in installQueue"
              :key="packageName"
              nodescription
              showToggleButton
            />
          </div>
          <div id="instructions">
            <p class="title is-4">Install instructions</p>
            <p class="subtitle is-size-4">Install manually</p>
            <div
              v-for="(installStep, index) in installSteps"
              :key="installStep.text"
              class="is-flex instructionstep"
            >
              <b-icon
                :icon="installStep.icon"
                custom-size="is-very-very-big"
                size="is-very-very-big"
                :type="installStep.iconType"
              />
              <div>
                <p class="title is-3">
                  {{ index + 1 }}. {{ installStep.title }}
                </p>
                <p class="subtitle nomargin">{{ installStep.text }}</p>
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
            <div>
              <div class="divider">OR</div>
            </div>
            <p class="is-size-4">Install using InstantChocolate script</p>
            <span class="has-text-warning-dark">
              <b-icon icon="lightbulb-on" />PROTIP:
            </span>
            ALWAYS CHECK THE SCRIPTS YOU RUN I CANT STRESS THIS ENOUGH
            <br />
            <a
              :href="installScriptUrl"
              download="instantChocolate.ps1"
              class="button is-warning"
              id="dlps1"
            >
              <b-icon icon="powershell" size="null" />
              <p>Download PowerShell script</p>
            </a>
            <br />
            Right-click on downloaded file and click "Run In PowerShell"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InstallQueue from "./InstallQueue.vue";
import SoftwareSummary from "./SoftwareSummary.vue";
import powershellinstallscript from "raw-loader!@/assets/autoscript_base.ps1";
import powershellinstallend from "raw-loader!@/assets/autoscript_end.ps1";
import { EventBus } from "@/eventBus.js";
import { findPackageMixin } from "@/shared.js";

export default {
  name: "InstallInstructions",
  props: ["softwareCatalog"],
  components: { InstallQueue, SoftwareSummary },
  mixins: [findPackageMixin],
  data: function() {
    return {
      installScriptUrl: "",
      installQueue: EventBus.$installQueue,
      installScript: "",
      installSteps: [],
    };
  },
  methods: {
    copyToClipboard: function(e) {
      e.srcElement.parentElement.parentElement.querySelector("input").select();
      document.execCommand("copy");
    },
    refreshData: function(installQueue) {
      this.installQueue = installQueue;
      if (this.installQueue.length === 0) {
        this.$emit("toggleInstallInstructions");
        return;
      }
      this.installScript =
        powershellinstallscript +
        `\nchoco install -y ${this.installQueue.join(" ")}` +
        "\n" +
        powershellinstallend;
      this.installScriptUrl = window.URL.createObjectURL(
        new Blob([this.installScript], { type: "application/octet-stream" })
      );
      this.installSteps = [
        {
          title: "Install Chocolatey",
          text:
            "Chocolatey is the package manager that makes InstantChocolate possible!",
          icon: "package-variant",
          iconType: "is-info",
          protip: "Always check scripts you run from internet!",
          command:
            "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))",
        },
        {
          title: "Install your packages",
          iconType: "is-grey-light",
          icon: "kettle-steam",
          command: `choco install ${this.installQueue.join(" ")}`,
        },
        {
          title: "Enjoy!",
          iconType: "is-chocolate",
          icon: "coffee",
        },
      ];
    },
  },
  created: function() {
    this.refreshData(EventBus.$installQueue);
    EventBus.$on(EventBus.installQueueChanged, this.refreshData);
  },
};
</script>
<style>
#result {
  margin: 10px;
  padding: 10px;
}
#instructions {
  flex-grow: 1;
}

.is-very-very-big {
  font-size: 128px;
  min-width: 128px;
  min-height: 128px;
}
.nomargin {
  margin-bottom: 0 !important;
}
.instructionstep {
  margin-bottom: 1rem;
}
#dlps1 {
  width: 100%;
}
</style>
