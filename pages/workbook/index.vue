<script setup>
const price = ref('GHS 10.00');
</script>
<template>
    <div class="mt-5">
        <v-container class="my-16">
            <v-row>
                <v-col cols="auto" lg="4" md="4" sm="6">
                    <NuxtLink to="/workbook/workbook1/">
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
                                <v-img :aspect-ratio="16 / 9" src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                                    cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering" class="d-flex bg-orange-darken-2 v-card--reveal text-h2"
                                            style="height: 100%;">
                                            {{price}}
                                        </div>
                                    </v-expand-transition>
                                </v-img>

                                <v-card-text class="pt-6">
                                    <div class="font-weight-light text-grey text-h6 mb-2">
                                        Book 1
                                    </div>

                                    <h3 class="text-h4 font-weight-light text-orange mb-2">
                                        Assignment Workbook 1
                                    </h3>


                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </NuxtLink>
                </v-col>
                <v-col cols="auto" lg="4" md="4" sm="6">
                    <NuxtLink>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
                                <v-img :aspect-ratio="16 / 9" src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                                    cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering" class="d-flex bg-orange-darken-2 v-card--reveal text-h2"
                                            style="height: 100%;">
                                            {{price}}
                                        </div>
                                    </v-expand-transition>
                                </v-img>

                                <v-card-text class="pt-6">
                                    <div class="font-weight-light text-grey text-h6 mb-2">
                                        Book 2
                                    </div>

                                    <h3 class="text-h4 font-weight-light text-orange mb-2">
                                        Assignment Workbook 2
                                    </h3>


                                </v-card-text>
                            </v-card>
                        </v-hover>
                    </NuxtLink>
                </v-col>
                <v-col cols="auto" lg="4" md="4" sm="6">
                    <NuxtLink>
                        <v-hover v-slot="{ isHovering, props }">
                            <v-card class="mx-auto" color="grey-lighten-4" max-width="600" v-bind="props">
                                <v-img :aspect-ratio="16 / 9" src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                                    cover>
                                    <v-expand-transition>
                                        <div v-if="isHovering" class="d-flex bg-orange-darken-2 v-card--reveal text-h2"
                                            style="height: 100%;">
                                            {{price}}
                                        </div>
                                    </v-expand-transition>
                                </v-img>

                                <v-card-text class="pt-6">
                                    <div class="font-weight-light text-grey text-h6 mb-2">
                                        Book 3
                                    </div>

                                    <h3 class="text-h4 font-weight-light text-orange mb-2">
                                        Assignment Workbook 3
                                    </h3>


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
</style>