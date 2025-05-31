<script setup>
const price = ref('GHS 10.00');
const client = useSupabaseClient();
const user = useSupabaseUser();

</script>
<template>
    <div class="mt-5">
        <v-container class="my-16">
            <v-row>
                <v-col cols="auto" lg="4" md="4" sm="6">
                    <NuxtLink to="/workbook/workbook1/">
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
                                <v-img :aspect-ratio="16 / 9" src="/img/grade7.jpg" cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering"
                                            class="d-flex bg-blue-grey-darken-1 v-card--reveal text-h2"
                                            style="height: 100%;">
                                            {{ price }}
                                        </div>
                                    </v-expand-transition>
                                </v-img>

                                <v-card-text class="pt-6">
                                    <h3 class="text-h4 font-weight-light text-black mb-2">
                                        First Assignment
                                    </h3>
                                    <div class="font-weight-light text-black text-h6 mb-2">
                                        Grade 7
                                    </div>




                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </NuxtLink>
                </v-col>
                <v-col cols="auto" lg="4" md="4" sm="6">
                    <NuxtLink>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
                                <v-img :aspect-ratio="16 / 9" src="/img/grade8.jpg" cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering"
                                            class="d-flex bg-blue-grey-darken-1 v-card--reveal text-h2"
                                            style="height: 100%;">
                                            {{ price }}
                                        </div>
                                    </v-expand-transition>
                                </v-img>

                                <v-card-text class="pt-6">
                                    

                                    <h3 class="text-h4 font-weight-light text-black mb-2">
                                        Second Assignment
                                    </h3>
                                    <div class="font-weight-light text-black text-h6 mb-2">
                                        Grade 8
                                    </div>


                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </NuxtLink>
                </v-col>
                <v-col cols="auto" lg="4" md="4" sm="6">
                    <NuxtLink>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
                                <v-img :aspect-ratio="16 / 9" src="/img/grade9.jpg" cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering"
                                            class="d-flex bg-blue-grey-darken-1 v-card--reveal text-h2"
                                            style="height: 100%;">
                                            {{ price }}
                                        </div>
                                    </v-expand-transition>
                                </v-img>

                                <v-card-text class="pt-6">
                                    <h3 class="text-h4 font-weight-light text-black mb-2">
                                        Last Assignment
                                    </h3>
                                    <div class="font-weight-light text-black text-h6 mb-2">
                                        Grade 9
                                    </div>


                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </NuxtLink>
                </v-col>
            </v-row>
        </v-container><br><br><br>
    </div>
</template>
<style>
.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
}

v-container {
    font-family: 'Inter', sans-serif;
}
</style>