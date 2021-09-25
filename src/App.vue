<template>
    <div id="app">
        <Loader />

        <InstallSideBar />
        <b-modal v-model="modalShow">
            <SoftwareInfo
                :software="modalSoftware"
                @toggled="modalShow = false"
                @tagSelected="tag => (currentTagFilter = tag)"
            />
        </b-modal>
        <section class="hero has-text-centered is-link">
            <div class="hero-body">
                <p class="title">
                    <b-icon icon="coffee" size="is-medium" />
                    InstantChocolate
                </p>
                <p class="subtitle" v-if="timestamp">
                    Repo definition update:
                    {{
                        Intl.DateTimeFormat("en").format(
                            new Date(timestamp * 1000)
                        )
                    }}
                </p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div v-if="Object.keys(packageList).length > 0">
                    <TagList
                        :tags="tags"
                        :currentTagFilter="currentTagFilter"
                        @tagSelected="tag => (currentTagFilter = tag)"
                    />
                    <SoftwareSearch @showModal="showModal" />
                    <Presets />
                    <div class="grid">
                        <SoftwareItem
                            v-for="softwareitem in Object.values(
                                packageListDisplay
                            ).slice((currentPage - 1) * 40, currentPage * 40)"
                            :software="softwareitem"
                            :skeleton="false"
                            :key="softwareitem.packageName"
                            @showModal="showModal"
                        />
                    </div>
                    <Pagination
                        :totalPages="
                            Math.floor(Object.keys(packageList).length / 40)
                        "
                        v-model="currentPage"
                    />
                </div>
                <div v-else>
                    <div class="grid">
                        <SoftwareItem
                            v-for="i of Array(40).keys()"
                            :key="i"
                            :skeleton="true"
                        />
                    </div>
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="content has-text-centered">
                <b>InstantChocolate</b> by OctoNezd<br />
                This site is not made or endorsed by Chocolatey developers.<br />
                Version: {{ $gitcommit }}
                <br />
                <div
                    class=" is-flex is-align-items-center is-justify-content-center"
                    style="min-height: 3em"
                >
                    <b-icon icon="github" />

                    <ul class="github">
                        <li></li>
                        <li>
                            <a
                                href="https://github.com/octonezd/instantchocolate"
                                target="_blank"
                                >website</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://github.com/octonezd/instantchocolate.apigen"
                                target="_blank"
                                >chocolatey scraper</a
                            >
                        </li>
                        <li>
                            <a
                                href="https://github.com/octonezd/instantchocolate.installer"
                                target="_blank"
                                >installer</a
                            >
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
import Loader from "./components/Loader.vue";
import Pagination from "./components/Pagination.vue";
import SoftwareItem from "./components/SoftwareBlock.vue";
import SoftwareInfo from "./components/SoftwareInfo.vue";
import SoftwareSearch from "./components/SoftwareSearch.vue";
import TagList from "./components/TagList.vue";
import Presets from "./components/Presets.vue";
import InstallSideBar from "./components/InstallSideBar.vue";
import { packageMixin } from "@/shared.js";

import "./assets/scss/index.scss";
export default {
    name: "App",
    components: {
        Loader,
        Pagination,
        SoftwareItem,
        SoftwareInfo,
        SoftwareSearch,
        TagList,
        Presets,
        InstallSideBar
    },
    data: function() {
        return {
            showInstallModal: false,
            currentPage: 1,
            modalShow: false,
            modalSoftware: {},
            modalCache: {},
            tags: [],
            tagsAll: [],
            currentTagFilter: "All",
            packageListDisplay: {}
        };
    },
    methods: {
        updateTagList() {
            var tags = Object.values(this.packageList).reduce((a, b) => {
                for (const tag of b.tags) {
                    if (a[tag] === undefined) {
                        a[tag] = 0;
                    }
                    a[tag]++;
                }
                return a;
            }, {});

            this.tagsAll = Object.entries(tags).sort(([, a], [, b]) => b - a);
            this.tags = this.tagsAll.slice(0, 100);
            this.tags.unshift(["All", Object.values(this.packageList).length]);
        },
        showModal(packageName) {
            this.modalPkg = packageName;
            if (packageName in this.modalCache) {
                this.modalSoftware = this.modalCache[this.packageName];
                this.modalShow = true;
            } else {
                this.axios
                    .get(`package_info/${packageName}.json`)
                    .then(response => {
                        this.modalSoftware = response.data;
                        this.modalCache[this.packageName] = response.data;
                        this.modalShow = true;
                    });
            }
        },
        updateQueue(installQueue) {
            this.installQueue = installQueue;
            var title = "InstantChocolate";
            if (this.installQueue.length !== 0) {
                title += ` | ${installQueue.length} packages pending`;
            }
            document.title = title;

            history.pushState(
                installQueue,
                title,
                `/?p=${installQueue.join("+")}`
            );
        },
        updateDisplayPackageList() {
            if (this.currentTagFilter === "All") {
                this.packageListDisplay = this.packageList;
            } else {
                this.packageListDisplay = Object.filter(
                    this.packageList,
                    software =>
                        software.tags.indexOf(this.currentTagFilter) !== -1
                );
            }
            if (!this.tags.find(item => item[0] === this.currentTagFilter)) {
                this.tags.splice(
                    1,
                    0,
                    this.tagsAll.find(item => item[0] === this.currentTagFilter)
                );
            }
        }
    },
    created: function() {
        console.log("created", this.packageList);
    },
    watch: {
        packageList: function() {
            this.updateTagList();
            this.updateDisplayPackageList();
        },
        currentTagFilter: function() {
            this.updateDisplayPackageList();
        },
        installQueue: function() {
            var title = "InstantChocolate";
            if (this.installQueue.length !== 0) {
                title += ` | ${this.installQueue.length} packages pending`;
            }
            document.title = title;
            history.pushState(
                this.installQueue,
                title,
                `/?p=${this.installQueue.join("+")}`
            );
        }
    },
    computed: {
        timestamp() {
            return this.$store.state.packageList.timestamp;
        }
    },
    mixins: [packageMixin]
};
</script>
<style lang="css">
ul.github::before {
    margin-left: 4px;
    content: "";
}
ul.github,
ul.github > li {
    list-style: none;
    margin: 0;
    padding: 0;
}
ul.github > li {
    display: inline;
    white-space: nowrap;
}

ul.github > li::after {
    content: " • ";
    margin-left: 4px;
    margin-right: 4px;
}
ul.github > li:last-child::after {
    content: none;
}
</style>
