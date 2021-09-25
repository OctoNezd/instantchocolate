<template>
    <div class="marginbottom">
        <b-modal v-model="showAboutPreset" scroll="keep">
            <div class="card">
                <div class="card-content">
                    <p class="title">{{ presetAbout }}</p>
                    <p v-html="presets[presetAbout].description" />
                    <p class="subtitle">Software included:</p>
                    <SoftwareSummary
                        :software="findPackage(packageName)"
                        v-for="packageName in presets[presetAbout].software"
                        :key="packageName"
                        nodescription
                        showToggleButton
                    />
                </div>
                <footer class="card-footer column-mobile">
                    <div href="#" class="card-footer-item">
                        <a
                            @click="
                                presetSelected(presets[presetAbout].software)
                            "
                        >
                            <b-icon
                                icon="clipboard-text-play"
                                size="is-small"
                            />Add preset
                        </a>
                    </div>
                </footer>
            </div>
        </b-modal>
        <p class="label">Presets</p>

        <perfect-scrollbar class="taglist scrollable-x" id="presets">
            <div
                class="preset"
                v-for="(preset, presetName, index) in presets"
                :key="`${presetName}-${index}`"
                @click="presetSelected(preset.software)"
            >
                <div class="is-flex is-align-items-center">
                    <p class="subtitle nomargin">{{ presetName }}</p>
                    <figure
                        class="image is-32x32"
                        v-for="software in preset.software.slice(0, 3)"
                        :key="software"
                    >
                        <IconDisplay :src="findPackage(software).icon" />
                    </figure>
                    <p>(+{{ preset.software.length - 3 }})</p>
                    <div class="flex-grow-to-right">
                        <a @click.stop="showMore(presetName)"
                            ><b-icon icon="dots-horizontal"
                        /></a>
                    </div>
                </div>
                <p v-html="preset.description" />
            </div>
        </perfect-scrollbar>
    </div>
</template>
<script>
import IconDisplay from "./IconDisplay.vue";
import SoftwareSummary from "./SoftwareSummary.vue";
import { packageMixin } from "@/shared.js";
export default {
    name: "PresetsShowcase",
    components: { IconDisplay, SoftwareSummary },
    mixins: [packageMixin],
    data: function() {
        const baseDesktop = [
            "sumatrapdf.install",
            "vlc",
            "7zip.install",
            "openjdk8jre",
            "openjdk11jre",
            "vcredist-all"
        ];
        const gaming = ["discord.install", "steam-client", ...baseDesktop];
        const developerBase = [
            "python3",
            "nodejs.install",
            "notepadplusplus.install",
            "vscode.install",
            "git.install",
            ...baseDesktop
        ];
        const sysadmin = [
            "putty.install",
            "advanced-ip-scanner",
            "filezilla",
            "nmap",
            "wireshark",
            "sysinternals",
            ...developerBase
        ];
        return {
            showAboutPreset: false,
            presetAbout: "Base Desktop",
            presets: {
                "Base Desktop": {
                    software: baseDesktop,
                    description:
                        "Base software+libraries install.<br>Just add browser and Office and it looks like a normal desktop to me.<br>"
                },
                "G*ming": {
                    software: gaming,
                    description:
                        "God save you and your family from menace known as computer games.<br>Includes Base Desktop."
                },
                "Development Base": {
                    software: developerBase,
                    description:
                        "Base developer pack, includes most popular script languages and two most cool text editors (note: in this website developer opinion)<br>" +
                        "Includes Base Desktop"
                },
                "System administrator": {
                    software: sysadmin,
                    description:
                        "Sysadmin pack. Includes some popular network administration software.<br>Includes Development Base."
                }
            }
        };
    },
    methods: {
        presetSelected: function(preset) {
            this.showAboutPreset = false;
            console.log("preset selected: " + preset);
            preset.forEach(chocoPackage =>
                this.$store.commit("appendToInstallQueue", chocoPackage)
            );
        },
        showMore: function(presetName) {
            this.showAboutPreset = true;
            this.presetAbout = presetName;
        }
    }
};
</script>
<style scoped>
.preset {
    border-radius: 6px;
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
        0 0px 0 1px rgba(10, 10, 10, 0.02);
    display: block;
    padding: 0.5em;
    cursor: pointer;
}
.preset:not(:last-child),
.preset *:not(:last-child) {
    margin-left: 0px;
    margin-right: 5px;
}
#presets {
    margin: -5px;
    margin-bottom: 5px;
    padding: 5px;
}
</style>
