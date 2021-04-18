<template>
  <div id="app" class="">
    <b-modal :active="!loaded" :can-cancel="false">
      <Loader />
    </b-modal>
    <b-modal v-model="modalShow">
      <SoftwareInfo
        :software="modalSoftware"
        @toggled="modalShow = false"
        @tagSelected="(tag) => (currentTagFilter = tag)"
      />
    </b-modal>
    <section class="hero has-text-centered is-link">
      <div class="hero-body">
        <p class="title">
          <b-icon icon="coffee" size="is-medium" />
          InstantChocolate
        </p>
        <p class="subtitle" v-if="loaded">
          Repo definition update:
          {{ Intl.DateTimeFormat("en").format(new Date(timestamp * 1000)) }}
        </p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div v-if="software.length > 0">
          <TagList
            :tags="tags"
            :currentTagFilter="currentTagFilter"
            @tagSelected="(tag) => (currentTagFilter = tag)"
          />
          <SoftwareSearch :software="software" @showModal="showModal" />
          <div class="grid">
            <SoftwareItem
              v-for="softwareitem in Object.values(softwareDisplay).slice(
                (currentPage - 1) * 40,
                currentPage * 40
              )"
              :software="softwareitem"
              :skeleton="false"
              :key="softwareitem.packageName"
              @showModal="showModal"
            />
          </div>
          <Pagination
            :totalPages="Math.floor(software.length / 40)"
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
    <InstallQueue
      :softwarelist="software"
      @toggleInstallInstructions="showInstallModal = !showInstallModal"
      buttonText="Show install instructions!"
      pinned
    />
    <b-modal
      v-model="showInstallModal"
      :full-screen="true"
      :can-cancel="false"
      animation="fade"
      destroy-on-hide
      has-modal-card
    >
      <InstallInstructions
        @toggleInstallInstructions="showInstallModal = !showInstallModal"
        :software="software"
      />
    </b-modal>

    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <b>InstantChocolate</b> by OctoNezd<br />
          This site is not made or endorsed by Chocolatey developers.<br />
          Commit: {{ $gitcommit }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import Loader from "./components/Loader.vue";
import Pagination from "./components/Pagination.vue";
import SoftwareItem from "./components/SoftwareBlock.vue";
import SoftwareInfo from "./components/SoftwareInfo.vue";
import InstallQueue from "./components/InstallQueue.vue";
import SoftwareSearch from "./components/SoftwareSearch.vue";
import InstallInstructions from "./components/InstallInstructions.vue";
import TagList from "./components/TagList.vue";
import { EventBus } from "./eventBus.js";
import "./assets/scss/index.scss";
export default {
  name: "App",
  components: {
    Loader,
    Pagination,
    SoftwareItem,
    SoftwareInfo,
    InstallQueue,
    SoftwareSearch,
    InstallInstructions,
    TagList,
  },
  data: function() {
    return {
      showInstallModal: false,
      timestamp: 0,
      softwareDisplay: [],
      software: [],
      loaded: false,
      currentPage: 1,
      modalShow: false,
      modalSoftware: {},
      modalCache: {},
      installQueue: [],
      tags: [],
      tagsAll: [],
      currentTagFilter: "All",
    };
  },
  methods: {
    updateTagList() {
      var tags = this.software.reduce((a, b) => {
        for (const tag of b.tags) {
          if (a[tag] === undefined) {
            a[tag] = 0;
          }
          a[tag]++;
        }
        return a;
      }, {});

      this.tagsAll = Object.entries(tags).sort(([, a], [, b]) => b - a);
      this.tags = this.tagsAll.slice(0, 10);
      this.tags.unshift(["All", this.software.length]);
      console.log(this.tags);
    },
    showModal(packageName) {
      this.modalPkg = packageName;
      if (packageName in this.modalCache) {
        this.modalSoftware = this.modalCache[this.packageName];
        this.modalShow = true;
      } else {
        this.axios.get(`package_info/${packageName}.json`).then((response) => {
          this.modalSoftware = response.data;
          this.modalCache[this.packageName] = response.data;
          this.modalShow = true;
        });
      }
    },
  },
  created: function() {
    this.axios.interceptors.request.use((config) => {
      this.loaded = false;
      return config;
    });
    this.axios.interceptors.response.use((response) => {
      this.loaded = true;
      return response;
    });
    this.axios.get("package_data.json").then((response) => {
      this.timestamp = response.data.timestamp;
      this.software = response.data.software;
      this.softwareDisplay = this.software;
      this.updateTagList();
    });
    EventBus.$on("installQueueChanged", function() {
      this.installQueue = this.$installQueue;
      var title = "InstantChocolate";
      if (this.installQueue.length !== 0) {
        title += ` | ${this.installQueue.length} packages pending`;
      }
      document.title = title;
    });
  },
  watch: {
    currentTagFilter: function() {
      if (this.currentTagFilter === "All") {
        this.softwareDisplay = this.software;
      } else {
        this.softwareDisplay = this.software.filter(
          (software) => software.tags.indexOf(this.currentTagFilter) !== -1
        );
      }
      console.log(
        this.tags.find((item) => item[0] === this.currentTagFilter),
        this.currentTagFilter
      );
      if (!this.tags.find((item) => item[0] === this.currentTagFilter)) {
        console.log("current tag not in tags");
        this.tags.splice(
          1,
          0,
          this.tagsAll.find((item) => item[0] === this.currentTagFilter)
        );
      }
      console.log(this.softwareDisplay);
      console.log(Object.filter);
    },
  },
};
</script>
<style lang="scss"></style>
