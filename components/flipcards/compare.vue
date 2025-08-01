<script setup>
const flipped = ref(false);

function flipCard() {
    flipped.value = !flipped.value;
};
</script>
<template>
    <div>
        <v-card class="mx-auto" height="200" width="400" elevation="2" @click="flipCard">
            <!-- <div class="d-flex align-center justify-center front-card" :class="{ isflipped: flipped }">
                
            </div> -->
            
        </v-card>
    </div>
</template>
<style>

</style>