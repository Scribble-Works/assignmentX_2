<script setup>
defineProps({
    title: String,
    description: String,
    img: String,
    quiz: Function,
    alert: Boolean
});
</script>
<template>
    <div>
        <v-dialog>
            <v-card :title="title" height="600">
                <v-img :src="img" class="mb-4" height="200"></v-img>
                <p class="text-center">{{ description }}</p>
                <v-card-actions>
                    <v-btn color="primary" @click="quiz">START QUIZ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>