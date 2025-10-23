<script setup>
const flipped = ref(false);

function flipCard() {
    flipped.value = !flipped.value;
};
</script>
<template>
    <div>
        <v-card 
            class="mx-auto flip-card" 
            height="400" 
            width="600" 
            elevation="2" 
            @click="flipCard"
            style="cursor: pointer;"
        >
            <div class="flip-card-inner" :class="{ flipped: flipped }">
                <!-- Front of card - Math equation -->
                <div class="flip-card-front d-flex align-center justify-center">
                    <div class="text-center">
                        <h3 class="text-h6 mb-2" style="color: #000000;">What is the answer?</h3>
                        <div class="text-h3 font-weight-bold" style="color: #424242;">
                            15 + 27 = ?
                        </div>
                    </div>
                </div>
                
                <!-- Back of card - Answer -->
                <div class="flip-card-back d-flex align-center justify-center">
                    <div class="text-center">
                        <h2 class="text-h4 mb-2" style="color: #4CAF50;">Answer:</h2>
                        <div class="text-h3 font-weight-bold" style="color: #424242;">
                            42
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </div>
</template>
<style scoped>
.flip-card {
    perspective: 1000px;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flip-card-inner.flipped {
    transform: rotateY(180deg);
}

.flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 4px;
}

.flip-card-front {
    background-color: #E3F2FD;
}

.flip-card-back {
    background-color: #E8F5E8;
    transform: rotateY(180deg);
}
</style>