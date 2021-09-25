<template>
    <div>
        <b-field label="Search package">
            <b-autocomplete
                v-model="query"
                :disabled="fuse === undefined"
                placeholder="e.g. 7zip"
                :data="results"
                field="packageName"
                @select="
                    selected => {
                        $store.dispatch(
                            'setPackageModal',
                            selected.item.packageName
                        );
                    }
                "
                :icon-right="query.length > 0 ? `close-circle` : ''"
                icon-right-clickable
                @icon-right-click="query = ''"
            >
                <template slot-scope="props">
                    <div class="media is-align-items-stretch">
                        <div class="media-left">
                            <figure class="image is-125rem">
                                <IconDisplay :src="props.option.icon" />
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="subtitle is-5">
                                {{ props.option.displayName }}
                            </p>
                        </div>
                    </div>
                </template>
            </b-autocomplete>
        </b-field>
    </div>
</template>
<script>
// import SoftwareSummary from "./SoftwareSummary";
import IconDisplay from "./IconDisplay.vue";
import Fuse from "fuse.js";
import { packageMixin } from "@/shared.js";

export default {
    name: "SoftwareSearch",
    mixins: [packageMixin],
    components: {
        IconDisplay
    },
    props: ["software"],
    data: function() {
        return {
            query: "",
            results: [],
            queryInterval: undefined
        };
    },
    methods: {},
    created: function() {},
    watch: {
        query: function() {
            clearTimeout(this.queryInterval);
            this.results = [];
            if (this.query && this.query.length > 1) {
                this.queryInterval = setTimeout(() => {
                    var res = this.fuse.search(this.query).slice(0, 10);
                    res = res.sort(function(a, b) {
                        if (a.downloadCount > b.downloadCount) {
                            return 1;
                        } else if (a.downloadCount < b.downloadCount) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    res = res.map(item => item.item);
                    this.results = res;

                    this.$emit("searchComplete", {
                        results: res,
                        query: this.query
                    });
                }, 500);
            } else if (this.query.length === 0) {
                this.$emit("searchCleared");
            }
        },
        packageList: async function() {}
    },
    computed: {
        fuse() {
            const options = {
                // isCaseSensitive: false,
                // includeScore: false,
                // shouldSort: true,
                // includeMatches: false,
                // findAllMatches: false,
                minMatchCharLength: 3,
                // location: 0,
                threshold: 0.6,
                // distance: 100,
                // useExtendedSearch: false,
                // ignoreLocation: false,
                // ignoreFieldNorm: false,
                keys: ["packageName", "displayName", "summary", "tags"]
            };
            return new Fuse(Object.values(this.packageList), options);
        }
    }
};
</script>
<style scoped>
.autocomplete {
    margin-bottom: 10px;
}
.media-left figure {
    min-height: 100%;
}
.is-125rem {
    width: 1.25rem;
    height: 1.25rem;
}
</style>
