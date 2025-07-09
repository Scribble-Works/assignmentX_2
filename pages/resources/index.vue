<script setup>
definePageMeta({
    layout: 'resources'
});
const resources = [
    {
        title: 'Number and Numerals',
        description: 'Understanding different number systems and their properties',
        link: ''
    },
    {
        title:' Fractions and Decimals',
        description: 'Exploring the concepts of fractions and decimals, their operations, and applications',
        link: ''
    },
    {
        title:'Power of Numbers',
        description:'Understanding the concept of powers, exponents, and their applications in mathematics',
        link: ''
    },
    {
        title:'Algebraic Expressions',
        description:'Introduction to algebraic expressions, their simplification, and evaluation',
        link: ''
    },
    {
        title:'Linear Equations',
        description:'Understanding linear equations, their solutions, and applications in real-life scenarios',
        link: ''
    },
    {
        title:'Geometry Basics',
        description:'Exploring basic geometric shapes, properties, and theorems',
        link: ''
    },
    {
        title:'Mensuration',
        description:'Understanding the concepts of area, volume, and surface area of various geometric shapes',
        link: ''
    },
    {
        title:'Statistics and Probability',
        description:'Introduction to statistics, data representation, and basic probability concepts',
        link: ''
    }
];
</script>
<template>
    <div>
        <v-row v-for="resource in resources" :key="resource">
            <v-col>
                <card-resources :link="resource.link" :title="resource.title" :description="resource.description" />
            </v-col>
        </v-row>
    </div>
</template>