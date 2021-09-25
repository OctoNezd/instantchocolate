<template>
    <div id="app">
        <Loader />

        <InstallSideBar />
        <b-modal v-model="packageModalVisible">
            <SoftwareInfo
                :software="packageModalData"
                @toggled="$store.commit('clearPackageModal')"
                @tagSelected="
                    tag => {
                        currentTagFilter = [tag];
                        $store.commit('clearPackageModal');
                    }
                "
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
            <div class="container is-fluid">
                <div class="columns">
                    <div id="mainContent" class="column is-10">
                        <div v-if="Object.keys(packageList).length > 0">
                            <Presets
                                v-if="
                                    currentTagFilter.length === 0 &&
                                        !searchActive
                                "
                            />
                            <div
                                v-if="
                                    currentTagFilter.length > 0 || searchActive
                                "
                                class="mb-3 is-flex is-flex-direction-row is-flex-wrap"
                                style="gap: 3px"
                            >
                                <b-taglist>
                                    <b-tag
                                        v-if="searchActive"
                                        type="is-chocolate"
                                        closable
                                        aria-close-label="Close tag"
                                        @close="searchActive = false"
                                        size="is-medium"
                                    >
                                        Search: {{ searchQuery }}
                                    </b-tag>
                                    <b-tag
                                        v-for="tag in currentTagFilter"
                                        :key="tag"
                                        type="is-chocolate"
                                        closable
                                        aria-close-label="Close tag"
                                        @close="
                                            currentTagFilter.splice(
                                                currentTagFilter.indexOf(tag),
                                                1
                                            )
                                        "
                                        size="is-medium"
                                    >
                                        {{ tag }}
                                    </b-tag>
                                </b-taglist>
                            </div>
                            <PackageList
                                :displayList="packageListDisplay"
                                :viewType="selectedViewType"
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
                    <div id="sidePanel" class="column">
                        <b-field label="View mode" class="mb-1">
                            <a @click="selectedViewType = 'grid'"
                                ><b-icon
                                    size="is-medium"
                                    icon="view-column"
                                    :type="
                                        selectedViewType === 'grid'
                                            ? 'is-info'
                                            : ''
                                    "
                            /></a>
                            <a @click="selectedViewType = 'gridlist'"
                                ><b-icon
                                    size="is-medium"
                                    icon="view-list"
                                    :type="
                                        selectedViewType === 'gridlist'
                                            ? 'is-info'
                                            : ''
                                    "
                            /></a>
                        </b-field>
                        <SoftwareSearch
                            @searchComplete="
                                data => {
                                    searchActive = true;
                                    searchResults = data.results;
                                    searchQuery = data.query;
                                }
                            "
                            @searchCleared="searchActive = false"
                        />
                        <TagList
                            :tags="tags"
                            :currentTagFilter="currentTagFilter"
                            @tagSelected="
                                tag => {
                                    currentTagFilter.includes(tag)
                                        ? currentTagFilter.splice(
                                              currentTagFilter.indexOf(tag),
                                              1
                                          )
                                        : currentTagFilter.push(tag);
                                }
                            "
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
import SoftwareItem from "./components/SoftwareBlock.vue";
import PackageList from "./components/PackageList.vue";
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
        PackageList,
        Loader,
        SoftwareItem,
        SoftwareInfo,
        SoftwareSearch,
        TagList,
        Presets,
        InstallSideBar
    },
    data: function() {
        return {
            searchActive: false,
            showInstallModal: false,
            tags: [],
            tagsAll: [],
            currentTagFilter: [],
            searchResults: [],
            searchQuery: "",
            selectedViewType: "grid"
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
        }
    },
    created: function() {
        console.log("created", this.packageList);
    },
    watch: {
        packageList: function() {
            this.updateTagList();
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
        packageListDisplay: function() {
            const currentPackageList = this.searchActive
                ? this.searchResults
                : this.packageList;
            if (this.currentTagFilter.length === 0) {
                return Object.values(currentPackageList);
            } else {
                return Object.values(currentPackageList).filter(software =>
                    this.currentTagFilter.every(r => software.tags.includes(r))
                );
            }
        },
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
