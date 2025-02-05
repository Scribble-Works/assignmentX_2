<script setup>
import strand4 from '~/strand4.json';
definePageMeta({
    layout: 'dash',
});
const router = useRouter();
const config = useRuntimeConfig();
const strand4Contents = strand4.records;
console.log(strand4Contents);
// const { data: strandVids } = await supabase.from('sub_strands').select('');
// console.log(strandVids);

// const {data: relatedVis} = await supabase.from('')
</script>
<template>
    <div class="mt-15">
        <v-container>
            <h1 class="text-center text-uppercase text-bold" style="font-size: 3em;">Strand 4</h1>
            <v-row v-for="strand in strand4Contents" :key="strand.id">
                <v-col>
                    <NuxtLink :to="'/strand4/' + strand.id">
                        <strong>{{ strand.fields.Sub_strand }}</strong>
                    </NuxtLink>
                    <v-spacer></v-spacer>
                    <v-row>
                        <v-col>
                            <v-btn color="primary">concept note</v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="success">BECE Questions</v-btn>
                        </v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <br>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>