<script setup>
const search = ref('');




const filteredItems = computed(() => {
    if (!search.value) return items.value;
    return items.value.filter(item =>
        item.title.toLowerCase().includes(search.value.toLowerCase())
    );
});
</script>
<template>
    <v-app>
        <div class="body">
            <theHeader />
            <v-container>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search chapters and topics..."
                    variant="outlined"></v-text-field><br>
                <slot />
            </v-container>
            <theFooter />
        </div>
    </v-app>
</template>