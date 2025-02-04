<script setup>
import airtable from 'airtable';
const route = useRoute();

airtable.configure({
  apiKey: config.public.airtableKey,
  baseId: config.public.airtableBase,
});
const base = airtable.base(config.public.airtableBase)
const tableBase = base(config.public.airtableTable1);

const strands = await tableBase.select().all();
console.log(strands);
// const supabase = useSupabaseClient();

// const { data: strands } = await supabase.from('strands').select('*');
// console.log(strands);
definePageMeta({
    layout: 'dash',
});
</script>
<template>
    <div class="mt-15">
        <v-container>
            <v-row>
                <v-col v-for="strand in strands.data" :key="strand.id">
                    <NuxtLink :to="strand.slug">{{ strand.title }}</NuxtLink>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>