<script setup>
const resources = [{
    title: 'Number and Numerals',
    description: 'Understanding different number systems and their properties',
    link: ''
}];
</script>
<template>
    <div>
        <v-container>
            <v-text-field prepend-inner-icon="mdi-magnify" label="Search chapters and topics..." variant="outlined"></v-text-field><br>
                
            <card-resources />
        </v-container>
    </div>
</template>