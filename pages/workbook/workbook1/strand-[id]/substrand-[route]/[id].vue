<script setup>

// import strand1 from '~/strand1.json';
// definePageMeta({
//     layout: 'dash',
// });
const client = useSupabaseClient();
const route = useRoute();
const id = route.params.id;
const strand_ref = route.params.route;
const substrand = route.params.substrand;

const { data: substrands } = await client.from('book1_strand_substrands_lists').select().eq('route', strand_ref);

const strand_ref_id = substrands[0].strand_ref;
const substrand_ref_id = substrands[0].id;
const { data: files } = await client.from('book1_strands').select().eq('id', substrand_ref_id);

const { data: indicators_content } = await client.from('book1_substrand_indicators').select().eq('id', id);

const heading = indicators_content[0].indicators;
const vid1 = indicators_content[0].vid1;
const vid2 = indicators_content[0].vid2;
const vid3 = indicators_content[0].vid3;

const conceptNote = files[0].concept_notes;
const bece = files[0].BECE_Qquestions;

console.log(files);
// console.log(substrand_ref_id);





function openNotes() {
    navigateTo(conceptNote, {
        open: {
            windowFeatures: {
                width: 500,
                height: 500,
            }
        }
    })
};

function openBece() {
    navigateTo(bece, {
        open: {
            windowFeatures: {
                width: 500,
                height: 500,
            }
        }
    });
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    const ops = [
        { op: '+', fn: (a, b) => a + b },
        { op: '-', fn: (a, b) => a - b },
        { op: '×', fn: (a, b) => a * b },
        { op: '÷', fn: (a, b) => (b !== 0 ? (a / b).toFixed(2) : 'undefined') }
    ];
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    const opObj = ops[randomInt(0, ops.length - 1)];
    const question = `${a} ${opObj.op} ${b}`;
    const answer = opObj.fn(a, b);
    return { question, answer, flipped: false };
}

const cards = ref(Array.from({ length: 4 }, generateQuestion));

function flipCard(idx) {
    cards.value[idx].flipped = !cards.value[idx].flipped;
}

function generateCards() {
    cards.value = Array.from({ length: 4 }, generateQuestion);
}


</script>
<template>
    <div class="body">
        <v-container>
            <h2 class="text-center text-h4 text-uppercase text-bold mb-10 mt-15" style="font-weight: bold;">{{
                heading
                }}</h2>
            <v-row>

                <v-col cols="" lg="8" md="6" sm="12">
                    <introvid :intro="vid1" />
                </v-col>
                <v-col cols="" lg="4" md="6" sm="12">
                    <introvid :intro="vid2" />
                    <introvid :intro="vid3" />
                </v-col>
            </v-row>
            <v-row class="mt-n8">
                <v-col cols="" lg="2" sm="12" md="3">
                    <v-btn @click="openNotes" rounded color="grey-darken-3">Concept Note</v-btn>
                </v-col>
                <v-col cols="" lg="3" sm="12" md="5">
                    <v-btn @click="openBece" rounded color="grey-darken-3">Sample Questions</v-btn>
                </v-col>
                <v-col cols="" lg="3" sm="12" md="4">
                    <v-btn rounded color="grey-darken-3">Video transcription</v-btn>
                </v-col>
            </v-row>

            <div class="mt-15">
                <h3 class="text-h3 mb-5" style="font-family: 'Inter', sans-serif; font-weight: bold;">Worked Exam<span
                        style="text-decoration: underline; text-decoration-color: #FCC30C;">ples</span></h3>
                <v-container style="background-color: #F3F4F6;">
                    <v-img class="mt-10 mb-10" src="/img/example.png"></v-img>
                    <v-img class="mb-10" src="/img/solution.png"></v-img>
                </v-container>
            </div>

            <div class="mt-10">
                <h3 class="text-h3" style="font-family: 'Inter', sans-serif;"> Now Let's have some math <span
                        style="text-decoration: underline; text-decoration-color: #FCC30C;">fun</span></h3>
                <v-container style="background-color: #F3F4F6;">
                    <div class="mt-10">
                        <h5 class="text-h5 text-center" style="font-family: 'Inter', sans-serif; font-weight: bold;">
                            Flip Card Compare Game</h5><br>
                        <p class="text-center">Time Left: 20s</p><br>
                        <p class="text-center"><v-icon>mdi-clock</v-icon> Score: 2/4</p>
                    </div>


                    <div>
                        <v-row>
                            <v-col cols="12" md="6">
                                <div class="mx-auto d-flex justify-center">
                                    <div class="flip-card" @click="() => { cards[0] = generateQuestion(); }">
                                        <div :class="['flip-card-inner', { flipped: cards[0].flipped }]">
                                            <div class="flip-card-front">
                                                <h4 @click="flipCard(0)">{{ cards[0].question }}</h4>
                                            </div>
                                            <div class="flip-card-back">
                                                <h4>{{ cards[0].answer }}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>


                        </v-row>

                    </div>

                </v-container>
            </div>
        </v-container>
    </div>
</template>
<style>
.body {
    background: white;
}

.flip-card {
    background-color: transparent;
    width: 220px;
    height: 120px;
    perspective: 1000px;
    margin: 20px auto;
    cursor: pointer;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.flip-card-inner.flipped {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.flip-card-back {
    transform: rotateY(180deg);
    background: #f5f5f5;
}
</style>