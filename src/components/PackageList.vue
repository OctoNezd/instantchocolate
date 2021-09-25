<template>
    <div>
        <div v-if="displayList.length > 0">
            <div class="grid">
                <SoftwareItem
                    v-for="softwareitem in displayList.slice(
                        (currentPage - 1) * 40,
                        currentPage * 40
                    )"
                    :software="softwareitem"
                    :skeleton="false"
                    :key="softwareitem.packageName"
                    :minimalMode="viewType === 'gridlist'"
                />
            </div>
            <Pagination
                :totalPages="Math.floor(displayList.length / 40)"
                v-model="currentPage"
            />
        </div>
        <div v-else class="has-text-centered">
            <b-icon
                icon="emoticon-dead"
                custom-size="bigIcon"
                class="is-text bigIcon"
            />
            <h1 class="title is-text">Nothing found!</h1>
            <p class="subtitle is-text">
                Maybe try removing tags or changing search query?
            </p>
        </div>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import SoftwareItem from "@/components/SoftwareBlock.vue";

export default {
    components: { Pagination, SoftwareItem },
    props: { displayList: Array, viewType: String },
    data() {
        return { currentPage: 1 };
    }
};
</script>

<style>
.bigIcon {
    font-size: 128px;
    min-width: 128px;
    min-height: 128px;
}
</style>
