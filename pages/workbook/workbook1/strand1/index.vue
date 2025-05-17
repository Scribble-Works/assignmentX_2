<script setup>
import strand1 from '~/strand1.json';
definePageMeta({
    layout: 'dash',
});
const router = useRouter();
const config = useRuntimeConfig();
const strand1Contents = strand1.sub_strands;
// console.log(strand1Contents);


</script>
<template>
    <div class="mt-15" style="height: 100dvh;">
        <v-container>
            <h1 class="text-center text-orange text-uppercase text-bold" style="font-size: 3em;">Strand 1</h1>
            <h2 class="text-center text-orange text-uppercase text-bold" style="font-size: 2em;">number</h2>
            <v-row v-for="strand in strand1Contents" :key="strand.id">
                <v-col>
                    <NuxtLink :to="'/workbook/workbook1/strand1/substrand-' + strand.id+'/'">
                        <v-card>
                            <v-card-title class="font-weight-light text-center text-orange mb-2">{{ strand.title }}</v-card-title>
                        </v-card>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>