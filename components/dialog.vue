<script setup>
// const alert = ref(false);
const message = ref('');
const title = ref('');
defineProps({
    text: String,
    title: String,
    'v-model': Boolean
});
</script>
<template>
    <div>
        <v-dialog :v-model="v-model" width="auto">
            <v-card max-width="400" :title="title" :text="text">
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="alert = false"></v-btn>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>