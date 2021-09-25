<template>
    <div>
        <p class="label">Tags</p>
        <b-taglist class="packageTaglist">
            <div
                v-for="tag of tags"
                :key="Array.isArray(tag) ? tag[0] : tag"
                @click="$emit('tagSelected', Array.isArray(tag) ? tag[0] : tag)"
            >
                <b-taglist :attached="!single" v-if="tag !== undefined">
                    <b-tag
                        :type="
                            currentTagFilter !== undefined &&
                            currentTagFilter.includes(tag[0])
                                ? 'is-chocolate'
                                : 'is-dark'
                        "
                        size="is-small"
                    >
                        {{ typeof tag === "string" ? tag : tag[0] }}
                    </b-tag>
                    <b-tag
                        v-if="tag[1] !== undefined && !single"
                        type="is-info"
                        size="is-small"
                        >{{ tag[1] }}</b-tag
                    >
                </b-taglist>
            </div>
        </b-taglist>
    </div>
</template>
<script>
export default {
    name: "TagList",
    props: { tags: Array, single: Boolean, currentTagFilter: Array }
};
</script>
<style>
.tag {
    cursor: pointer;
    margin: 3px;
}
.packageTaglist {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>
