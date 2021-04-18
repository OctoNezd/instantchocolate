<template>
  <div class="space" id="pagination">
    <nav
      class="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <a
        class="pagination-previous"
        v-show="currentPage != 1"
        href="#pagination"
        @click="updatePage(currentPage - 1)"
        >Previous page</a
      >
      <a
        class="pagination-next"
        v-show="currentPage != totalPages"
        href="#pagination"
        @click="updatePage(currentPage + 1)"
        >Next page</a
      >
      <ul class="pagination-list">
        <li v-for="page in pages" :key="page">
          <a
            v-if="Number.isInteger(page)"
            href="#pagination"
            class="pagination-link"
            :class="{ 'is-current': page === currentPage }"
            :aria-label="`Goto page ${page}`"
            @click="updatePage(page)"
            >{{ page }}</a
          >
          <span v-else class="pagination-ellipsis">&hellip;</span>
        </li>
      </ul>
    </nav>
  </div>
</template>
<script>
export default {
  name: "Pagination",
  data: function() {
    return { pages: [], currentPage: 1 };
  },
  model: { prop: "currentPage" },

  props: ["totalPages"],
  created: function() {
    this.updatePagination();
  },
  methods: {
    updatePage: function(newPage) {
      this.$emit("input", newPage);
      this.currentPage = newPage;
      this.updatePagination();
    },
    updatePagination: function() {
      this.pages = [];
      if (this.currentPage !== 1) {
        this.pages.push(1);
        if (this.currentPage - 1 !== 1) {
          this.pages.push("backdots", this.currentPage - 1);
        }
      }
      this.pages.push(this.currentPage);
      if (this.currentPage !== this.totalPages) {
        if (this.currentPage + 1 !== this.totalPages) {
          this.pages.push(this.currentPage + 1, "nextdots");
        }
        this.pages.push(this.totalPages);
      }
    },
  },
  watch: {
    totalPages: function() {
      this.updatePagination();
    },
    currentPage: function() {
      this.updatePagination();
    },
  },
};
</script>
<style lang="scss">
.space {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
