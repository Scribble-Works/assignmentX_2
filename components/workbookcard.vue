<script setup>
const Purchase = ref('Purchased');




const { grade, assignment, image } = defineProps([
    'grade',
    'assignment',
    'image'
]);


</script>
<template>
    <div>
        <NuxtLink to="/workbook/workbook1/">
            <v-hover v-slot="{ isHovering, props }">
                <v-card class="mx-auto" color="grey-lighten-4" max-width="600" height="365" v-bind="props">
                    <v-img :aspect-ratio="16 / 9" :src="image" cover>
                        <v-expand-transition>
                            <div v-if="isHovering" class="d-flex bg-blue-grey-darken-1 v-card--reveal text-h2"
                                style="height: 100%;">
                                {{ Purchase }}
                            </div>
                        </v-expand-transition>
                    </v-img>

                    <v-card-text class="pt-6">
                        <h3 class="text-h4 font-weight-light text-black mb-2">
                            {{ assignment }}
                        </h3>
                        <div class="font-weight-light text-black text-h6 mb-2">
                            {{ grade }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-hover>
        </NuxtLink>


    </div>
</template>