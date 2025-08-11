<script setup>
defineProps({
    text: String,
    title: String,
    alert: Boolean
});
</script>
<template>
    <div>
        <v-dialog v-model="alert" width="auto">
            <v-card max-width="400" :title="title" :text="text">
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="alert = false"></v-btn>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>