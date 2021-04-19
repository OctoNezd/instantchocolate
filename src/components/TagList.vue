<template>
  <div>
    <p class="label">Tags</p>
    <perfect-scrollbar class="taglist scrollable-x marginbottom">
      <div
        v-for="tag of tags"
        :key="Array.isArray(tag) ? tag[0] : tag"
        @click="$emit('tagSelected', Array.isArray(tag) ? tag[0] : tag)"
      >
        <b-taglist v-if="single">
          <b-tag size="is-medium" type="is-dark">{{ tag }}</b-tag>
        </b-taglist>
        <b-taglist v-else attached>
          <b-tag
            :type="currentTagFilter === tag[0] ? 'is-chocolate' : 'is-dark'"
            size="is-large"
            >{{ tag[0] }}</b-tag
          >
          <b-tag type="is-info" size="is-large">{{ tag[1] }}</b-tag>
        </b-taglist>
      </div>
    </perfect-scrollbar>
  </div>
</template>
<script>
export default {
  name: "TagList",
  props: { tags: Array, single: Boolean, currentTagFilter: String },
};
</script>
<style>
.taglist .tags {
  flex-wrap: nowrap;
  margin-right: 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
}
</style>
