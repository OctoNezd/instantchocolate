<template>
  <div>
    <b-field label="Search package">
      <b-autocomplete
        v-model="query"
        placeholder="e.g. 7zip"
        :data="results"
        field="packageName"
        @select="
          (selected) => {
            $emit('showModal', selected.item.packageName);
          }
        "
      >
        <template slot-scope="props">
          <div class="media is-align-items-stretch">
            <div class="media-left">
              <figure class="image is-48x48">
                <IconDisplay :src="props.option.item.icon" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">
                {{ props.option.item.displayName }}
              </p>
              <p
                :class="
                  props.option.item.displayName !== ''
                    ? 'subtitle is-6'
                    : 'title is-4'
                "
              >
                {{ props.option.item.packageName }}
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

export default {
  name: "SoftwareSearch",
  components: {
    IconDisplay,
  },
  props: ["software"],
  data: function() {
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
      keys: ["summary", "packageName", "displayName"],
    };
    const index = Fuse.createIndex(options.keys, this.software);
    const fuse = new Fuse(this.software, options, index);
    return {
      query: "",
      opts: { keys: ["summary", "packageName", "displayName"] },
      results: [],
      fuse: fuse,
    };
  },
  methods: {},
  watch: {
    query: function() {
      if (this.query && this.query.length > 1) {
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
        this.results = res;
      } else {
        this.results = [];
      }
    },
  },
};
</script>
<style scoped>
.autocomplete {
  margin-bottom: 10px;
}
.media-left figure {
  min-height: 100%;
}
</style>
