<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ title }}</p>
        </header>
        <section class="modal-card-body">
            <slot />
        </section>
        <footer class="modal-card-foot">
            <b-button
                label="Close"
                @click="$emit('close')"
                expanded
                type="is-dark"
            />
        </footer>
    </div>
</template>
<script>
export default {
    props: ["title"]
};
</script>

<style></style>
